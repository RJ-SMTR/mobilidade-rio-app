import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import axios from "axios";
import { RoutesContext } from "./getRoutes";
import * as turf from '@turf/turf'
import { TripContext } from "./getTrips";
import { garage1 } from "../components/garages";

export const GPSContext = createContext()




export function GPSProvider({ children }) {
    const { routes } = useContext(RoutesContext)
    const {trip, stopInfo} = useContext(TripContext)
    const [tracked, setTracked] = useState([])
    const [currentTrack, setCurrentTrack] = useState({});

    const URL = import.meta.env.VITE_BRT_URL
    const Login = import.meta.env.VITE_BRT_USR
    const Pass = import.meta.env.VITE_BRT_PW
    const Client = import.meta.env.VITE_BRT_ID

    console.log(URL)
    console.log(Login)
    console.log(Pass)
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(URL, {
                method: 'GET',
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    'login': Login,
                    'senha': Pass,
                    'idcliente': Client

                }
            })
                .then(response => {
                 
                    let trackedBuses = [];
                    response.data.veiculos.forEach((item) => {
                        const currentTime = new Date().getTime();
                        const timeDifference = currentTime - item.dataHora
                        const seconds = Math.floor(timeDifference / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = seconds % 60;



                        const result = {
                            code: item.codigo,
                            linha: item.linha,
                            lat: item.latitude,
                            lng: item.longitude,
                            velocidade: item.velocidade,
                            hora: [minutes, remainingSeconds]
                        };

                        const alreadyExists = trackedBuses.some(r => r.lat === result.lat && r.lng === result.lng);
                        var pt = turf.point([item.longitude, item.latitude])
                        var poly = turf.polygon([garage1]);
                        var scaledPoly = turf.transformScale(poly, 1.5);
                        if (!alreadyExists && !turf.booleanPointInPolygon(pt, scaledPoly)) {
                            trackedBuses.push(result);
                        }

                    });

                    let filteredGPS = trackedBuses.filter(item => {
                        return routes.some(filterItem => {
                            return item.linha === filterItem.trip_id.trip_short_name
                        });
                    });

                    setTracked(filteredGPS)

                })
        }, 6000);
        return () => clearInterval(interval);
    }, [routes]);
    useEffect(() => {
        var teste = import.meta.env.BRT_URL
    }, [])

    return (
        <GPSContext.Provider value={{ tracked, currentTrack, setTracked }}>
            {children}
        </GPSContext.Provider>
    )
}