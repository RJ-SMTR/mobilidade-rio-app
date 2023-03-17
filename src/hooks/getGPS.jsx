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
    const {gpsUrl} = useContext(CodeContext)


    const [intervalId, setIntervalId] = useState(null);

    let allBuses = [];

    async function getGPS(url) {
        await gps.get(url).then(({ data }) => {
            data.results.forEach((item) => {
                allBuses.push(item);
            });

            if (data.next) {
                getGPS(data.next);
            } else {
                setRealtime([...allBuses]);
                allBuses = [];
            }
        });
    }

    function startFetching() {
        const id = setInterval(() => {
            getGPS(gpsUrl); 
        }, 6000);
        setIntervalId(id);
    }

    function stopFetching() {
        clearInterval(intervalId);
        setIntervalId(null);
    }

    useEffect(() => {
        if(gpsUrl){
            startFetching();
            return () => {
                stopFetching();
            };
        }
    }, [gpsUrl]);

    return (
        <GPSContext.Provider value={{ realtime, getGPS, stopFetching }}>
            {children}
        </GPSContext.Provider>
    )
}