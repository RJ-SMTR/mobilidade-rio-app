import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { api } from "../services/api";
import { gps } from "../services/gps"
import axios from "axios"
import { RoutesContext } from "./getRoutes";
import { CodeContext } from "./getCode";


export const GPSContext = createContext()




export function GPSProvider({ children }) {
    const [realtime, setRealtime] = useState([])

    let allBuses = []
    async function getGPS(url) {
        await gps
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    allBuses.push(item)
                })

                if (data.next) {
                    getGPS(data.next)
                } else {
                    setRealtime([...allBuses])
                   
                }
            })
    }




    return (
        <GPSContext.Provider value={{ realtime, getGPS }}>
            {children}
        </GPSContext.Provider>
    )
}