import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { ThemeContext } from "./getTheme";
import { api } from "../services/api";
import { ServiceIdContext } from "./getServiceId";
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
    async function getMultiplePages(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    const existingTrip = filteredTrips.find((trip) => trip.trip_id.trip_short_name === item.trip_id.trip_short_name && trip.trip_id.direction_id === item.trip_id.direction_id);
                    if (!existingTrip) {
                        filteredTrips.push(item);
                    }
                });
                if (data.next) {
                    getMultiplePages(data.next);

                } else {
                    if (locationType === 1) {
                        getStations(`/stop_times/?stop_id=${stopId}&service_id=${serviceId}`)
                    }
                    filteredTrips.sort(compareTripName)
                    setRoutes([...filteredTrips]);
                }

            });
    }

    let allStations = []
    async function getStations(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    const existingStation = allStations.find((e) => e.stop_id.stop_id === item.stop_id.stop_id);
                    if (!existingStation) {
                        allStations.push(item)
                    }
                })
                if (data.next) {
                    getStations(data.next)
                } else {
                    setStations([...allStations])
                }

            })

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