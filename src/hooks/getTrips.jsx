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
        // axios.get('http://localhost:8010/gtfs/stop_times/?trip_id='+trip)
        //     .then(response => setSequenceInfo(response.data.results))
        // axios.get('http://localhost:8010/gtfs/stop_times/?trip_id='+trip)
        //     .then(response => console.log(response.data.results[14]))
        axios.get('http://localhost:8010/gtfs/trips/?trip_id=' + trip)
            .then(response => setStopInfo(response.data.results[0]))
        getAllStops('http://localhost:8010/gtfs/stop_times/?trip_id='+trip)
    }, [trip])
 
    useEffect(() => {
        const mapSequence = allSequenceStops?.map(e => e.stop_id.stop_id).indexOf(stopId)
        const teste = allSequenceStops?.splice(mapSequence)
        setSequenceInfo(teste)
        // console.log(teste)
    }, [allSequenceStops])
    console.log(sequenceInfo)
    return (
        <TripContext.Provider value={{ trip, setTrip, tripSelector, sequenceInfo, stopInfo , setSequenceInfo}}>
            {children}
        </TripContext.Provider>
    )
}