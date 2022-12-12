import { createContext, useEffect, useState , useContext} from "react";
import axios from 'axios'
import {  RoutesContext } from "./getRoutes";


export const TripContext = createContext()



export function TripProvider({ children }) {
    const { stopId } = useContext(RoutesContext)
    const [trip, setTrip] = useState('')
    const [stopInfo, setStopInfo] = useState()
    const [sequenceInfo, setSequenceInfo] = useState()
    const [allSequenceStops, setAllSequenceStops] = useState()

    const tripSelector = (selectedTrip) => {
        setTrip(selectedTrip);
    }

    let allStops = []
    async function getAllStops(url) {
        await axios
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
        axios.get('https://api.dev.mobilidade.rio/gtfs/trips/?trip_id=' + trip)
            .then(response => setStopInfo(response.data.results[0]))
        getAllStops('https://api.dev.mobilidade.rio/gtfs/stop_times/?trip_id='+trip)
    }, [trip])
 
    useEffect(() => {
        const mapSequence = allSequenceStops?.map(e => e.stop_id.stop_id).indexOf(stopId)
        const filteredSequence = allSequenceStops?.splice(mapSequence)
        setSequenceInfo(filteredSequence)
    }, [allSequenceStops])
    return (
        <TripContext.Provider value={{ trip, setTrip, tripSelector, sequenceInfo, stopInfo , setSequenceInfo}}>
            {children}
        </TripContext.Provider>
    )
}