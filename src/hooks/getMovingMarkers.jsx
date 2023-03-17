import { createContext, useContext, useState, useEffect } from "react"
import { CodeContext } from "./getCode"
import { api } from "../services/api"
import { NameContext } from "./getName"
import * as turf from '@turf/turf'
import { GPSContext } from "./getGPS"
import { garage1, garage2 } from "../components/garages";
import { RoutesContext } from "./getRoutes"
import { TripContext } from "./getTrips"



export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { code, stopId } = useContext(CodeContext)
    const { realtime } = useContext(GPSContext)
    const { setResults } = useContext(NameContext)
    const { routes } = useContext(RoutesContext)
    const { stopInfo } = useContext(TripContext)
    const [tripsShortName, setTripShortName] = useState([])
    const [center, setCenter] = useState()
    const [radius, setRadius] = useState()
    const [tracked, setTracked] = useState([])
    const [innerCircle, setInnerCircle] = useState([])
    const [arrivals, setArrivals] = useState([])





    useEffect(() => {
        api.get('/stops/?stop_code=' + code.toUpperCase())
            .then(response => {
                setCenter([parseFloat(response.data.results[0].stop_lat), parseFloat(response.data.results[0].stop_lon)])
                setRadius([parseFloat(response.data.results[0].stop_lon), parseFloat(response.data.results[0].stop_lat)])
            })
        setResults()
    }, [code])

    //  NOVA CHAMADA EM STOP_TIMES PRA PODER TER O trip_short_name
    //  e filtrar os onibus do gps
    async function getTripNames(url) {
        let tripNames = [];
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    tripNames.push(item);
                });
                if (data.next) {
                    getTripNames(data.next);
                }
                setTripShortName([...tripNames]);
            });
    }

    useEffect(() => {
        if (stopId) {
            getTripNames('/stop_times/?stop_id=' + stopId)

        }
    }, [stopId])

    useEffect(() => {
        if (realtime && routes) {
            let trackedBuses = []
            realtime.map((i) => {
                const currentTime = new Date();
                const givenTime = new Date(i.dataHora);
                const timeDifference = currentTime - givenTime
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;

                const result = {
                    code: i.codigo,
                    linha: i.trip_short_name,
                    lat: i.latitude,
                    lng: i.longitude,
                    velocidade: i.velocidade,
                    sentido: i.direction_id,
                    hora: [minutes, remainingSeconds],
                    chegada: i.estimated_time_arrival,
                    distancia: i.d_px_to_stop,
                };

                const alreadyExists = trackedBuses.some(r => r.lat === result.lat && r.lng === result.lng);
                var pt = turf.point([i.longitude, i.latitude])
                var poly = turf.polygon([garage1])
                var poly2 = turf.polygon([garage2])
                const scaledMultiPolygon = turf.transformScale(poly, 1.5);
                const scaledMultiPolygon2 = turf.transformScale(poly2, 1.5);
                if (!alreadyExists && !turf.booleanPointInPolygon(pt, scaledMultiPolygon) && !turf.booleanPointInPolygon(pt, scaledMultiPolygon2)) {
                    trackedBuses.push(result);
                }
            });
            // if (routes) {
            let filteredGPS = trackedBuses.filter(item => {
                return routes.some(filterItem => {
                    if (stopInfo) {
                        return item.linha === filterItem.trip_id.trip_short_name && item.hora[0] < 5 && item.sentido === stopInfo.direction_id && item.distancia > -0.100
                    } else {
                        return (item.linha === filterItem.trip_id.trip_short_name && item.hora[0] < 5 && item.distancia > -0.100)
                    }
                });
            });
            setTracked(filteredGPS)
            setInnerCircle([])

            // } 
        }
    }, [realtime, routes])




    useEffect(() => {
        // Filtrar resultado pelo stop_id selecionado
        // Mostrar só 3 primeiros (os 3 primeiros menores tempos maiores q 0)
        // TENTAR RELACIONAR SEM O FOR 
        //  usar reduce
        if (routes && tracked) {
            const arrivals = routes.reduce((acc, obj1) => {
                const matched = tracked.filter(obj2 =>
                    obj1.trip_id.trip_short_name === obj2.linha &&
                    obj1.trip_id.direction_id === obj2.sentido
                );

                if (matched.length > 0) {
                    const sortedMatched = matched.sort((a, b) => a.chegada - b.chegada);
                    const smallestEtas = sortedMatched.slice(0, 3).map(obj2 => obj2.chegada);
                    const combinedObj = { ...obj1, smallestEtas };
                    acc.push(combinedObj);
                }

                return acc;
            }, []);

            setArrivals(arrivals);
        }

    }, [routes, tracked])


    return (
        <MovingMarkerContext.Provider value={{ center, tracked, setTracked, innerCircle, setInnerCircle, arrivals, setArrivals }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}
