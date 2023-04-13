import { createContext, useContext, useEffect, useState } from "react";
import { TripContext } from "./getTrips";
import { CodeContext } from "./getCode";
import * as turf from '@turf/turf'
import { api } from "../services/api";


export const ShapeContext = createContext()


export function ShapeProvider({ children }) {
    const { stopCoords } = useContext(CodeContext)
    const { shape, sequenceInfo } = useContext(TripContext)
    const [points, setPoints] = useState([])
    const [rawPoints, setRawPoints] = useState()




    let allPoints = []
    async function getAllPoints(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => { allPoints.push(item) })
                if (data.next) {
                    getAllPoints(data.next)
                } else {
                    allPoints.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence)
                    setRawPoints([...allPoints])
                }


            })
    }
    useEffect(() => {
        if (sequenceInfo) {
            getAllPoints("/shapes/?shape_id=" + shape)
        }
    }, [sequenceInfo])

    useEffect(() => {
        if (rawPoints) {

            let longLat = rawPoints.map(p => [p.shape_pt_lon * 1, p.shape_pt_lat * 1])
            var line = turf.lineString(longLat);
            var pt = turf.point(stopCoords)
            var splitter = turf.nearestPointOnLine(line, pt)
            var split = turf.lineSplit(line, splitter)

            if (split.features.length == 2) {
                setPoints(split.features[1].geometry.coordinates.map(c => [c[1], c[0]]))
            } else {
                setPoints(line.geometry.coordinates.map(c => [c[1], c[0]]))
            }



        }

    }, [rawPoints])




    return (
        <ShapeContext.Provider value={{ points, setPoints }}>
            {children}
        </ShapeContext.Provider>
    )
}