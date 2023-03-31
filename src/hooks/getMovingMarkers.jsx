import { createContext, useContext, useState, useEffect } from "react"
import { CodeContext } from "./getCode"
import { api } from "../services/api"
import { NameContext } from "./getName"
import * as turf from '@turf/turf'
import { GPSContext } from "./getGPS"
import { garage1, garage2 } from "../components/garages";
import { RoutesContext } from "./getRoutes"
import { TripContext } from "./getTrips"



export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { code } = useContext(CodeContext)
    const { realtime } = useContext(GPSContext)
    const { setResults } = useContext(NameContext)
    const { routes } = useContext(RoutesContext)
    const { stopInfo } = useContext(TripContext)
    const [tracked, setTracked] = useState([])
    const [innerCircle, setInnerCircle] = useState([])
    const [arrivals, setArrivals] = useState([])





    useEffect(() => {
        if(code){
            setResults()
        }
    }, [code])

   
    useEffect(() => {
        if (realtime && routes) {
            let trackedBuses = []
            realtime.map((i) => {
                const currentTime = new Date();
                const givenTime = new Date(i.dataHora);
                const timeDifference = currentTime - givenTime
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;

                const result = {
                    code: i.codigo,
                    linha: i.trip_short_name,
                    lat: i.latitude,
                    lng: i.longitude,
                    velocidade: i.velocidade,
                    sentido: i.direction_id,
                    hora: [minutes, remainingSeconds],
                    chegada: i.estimated_time_arrival,
                    distancia: i.d_px_to_stop,
                };

                const alreadyExists = trackedBuses.some(r => r.lat === result.lat && r.lng === result.lng);
                var pt = turf.point([i.longitude, i.latitude])
                var poly = turf.polygon([garage1])
                var poly2 = turf.polygon([garage2])
                const scaledMultiPolygon = turf.transformScale(poly, 1.5);
                const scaledMultiPolygon2 = turf.transformScale(poly2, 1.5);
                if (!alreadyExists && !turf.booleanPointInPolygon(pt, scaledMultiPolygon) && !turf.booleanPointInPolygon(pt, scaledMultiPolygon2)) {
                    trackedBuses.push(result);
                }
            });
            let filteredGPS = trackedBuses.filter(item => {
                return routes.some(filterItem => {
              
                        return (item.linha === filterItem.trip_id.trip_short_name && item.hora[0] < 5 && item.distancia > -0.100 && item.chegada <= 15)
                });
            });
            setTracked(filteredGPS)
        }
    }, [realtime])


    useEffect(() => {
        if (routes && tracked) {
            const arrivals = routes.map((obj1) => {
                const matched = tracked.filter((obj2) => {
                    return (
                        obj1.trip_id.trip_short_name === obj2.linha &&
                        obj1.trip_id.direction_id === obj2.sentido
                    );
                });

                if (matched.length > 0) {
                    const smallestEtas = matched
                        .map((obj) => obj.chegada) 
                        .sort((a, b) => a - b)
                        .slice(0, 3); 
                    const combinedObj = {
                        ...obj1,
                        smallestEtas: smallestEtas,
                    };
                    return combinedObj;
                }

                return obj1;
            });

            setArrivals(arrivals);
        }
    }, [tracked]);



    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, innerCircle, setInnerCircle, arrivals, setArrivals }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}
