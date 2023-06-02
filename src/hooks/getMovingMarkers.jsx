import { createContext, useContext, useState, useEffect } from "react"
import { CodeContext } from "./getCode"
import { api } from "../services/api"
import { NameContext } from "./getName"
import * as turf from '@turf/turf'
import { GPSContext } from "./getGPS"
import { garage1, garage2 } from "../components/garages";
import { RoutesContext } from "./getRoutes"
import { TripContext } from "./getTrips"
import { ServiceIdContext } from "./getServiceId"
import { FormContext } from "./useForm"



export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { code, locationType, stopId } = useContext(CodeContext)
    const { realtime } = useContext(GPSContext)
    const { setResults } = useContext(NameContext)
    const { routes } = useContext(RoutesContext)
    const { serviceId } = useContext(ServiceIdContext)
    const { selectedPlatform } = useContext(FormContext)
    const [tracked, setTracked] = useState([])
    const [innerCircle, setInnerCircle] = useState([])
    const [arrivals, setArrivals] = useState([])
    const [frequencies, setFrequencies] = useState([])
    const [routesAndFrequencies, setRoutesAndFrequencies] = useState([])




    useEffect(() => {
        if (code) {
            setResults()
        }
    }, [code])



    useEffect(() => {
        if (realtime && routes) {
            const currentTime = new Date().getTime();
            const filteredGPSData = realtime.reduce((filtered, item) => {
                const givenTime = new Date(item.dataHora).getTime();
                const timeDifference = currentTime - givenTime;
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;

                const result = {
                    code: item.codigo,
                    linha: item.trip_short_name,
                    lat: item.latitude,
                    lng: item.longitude,
                    velocidade: item.velocidade,
                    sentido: item.direction_id,
                    hora: [minutes, remainingSeconds],
                    chegada: item.estimated_time_arrival,
                    distancia: item.d_px_to_stop,
                };

                const pt = turf.point([item.longitude, item.latitude]);
                const poly = turf.polygon([garage1])
                const poly2 = turf.polygon([garage2])
                const scaledMultiPolygon = turf.transformScale(poly, 1.5);
                const scaledMultiPolygon2 = turf.transformScale(poly2, 1.5);

                if (
                    !filtered.some((r) => r.lat === result.lat && r.lng === result.lng) &&
                    !turf.booleanPointInPolygon(pt, scaledMultiPolygon) &&
                    !turf.booleanPointInPolygon(pt, scaledMultiPolygon2)
                ) {
                    filtered.push(result);
                }

                return filtered;
            }, []);

            const filteredGPS = filteredGPSData.filter((item) => {
                return routes.some((filterItem) => {
                    return (
                        item.linha === filterItem.trip_id.trip_short_name &&
                        item.hora[0] < 5 &&
                        item.distancia > -0.1 &&
                        item.chegada <= 15
                    );
                });
            });

            setTracked(filteredGPS);
        }
    }, [realtime]);


    let frequenciesList = [];
    async function getallFrequencies(url) {
        const fetchTime = new Date();
        const fetchHour = fetchTime.getHours();
        const fetchMinute = fetchTime.getMinutes();
        const fetchSecond = fetchTime.getSeconds();

        try {
            const { data } = await api.get(url);

            const filteredData = await Promise.all(
                data.results.map(async (item) => {
                    const startTime = item.start_time.split(":").map(Number);
                    const endTime = item.end_time.split(":").map(Number);

                    if (locationType === 1) {
                        if (
                            endTime[0] > fetchHour ||
                            (endTime[0] === fetchHour && endTime[1] > fetchMinute) ||
                            (endTime[0] === fetchHour &&
                                endTime[1] === fetchMinute &&
                                endTime[2] > fetchSecond)
                        ) {
                            return item;
                        }
                    } else {
                        if (
                            (startTime[0] < fetchHour ||
                                (startTime[0] === fetchHour && startTime[1] < fetchMinute) ||
                                (startTime[0] === fetchHour &&
                                    startTime[1] === fetchMinute &&
                                    startTime[2] < fetchSecond)) &&
                            (endTime[0] > fetchHour ||
                                (endTime[0] === fetchHour && endTime[1] > fetchMinute) ||
                                (endTime[0] === fetchHour &&
                                    endTime[1] === fetchMinute &&
                                    endTime[2] > fetchSecond))
                        ) {
                            return item
                        }
                    }
                })
            );

            if (data.next) {
                await getallFrequencies(data.next);
            } else {
                const frequenciesList = filteredData.filter(Boolean);
                setFrequencies([...frequenciesList]);
            }
        } catch (error) {
            console.error(error);
        }
    }




    useEffect(() => {
        if (routes) {
            if (locationType === 1) {
                const tripsList = routes
                    .filter((i) => i.stop_sequence === 0)
                    .map((i) => i.trip_id.trip_short_name)
                getallFrequencies(`/frequencies/?trip_short_name=${tripsList}&service_id=${serviceId}&stop_id=${stopId}`)
            } else {
                getallFrequencies(`/frequencies/?&stop_id=${stopId}&service_id=${serviceId}&show_all=true`)
            }
        }
    }, [routes])
    useEffect(() => {
        if (routes && frequencies) {
            console.log(frequencies)
            const filteredFrequenciesList = routes.reduce((acc, obj1) => {
                const matched = frequencies.filter((obj2) => {
                    return (
                        obj1.trip_id.trip_short_name === obj2.trip_id.trip_short_name &&
                        serviceId === obj2.trip_id.service_id
                    );
                });
                const combinedHeadways = matched.reduce((headwaysAcc, freq) => {
                    const headways = calculateHeadwayUntilEndTime(freq.start_time, freq.end_time, freq.headway_secs, freq.trip_id.shape_id, freq.trip_id.trip_id, freq.trip_id.direction_id);
                    return headwaysAcc.concat(headways);
                }, []).sort((a, b) => a.start_time.localeCompare(b.start_time));

                const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const filteredObj = { ...obj1, closestStartTime: null };
                if (combinedHeadways.length > 0) {
                    const closestStartTime = combinedHeadways.find((headway) => {
                        if (locationType === 1) {

                            return headway.start_time > currentTime;
                        } else {
                            return headway.end_time > currentTime;
                        }
                    });

                    if (closestStartTime) {
                        filteredObj.closestStartTime = closestStartTime.start_time.slice(0, -3);
                        if (locationType === 0) {
                            filteredObj.trip_id.shape_id = closestStartTime.shape_id;
                            filteredObj.trip_id.trip_id = closestStartTime.trip_id;
                            filteredObj.trip_id.direction_id = closestStartTime.direction_id;
                        }

                    }
                }

                if (locationType === 1) {
                    if (filteredObj.lastStop.stop_id.stop_id !== selectedPlatform[0]) {
                        acc.push(filteredObj);
                    }
                } else {
                    acc.push(filteredObj);
                }

                return acc;
            }, []);

            setRoutesAndFrequencies(filteredFrequenciesList);
        }
    }, [tracked, frequencies]);







    function calculateHeadwayUntilEndTime(start_time, end_time, headway_secs, shape_id, trip_id, direction_id) {
        const startTime = new Date(`1970-01-01T${start_time}Z`);
        const endTime = new Date(`1970-01-01T${end_time}Z`);

        const headways = [];
        let currentStartTime = startTime;
        while (currentStartTime < endTime) {
            const currentEndTime = new Date(currentStartTime.getTime() + headway_secs * 1000);
            if (currentEndTime > endTime) {
                currentEndTime.setTime(endTime.getTime());
            }
            const headway = {
                start_time: currentStartTime.toISOString().substr(11, 8),
                end_time: currentEndTime.toISOString().substr(11, 8),
                shape_id: shape_id,
                trip_id: trip_id,
                direction_id: direction_id
            };
            headways.push(headway);

            currentStartTime = currentEndTime;
        }

        headways.sort((a, b) => {
            if (a.start_time < b.start_time) return -1;
            if (a.start_time > b.start_time) return 1;
            return 0;
        });

        return headways;
    }



    useEffect(() => {
        if (routesAndFrequencies && tracked) {
            const arrivals = routesAndFrequencies.map((obj1) => {
                const matched = tracked.filter((obj2) => {
                    return (
                        obj1.trip_id.trip_short_name === obj2.linha &&
                        obj1.trip_id.direction_id === obj2.sentido
                    );
                });
                if (matched.length > 0) {
                    const smallestEtas = matched
                        .map((obj) => obj.chegada)
                        .sort((a, b) => a - b)
                        .slice(0, 3);
                    const combinedObj = {
                        ...obj1,
                        smallestEtas: smallestEtas,
                    };
                    return combinedObj;
                }
                return obj1;
            });

            setArrivals(arrivals);
        }
    }, [tracked, routesAndFrequencies]);



    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, innerCircle, setInnerCircle, arrivals, setArrivals, setRoutesAndFrequencies, routesAndFrequencies }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}