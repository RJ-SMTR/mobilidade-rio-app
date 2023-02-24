import { createContext, useContext, useState, useEffect } from "react"
import { CodeContext } from "./getCode"
import { api } from "../services/api"
import { NameContext } from "./getName"
import * as turf from '@turf/turf'
import { GPSContext } from "./getGPS"
import { garage1, garage2} from "../components/garages";
import { RoutesContext } from "./getRoutes"



export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { code } = useContext(CodeContext)
    const {realtime} = useContext(GPSContext)
    const { setResults } = useContext(NameContext)
    const {routes} = useContext(RoutesContext)
    const [center, setCenter] = useState()
    const [radius, setRadius] = useState()
    const [tracked, setTracked] = useState([])
    const [innerCircle, setInnerCircle] = useState([])
    




    useEffect(() => {
        api.get('/stops/?stop_code=' + code.toUpperCase())
            .then(response => {
                setCenter([parseFloat(response.data.results[0].stop_lat), parseFloat(response.data.results[0].stop_lon)])
                setRadius([parseFloat(response.data.results[0].stop_lon), parseFloat(response.data.results[0].stop_lat)])
            })
        setResults()
    }, [code])

    useEffect(() => {
        if (realtime) {
            let trackedBuses = []
            realtime.map((i) => {
                const currentTime = new Date().getTime();
                const timeDifference = currentTime - i.dataHora
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;

                const result = {
                    code: i.codigo,
                    linha: i.linha,
                    lat: i.latitude,
                    lng: i.longitude,
                    velocidade: i.velocidade,
                    sentido: i.sentido,
                    hora: [minutes, remainingSeconds]
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
            if(routes){
                let filteredGPS = trackedBuses.filter(item => {
                    return routes.some(filterItem => {
                        return item.linha === filterItem.trip_id.trip_short_name
                    });
                });


                setTracked(filteredGPS)
                setInnerCircle([])
           
            } else {
                if(radius){
                    let insideCircle = []
                    trackedBuses.forEach((item) => {
                        var pt = turf.point([item.lng, item.lat])
                        if (turf.booleanWithin(pt, turf.circle(radius, 3000, { units: 'meters' }))){
                            insideCircle.push(item)
                            
                        } 
                        
                    });
                    setInnerCircle(insideCircle)
                    
                }

            
            }
            
           
        }
    }, [realtime, radius])

    return (
        <MovingMarkerContext.Provider value={{ center, tracked, setTracked, innerCircle }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}
