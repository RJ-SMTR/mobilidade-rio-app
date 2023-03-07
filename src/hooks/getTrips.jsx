import { createContext, useEffect, useState, useContext } from "react";
import { RoutesContext } from "./getRoutes";
import { api } from "../services/api";


export const TripContext = createContext()



export function TripProvider({ children }) {
    const { stopId, locationType, childName } = useContext(RoutesContext)
    const [trip, setTrip] = useState('')
    const [stopInfo, setStopInfo] = useState()
    const [sequenceInfo, setSequenceInfo] = useState()
    const [allSequenceStops, setAllSequenceStops] = useState([])

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
        api.get('/trips/?trip_id=' + trip)
            .then(response => setStopInfo(response.data.results[0]))
       getAllStops('/stop_times/?trip_id=' + trip)
    }, [trip])

    useEffect(() => {


        if (locationType === 1) {
            const mapSequence = allSequenceStops?.map(e => e.stop_id.stop_name).indexOf(childName)
            const filteredSequence = allSequenceStops?.splice(mapSequence)
            setSequenceInfo(filteredSequence)
        } else {
            const mapSequence = allSequenceStops?.map(e => e.stop_id.stop_id).indexOf(stopId)
            const filteredSequence = allSequenceStops?.splice(mapSequence)
            setSequenceInfo(filteredSequence)
        }
    }, [allSequenceStops])
    return (
        <TripContext.Provider value={{ trip, setTrip, tripSelector, sequenceInfo, stopInfo, setSequenceInfo }}>
            {children}
        </TripContext.Provider>
    )
}