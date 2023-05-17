import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { ThemeContext } from "./getTheme";
import { api } from "../services/api";
import { ServiceIdContext } from "./getServiceId";
import { FormContext } from "./useForm";
export const RoutesContext = createContext()




export function RoutesProvider({ children }) {
    const { code, stopId, locationType } = useContext(CodeContext)
    const { serviceId } = useContext(ServiceIdContext)
    const { routeType } = useContext(ThemeContext)
    const [routes, setRoutes] = useState()
    const [plataforms, setPlataforms] = useState([])
    const [stations, setStations] = useState()
    const [isParent, setIsParent] = useState()
    const [loader, setLoader] = useState()


    function compareTripName(a, b) {
        const aShortName = a.trip_id.trip_short_name;
        const bShortName = b.trip_id.trip_short_name;

        const aStartsWithLECD = aShortName.startsWith("LECD");
        const bStartsWithLECD = bShortName.startsWith("LECD");

        if (aStartsWithLECD && !bStartsWithLECD) {
            return 1;
        }
        if (!aStartsWithLECD && bStartsWithLECD) {
            return -1;
        }

        if (aStartsWithLECD && bStartsWithLECD) {
            const aNumber = parseInt(aShortName.replace(/\D/g, ""));
            const bNumber = parseInt(bShortName.replace(/\D/g, ""));
            return aNumber - bNumber;
        }

        const aNumber = parseInt(aShortName.replace(/\D/g, ""));
        const bNumber = parseInt(bShortName.replace(/\D/g, ""));
        return aNumber - bNumber;
    }

    function activateLoader() {
        setLoader(true)
        setPlataforms([])
    }
    const filteredTrips = [];
    const tripPromises = [];

    async function getMultiplePages(url) {
        const { data } = await api.get(url);

        for (const item of data.results) {
            const existingTrip = filteredTrips.find(
                (trip) =>
                    trip.trip_id.trip_short_name === item.trip_id.trip_short_name &&
                    trip.trip_id.direction_id === item.trip_id.direction_id
            );
            if (!existingTrip) {
                if (locationType === 1) {
                    const stopTimePromise = api.get(`/stop_times/?trip_id=${item.trip_id.trip_id}&service_id=${serviceId}`);
                    tripPromises.push(stopTimePromise);
                    filteredTrips.push(item);
                }
            }
        }

        if (data.next) {
            await getMultiplePages(data.next);
        } else {
            if (locationType === 1) {
                const stopTimeResponses = await Promise.all(tripPromises);
                stopTimeResponses.forEach((response, index) => {
                    const specificData = response.data.results;
                    if (Array.isArray(specificData) && specificData.length > 0) {
                        filteredTrips[index].lastStop = specificData[specificData.length - 1];
                    }
                });
                getStations(`/stop_times/?stop_id=${stopId}&service_id=${serviceId}`);
            }

            filteredTrips.sort(compareTripName);
            setRoutes([...filteredTrips]);
        }
    }

  
    let allStations = [];
    let filteredStations = [];

    async function getStations(url) {
        const { data } = await api.get(url);

        data.results.forEach((item) => {
            const existingStation = allStations.find(
                (e) => e.stop_id.stop_id === item.stop_id.stop_id
            );
            if (!existingStation) {
                allStations.push(item);
            }
        });

        const BRTplatform = allStations.filter(
            (e) => e.trip_id.route_id.route_type === 702
        );
        const stopIds = BRTplatform.map((item) =>
            api.get(`/stop_times/?stop_id=${item.stop_id.stop_id}&service_id=${serviceId}`)
        );
        const stopIdsResponses = await Promise.all(stopIds);

        for (let index = 0; index < stopIdsResponses.length; index++) {
            const response = stopIdsResponses[index];
            const stopTimes = response.data.results;
            console.log(stopTimes);

            const tripPromises = stopTimes.map((stopTime) =>
                api.get(`/stop_times/?trip_id=${stopTime.trip_id.trip_id}`)
            );

            const tripResponses = await Promise.all(tripPromises);

            let allLastStopsMatch = true; 

            for (let i = 0; i < tripResponses.length; i++) {
                console.log(response);
                console.log("item", tripResponses[i]);
                const tripResponse = tripResponses[i];
                const tripStopTimes = tripResponse.data.results;
                console.log(tripStopTimes);

                const lastStop = tripStopTimes[tripStopTimes.length - 1].stop_id.stop_id;

                if (lastStop !== stopTimes[i].stop_id.stop_id) {
                    allLastStopsMatch = false;
                    break; 
                }
            }

            if (allLastStopsMatch) {
                filteredStations.push(stopTimes[0]);
            }
        }

        console.log(filteredStations);

        if (data.next) {
            await getStations(data.next);
        } else {
            allStations = allStations.filter((station) => {
                const stationExistsInFiltered = filteredStations.some(
                    (filteredStation) => filteredStation.stop_id.stop_id === station.stop_id.stop_id
                );
                return !stationExistsInFiltered;
            });

            setStations([...allStations]);
        }
    }



    useEffect(() => {
        if (code && locationType != undefined && serviceId) {
            if (locationType === 1) {
                getStations(`/stop_times/?stop_id=${stopId}&service_id=${serviceId}`)
                setIsParent(true)
            } else if (locationType === 0) {
                getMultiplePages(`/stop_times/?stop_id=${stopId}&service_id=${serviceId}`)
                setIsParent(false)
            }
        }
    }, [routeType])



    useEffect(() => {
        if (routeType) {
            console.log(stations)
            if (locationType != null || locationType != undefined || stations != undefined) {
                const iteratee = stations.map((e) => e)
                const result = iteratee.reduce((acc, curr) => {
                    if (routeType.includes(3) && routeType.includes(702)) {
                        acc[curr.stop_id.platform_code] = acc[curr.stop_id.platform_code] || {};
                        acc[curr.stop_id.platform_code][curr.stop_id.stop_id] = curr;
                        return acc;
                    } else {
                        acc[curr.stop_id.stop_desc] = acc[curr.stop_id.stop_desc] || {};
                        acc[curr.stop_id.stop_desc][curr.stop_id.stop_id] = curr;
                        return acc;
                    }

                }, {});
                setPlataforms((prevResults) => [...prevResults, result]);
            }
        }
    }, [stations]);



    return (
        <RoutesContext.Provider value={{ routes, setRoutes, getMultiplePages, isParent, plataforms, setPlataforms, stations, setStations, loader, activateLoader }}>
            {children}
        </RoutesContext.Provider>
    )
}