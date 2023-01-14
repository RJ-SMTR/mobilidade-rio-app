import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { api } from "../services/api";
export const RoutesContext = createContext()




export function RoutesProvider({ children }) {
    const { code } = useContext(CodeContext)
    const [stopId, setStopId] = useState()
    const [routes, setRoutes] = useState()
    const [plataforms, setPlataforms] = useState([])
    const [locationType, setLocationType] = useState()
    const [stations, setStations] = useState()
    const [isParent, setIsParent] = useState(false)


    useEffect(() => {
        api
            .get("/stops/?stop_code=" + code.toUpperCase())
            .then(response => setStopId(response.data.results[0].stop_id))
    }, [code])

    useEffect(() => {
     
        api.get("/stops/?stop_code=" + code.toUpperCase())
            .then(response => setLocationType(response.data.results[0].location_type))
    }, [code, stopId])

    let allTrips = []
    async function getMultiplePages(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => { allTrips.push(item) })
                if (data.next) {
                    getMultiplePages(data.next)
                }
                    setRoutes([...allTrips])
            })
   
    }

    let allStations = []
    async function getStations(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => { allStations.push(item) })
                if (data.next) {
                    getStations(data.next)
                }
                    setStations([...allStations])
            })
   
    }

    function checkParent(){
        if (locationType === 1){
            setIsParent(true)
        } else if (locationType === 0) {
            setIsParent(false)
        }
    }
    useEffect(() => {
        if(stopId != undefined || stopId != null){
            checkParent()
        }
    }, [code, locationType])

    useEffect(() => {
        if(stopId != undefined || stopId != null){
            if(locationType === 1){
                getStations("/stop_times/?stop_id=" + stopId)
            } else if(locationType === 0){
                getMultiplePages("/stop_times/?stop_id=" + stopId)
            }
        }
    }, [isParent])

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
        <RoutesContext.Provider value={{ routes, stopId, setRoutes, getMultiplePages, isParent, plataforms, setPlataforms, stations, locationType }}>
            {children}
        </RoutesContext.Provider>
    )
}