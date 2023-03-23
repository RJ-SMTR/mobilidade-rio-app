import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { ThemeContext } from "./getTheme";
import { api } from "../services/api";
import { ServiceIdContext } from "./getServiceId";
export const RoutesContext = createContext()




export function RoutesProvider({ children }) {
    const { code, stopId, locationType } = useContext(CodeContext)
    const {serviceId} = useContext(ServiceIdContext)
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

    function activateLoader(){
    setLoader(true)
    setPlataforms([])
    }

    const filteredTrips = [];
    async function getMultiplePages(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    const existingTrip = filteredTrips.find((trip) => trip.trip_id.trip_short_name === item.trip_id.trip_short_name);
                    if (item.trip_id.service_id === serviceId && !existingTrip) {
                        filteredTrips.push(item);
                    }
                });
                if (data.next) {
                    getMultiplePages(data.next);
                    
                } else {
                    if(locationType === 1){
                        getStations("/stop_times/?stop_id=" + stopId)
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
                data.results.forEach((item) => { allStations.push(item) })
              
                    setStations(allStations)
            })
   
    }


    useEffect(() => {
        if (code && locationType != undefined) {
            if (locationType === 1) {
                getStations("/stop_times/?stop_id=" + stopId)
                setIsParent(true)
            } else if (locationType === 0) {
                getMultiplePages("/stop_times/?stop_id=" + stopId)
                setIsParent(false)
            }
        }
    }, [routeType])



    useEffect(() => {
        if (routeType) {
            if (locationType != null || locationType != undefined || stations != undefined ) {
                const iteratee = stations.map((e) => e.stop_id)
                const result = iteratee.reduce((acc, curr) => {
                    if (routeType.includes(3) && routeType.includes(702)) {
                        acc[curr.platform_code] = acc[curr.platform_code] || {};
                        acc[curr.platform_code][curr.stop_id] = curr;
                        return acc;
                    } else {
                        acc[curr.stop_desc] = acc[curr.stop_desc] || {};
                        acc[curr.stop_desc][curr.stop_id] = curr;
                        return acc;
                    }

                }, {});
                setPlataforms((prevResults) => [...prevResults, result]);
            }
        }
    }, [stations]);
    


    return (
        <RoutesContext.Provider value={{ routes, setRoutes, getMultiplePages, isParent, plataforms, setPlataforms, stations, setStations, loader, activateLoader}}>
            {children}
        </RoutesContext.Provider>
    )
}