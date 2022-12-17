import { createContext, useContext, useEffect, useState } from "react";
import { TripContext } from "./getTrips";
import { CodeContext } from "./getCode";
import * as turf from '@turf/turf'
import axios from 'axios'


export const ShapeContext = createContext()


export function ShapeProvider({ children }) {
    const {code } = useContext(CodeContext)
    const {trip} = useContext(TripContext)
    const [points, setPoints] = useState([])
    const [shape, setShape] = useState([])
    const [stopCoords, setStopCoords] = useState()


    useEffect(() => {
        axios.get('https://api.dev.mobilidade.rio/gtfs/stops/?stop_code=' + code.toUpperCase())
            .then(response => setStopCoords([response.data.results[0].stop_lon, response.data.results[0].stop_lat]))  
    }, [code])

    useEffect(() => {
        axios.get('https://api.dev.mobilidade.rio/gtfs/trips/?trip_id=' + trip)
            .then(reponse => setShape(reponse.data.results[0].shape_id))
    }, [trip])
    
    useEffect(() => {
        
        async function exec() {
            let points = []
            try {
                let i = 0
                let response = { data: {} }

                do {
                    // TODO - api deve permitir retornar pelo menos 1000 resultados por página
                    response = await axios.get(response.data.next || "https://api.dev.mobilidade.rio/gtfs/shapes/?shape_id=" + shape) 
                    points.push(...response.data.results)
                    i += 20
                } while (response.data.next);
                

                let latLong = points.map(p => [p.shape_pt_lat, p.shape_pt_lon])
                let longLat = points.map(p => [p.shape_pt_lon*1, p.shape_pt_lat*1])

                var line = turf.lineString(longLat);
                var pt = turf.point(stopCoords)
                var splitter = turf.nearestPointOnLine(line, pt)
                var split = turf.lineSplit(line, splitter);


                setPoints(split.features[1].geometry.coordinates.map(c => [c[1],c[0]]))
            } catch (error) {
                console.error(error)
            }
        }

        exec()
    }, [shape])


 

    return (
        <ShapeContext.Provider value={{ shape, setShape, points, setPoints }}>
            {children}
        </ShapeContext.Provider>
    )
}