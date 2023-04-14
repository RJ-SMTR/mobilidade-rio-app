import { createContext, useContext, useEffect, useState } from "react";
import { TripContext } from "./getTrips";
import { CodeContext } from "./getCode";
import * as turf from '@turf/turf'
import { api } from "../services/api";
import { MovingMarkerContext } from "./getMovingMarkers";



export const ShapeContext = createContext()


export function ShapeProvider({ children }) {
    const { stopCoords } = useContext(CodeContext)
    const { shape, sequenceInfo } = useContext(TripContext)
    const {arrivals} = useContext(MovingMarkerContext)
    const [points, setPoints] = useState([])
    const [rawPoints, setRawPoints] = useState()
    const [prevArrivals, setPrevArrivals] = useState([]);
    const [shapeIds, setShapeIds] = useState([])
    const [shapesResponses, setShapesResponses] = useState([])
    const [prevShapes, setPrevShapes] = useState([])

    let arrivalsShapes = []
    useEffect(() => {
        if (arrivals != undefined) {
            if (!prevArrivals || !arrivals.some((arrival, index) => arrival.stop_id === prevArrivals[index]?.stop_id)) {
                arrivals.forEach((e) => {
                    arrivalsShapes.push(e.trip_id.shape_id)
                })

                setPrevArrivals(arrivals);
                setShapeIds(arrivalsShapes)
            }
        }
    }, [arrivals, prevArrivals]);

      async function fetchShapes(url) {
        const response = await api.get(url)
        const data = response.data
        let results = data.results || []
        if (data.next) {
            const nextPageResults = await fetchShapes(data.next)
            results = results.concat(nextPageResults)
        }
        return results
    }

    useEffect(() => {
        Promise.all(
            shapeIds.map(url => fetchShapes("/shapes/?shape_id=" + url))
        )
            .then(results => {
                results.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence)
                setShapesResponses(results);
            })
            .catch(error => {
                console.error(error);
            });
    }, [shapeIds])

    useEffect(() => {
        if (shapesResponses.length > 0) {
            let points = []
            shapesResponses.forEach((item) => {
                let longLat = item.map(p => [p.shape_pt_lon * 1, p.shape_pt_lat * 1])
                var line = turf.lineString(longLat);
                var pt = turf.point(stopCoords)
                var splitter = turf.nearestPointOnLine(line, pt)
                var split = turf.lineSplit(line, splitter);
                if (split.features.length !== 1) {
                    points.push(split.features[0].geometry.coordinates.map(c => [c[1], c[0]]))
                }
            })
            setPrevShapes([...points])
        }
    }, [shapesResponses])


    

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
        <ShapeContext.Provider value={{ points, setPoints, prevShapes, setPrevShapes }}>
            {children}
        </ShapeContext.Provider>
    )
}