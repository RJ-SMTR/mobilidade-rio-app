import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { api } from "../services/api";
export const RoutesContext = createContext()



export function RoutesProvider({children}){
    const {code} = useContext(CodeContext)
    const [stopId, setStopId] = useState()
    const [routes, setRoutes] = useState()

     
    useEffect(() => {
        api
            .get("/stops/?stop_code=" + code.toUpperCase())
            .then(response => setStopId(response.data.results[0].stop_id))
    }, [code])


    let allTrips = []
   async function getMultiplePages(url) {
       await  api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => { allTrips.push(item) })
                if (data.next) {
                    getMultiplePages(data.next)
                } 


                setRoutes([...allTrips])
            })
    }
    
    useEffect(() => {
        getMultiplePages("/stop_times/?stop_id=" + stopId)
    }, [stopId])
    

   
    return(
        <RoutesContext.Provider value={{routes, stopId ,setRoutes, getMultiplePages}}>
            {children}
        </RoutesContext.Provider>
    )
}