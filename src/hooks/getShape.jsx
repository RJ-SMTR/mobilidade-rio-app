import { createContext, useContext, useEffect, useState } from "react";
import { TripContext } from "./getTrips";
import { CodeContext } from "./getCode";
import * as turf from '@turf/turf'
import { api } from "../services/api";


export const ShapeContext = createContext()


export function ShapeProvider({ children }) {
    const { code } = useContext(CodeContext)
    const { trip } = useContext(TripContext)
    const [points, setPoints] = useState([])
    const [shape, setShape] = useState([])
    const [stopCoords, setStopCoords] = useState()


    useEffect(() => {
        api.get('/stops/?stop_code=' + code.toUpperCase())
            .then(response => setStopCoords([response.data.results[0].stop_lon, response.data.results[0].stop_lat]))
    }, [code])

    useEffect(() => {
        api.get('/trips/?trip_id=' + trip)
            .then(reponse => setShape(reponse.data.results[0].shape_id))
    }, [trip])

    useEffect(() => {

        async function exec() {
            let points = []
            try {
                let i = 0
                let response = { data: {} }

                do {
                    response = await api.get(response.data.next || "/shapes/?shape_id=" + shape)
                    points.push(...response.data.results)
                    i += 20
                } while (response.data.next);


                let longLat = points.map(p => [p.shape_pt_lon * 1, p.shape_pt_lat * 1])

                var line = turf.lineString(longLat);
                var pt = turf.point(stopCoords)
                var splitter = turf.nearestPointOnLine(line, pt)
                var split = turf.lineSplit(line, splitter);


                setPoints(split.features[1].geometry.coordinates.map(c => [c[1], c[0]]))
                
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