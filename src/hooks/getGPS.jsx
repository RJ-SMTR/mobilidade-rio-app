import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const GPSContext = createContext()




export function GPSProvider({ children }) {
    const [realtime, setRealtime] = useState([])
    

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('https://dados.mobilidade.rio/gps/brt', {
                method: 'GET',
                mode: "cors",
              
            })
                .then(response => setRealtime(response.data.veiculos))
        }, 6000);
        return () => clearInterval(interval);
    }, []);


    return (
        <GPSContext.Provider value={{ realtime }}>
            {children}
        </GPSContext.Provider>
    )
}