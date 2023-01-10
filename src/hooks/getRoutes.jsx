import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { api } from "../services/api";
import{ indexBy } from 'underscore';
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
        api.get("/stops/?stop_code=" + code.toUpperCase())
            .then(response => setLocationType(response.data.results[0].location_type))
    
    }, [code])

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
            if(locationType ===1){
                getStations("/stop_times/?stop_id=" + stopId)
            } else if(locationType === 0){
                getMultiplePages("/stop_times/?stop_id=" + stopId)
            }
            checkParent()
        }
    }, [stopId, locationType])
    useEffect(() => {
        if (locationType != null || locationType != undefined || stations != undefined) {
            const result = indexBy(stations, 'stop_id');
            setPlataforms((prevResults) => [...prevResults, result]);
        }
    }, [stations]);
    
    return (
        <RoutesContext.Provider value={{ routes, stopId, setRoutes, getMultiplePages, isParent, plataforms }}>
            {children}
        </RoutesContext.Provider>
    )
}