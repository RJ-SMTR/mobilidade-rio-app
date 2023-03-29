import { createContext, useEffect, useState, useContext } from "react";
import { api } from "../services/api";
import { CodeContext } from "./getCode";


export const TripContext = createContext()



export function TripProvider({ children }) {
    const { stopId, locationType, name } = useContext(CodeContext)
    const [trip, setTrip] = useState('')
    const [stopInfo, setStopInfo] = useState()
    const [sequenceInfo, setSequenceInfo] = useState()
    const [allSequenceStops, setAllSequenceStops] = useState([])
    const [shape, setShape] = useState()

    const tripSelector = (selectedTrip) => {
        setTrip(selectedTrip);
    }

    let allStops = []
    async function getAllStops(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => { allStops.push(item) })
                if (data.next) {
                    getAllStops(data.next)
                }

                setAllSequenceStops([...allStops])

            })
    }

    // GET SEQUENCESTOPS
    useEffect(() => {
        if(trip){
            setStopInfo(trip)
            setShape(trip.shape_id)
            getAllStops(`/stop_times/?trip_id=${trip.trip_id}&direction_id=${trip.direction_id}`)
        }
    }, [trip])

    useEffect(() => {

     
        if (locationType === 1) {
            const mapSequence = allSequenceStops?.map(e => e.stop_id.stop_name).indexOf(name)
            const filteredSequence = allSequenceStops?.splice(mapSequence)
            setSequenceInfo(filteredSequence)
        } else {
            const mapSequence = allSequenceStops?.map(e => e.stop_id.stop_id).indexOf(stopId)
            const filteredSequence = allSequenceStops?.splice(mapSequence)
            setSequenceInfo(filteredSequence)
        }
    }, [allSequenceStops])
    return (
        <TripContext.Provider value={{ trip, setTrip, tripSelector, sequenceInfo, stopInfo, setSequenceInfo, shape }}>
            {children}
        </TripContext.Provider>
    )
}