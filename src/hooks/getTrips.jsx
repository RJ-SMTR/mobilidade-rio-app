import { createContext, useEffect, useState, useContext } from "react";
import { api } from "../services/api";
import { CodeContext } from "./getCode";
import { ServiceIdContext } from "./getServiceId";
import { findBestMatch } from "string-similarity";


export const TripContext = createContext()



export function TripProvider({ children }) {
    const { stopId, locationType, name } = useContext(CodeContext)
    const [trip, setTrip] = useState('')
    const [stopInfo, setStopInfo] = useState()
    const [sequenceInfo, setSequenceInfo] = useState()
    const [allSequenceStops, setAllSequenceStops] = useState([])
    const [shape, setShape] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {serviceId} = useContext(ServiceIdContext)

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
                } else {
                    setIsLoading(false)
                    allStops.sort((a, b) => a.stop_sequence - b.stop_sequence);
                    setAllSequenceStops([...allStops])
                }


            })
    }

    // GET SEQUENCESTOPS
    useEffect(() => {
        if (trip) {
            setStopInfo(trip)
            setShape(trip.trip_id.shape_id)
            if(locationType === 1){
                getAllStops(`/stop_times/?trip_id=${trip.trip_id.trip_id}&direction_id=${trip.trip_id.direction_id}&service_id=${serviceId}`)
            } else {
                getAllStops(`/stop_times/?trip_id=${trip.trip_id.trip_id}&direction_id=${trip.trip_id.direction_id}&service_id=${serviceId}&show_all=true`)
            }
          
        }
    }, [trip])

    useEffect(() => {
        if (!isLoading) {

            const sortedSequence = allSequenceStops.sort((a, b) => a.stop_sequence - b.stop_sequence);

            if (locationType === 1) {
                const stopNames = sortedSequence.map(e => e.stop_id.stop_name);
                const matches = findBestMatch(name, stopNames);
                const bestMatch = matches.bestMatch;

                if (bestMatch.rating > 0.4) {
                    const index = stopNames.indexOf(bestMatch.target);
                    const filteredSequenceIncludes = sortedSequence.slice(index);
                    setSequenceInfo(filteredSequenceIncludes);
                } else {
                    const filteredSequenceIncludes = sortedSequence.slice(index)
                    setSequenceInfo(filteredSequenceIncludes)
                }
            } else {
                const mapSequence = sortedSequence?.map(e => e.stop_id.stop_id).indexOf(stopId)
                const filteredSequence = sortedSequence?.splice(mapSequence)
                setSequenceInfo(filteredSequence)
            }
        }

    }, [allSequenceStops])
    return (
        <TripContext.Provider value={{ trip, setTrip, tripSelector, sequenceInfo, stopInfo, setSequenceInfo, shape }}>
            {children}
        </TripContext.Provider>
    )
}