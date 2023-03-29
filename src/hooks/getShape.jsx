import { createContext, useContext, useEffect, useState } from "react";
import { TripContext } from "./getTrips";
import { CodeContext } from "./getCode";
import * as turf from '@turf/turf'
import { api } from "../services/api";


export const ShapeContext = createContext()


export function ShapeProvider({ children }) {
    const { stopCoords } = useContext(CodeContext)
    const { shape } = useContext(TripContext)
    const [points, setPoints] = useState([])
    




    useEffect(() => {
        if(shape){

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
        }

    }, [shape])




    return (
        <ShapeContext.Provider value={{ points, setPoints }}>
            {children}
        </ShapeContext.Provider>
    )
}