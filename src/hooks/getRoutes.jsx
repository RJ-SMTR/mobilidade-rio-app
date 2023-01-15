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
    const [isParent, setIsParent] = useState()
    const [teste, setTeste] = useState()


    useEffect(() => {
        if (code != undefined) {
            api
                .get("/stops/?stop_code=" + code.toUpperCase())
                .then(response => {
                    setStopId(response.data.results[0].stop_id)
                    setLocationType(response.data.results[0].location_type)
                })
        }
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
        <RoutesContext.Provider value={{ routes, stopId, setRoutes, getMultiplePages, isParent, plataforms, setPlataforms, stations}}>
            {children}
        </RoutesContext.Provider>
    )
}