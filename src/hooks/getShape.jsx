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
    const [stoppedFetching, setStoppedFetching] = useState(false);

    let arrivalsShapes = []
    function initPrevShapes(){
        if (arrivals != undefined) {
            if (!prevArrivals || !arrivals.some((arrival, index) => arrival.stop_id === prevArrivals[index]?.stop_id)) {
                arrivals.forEach((e) => {
                    arrivalsShapes.push(e.trip_id.shape_id)
                })

                setPrevArrivals(arrivals);
                setShapeIds(arrivalsShapes)
            }
        }
    }

    useEffect(() => {
        initPrevShapes()
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

    function returnAll(){
        Promise.all(
            shapeIds.map(url => fetchShapes("/shapes/?shape_id=" + url))
        )
            .then(results => {
               const sortedResults =  results.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence)
                setShapesResponses(sortedResults);
                setStoppedFetching(true)
            })
            .catch(error => {
                console.error(error);
            });
    }


    useEffect(() => {
      returnAll()
    }, [shapeIds])

    function setPrevShapesFunction() {
        if (stoppedFetching) {
            let points = []
            shapesResponses.forEach((item) => {
                const sortedPoints = item.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence)
                let longLat = sortedPoints.map(p => [p.shape_pt_lat * 1, p.shape_pt_lon * 1])
                points.push(longLat)
            })
            setPrevShapes([...points])
        } 
    }

    useEffect(() => {
     setPrevShapesFunction()
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
                    setStoppedFetching(false)
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
                setPrevShapes(split.features[0].geometry.coordinates.map(c => [c[1], c[0]]))
            } else {
                setPoints(line.geometry.coordinates.map(c => [c[1], c[0]]))
                setPrevShapes()
            }
        }


    }, [rawPoints])




    return (
        <ShapeContext.Provider value={{ points, setPoints, prevShapes, setPrevShapes, initPrevShapes, returnAll, setStoppedFetching }}>
            {children}
        </ShapeContext.Provider>
    )
}