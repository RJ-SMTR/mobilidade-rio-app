import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { api } from "../services/api";
import { ServiceIdContext } from "./getServiceId";
export const RoutesContext = createContext()




export function RoutesProvider({ children }) {
    const { code } = useContext(CodeContext)
    const {serviceId} = useContext(ServiceIdContext)
    const [stopId, setStopId] = useState()
    const [routes, setRoutes] = useState()
    const [plataforms, setPlataforms] = useState([])
    const [locationType, setLocationType] = useState()
    const [stations, setStations] = useState()
    const [isParent, setIsParent] = useState()
    const [childName, setChildName] = useState()
    const [loader, setLoader] = useState()


    useEffect(() => {
        if (code != undefined) {
            api
                .get("/stops/?stop_code=" + code.toUpperCase())
                .then(response => {
                    setStopId(response.data.results[0].stop_id)
                    setChildName(response.data.results[0].stop_name)
                    setLocationType(response.data.results[0].location_type)
                })
        }
    }, [code])
    function compareTripName(a, b) {
        const aNumber = parseInt(a.trip_id.trip_short_name.replace(/\D/g, ''));
        const bNumber = parseInt(b.trip_id.trip_short_name.replace(/\D/g, ''));
        return aNumber - bNumber;
    }
    function activateLoader(){
    setLoader(true)
    setPlataforms([])
    }

    async function getMultiplePages(url) {
        const filteredTrips = [];
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    if (item.trip_id.service_id === serviceId) {
                        filteredTrips.push(item);
                    }
                });
                if (data.next) {
                    getMultiplePages(data.next);
                    
                } else {
                    if(locationType === 1){
                        setLoader(false)
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
    }, [stopId, locationType])



    useEffect(() => {
        if (locationType != null || locationType != undefined || stations != undefined) {
            const iteratee =  stations.map((e) => e.stop_id)
            const result = iteratee.reduce((acc, curr) => {
                acc[curr.stop_desc] = acc[curr.stop_desc] || {};
                acc[curr.stop_desc][curr.stop_id] = curr;
                return acc;
            }, {});
            setPlataforms((prevResults) => [...prevResults, result]);
        }
    }, [stations]);

    return (
        <RoutesContext.Provider value={{ routes, stopId, setRoutes, getMultiplePages, isParent, plataforms, setPlataforms, stations, locationType, childName, loader, activateLoader}}>
            {children}
        </RoutesContext.Provider>
    )
}