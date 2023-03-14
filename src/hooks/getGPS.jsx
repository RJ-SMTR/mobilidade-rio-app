import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { api } from "../services/api";
import {gps} from "../services/gps"
import axios from "axios"
import { RoutesContext } from "./getRoutes";


export const GPSContext = createContext()




export function GPSProvider({ children }) {
    const { stopId } = useContext(RoutesContext)
    const [realtime, setRealtime] = useState([])
    const [childStopId, setChildStopId] = useState([])

    let childStops = new Set();
    async function getChildStops(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    childStops.add(item.stop_id.stop_id);

                });
                if (data.next) {
                    getChildStops(data.next);
                }
                setChildStopId([...childStops]);

            });
    }

    useEffect(() => {
        if (stopId) {
            getChildStops('/stop_times/?stop_id=' + stopId)
        }
    }, [stopId])


    useEffect(() => {
        const fetchRealtimeData = async () => {
            const realtimeData = [];

            for (const stops of childStopId) {
                const response = await gps.get(`?stop_id=${stops}`, {
                    method: 'GET',
                    mode: 'cors',
                });
                realtimeData.push(...response.data.results);
            }
            setRealtime(realtimeData);

        };
        fetchRealtimeData();

        const interval = setInterval(() => {
            fetchRealtimeData();
        }, 3000);

        return () => clearInterval(interval);
    }, [childStopId]);


    return (
        <GPSContext.Provider value={{ realtime }}>
            {children}
        </GPSContext.Provider>
    )
}