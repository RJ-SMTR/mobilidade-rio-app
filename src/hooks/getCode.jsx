import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify'
import { api } from "../services/api";

export const CodeContext = createContext()




export function CodeProvider({ children }) {
    const [code, setCode] = useState('')
    // PEGAR CÓDIGO PELA URL
    const [searchParams, setSearchParams] = useSearchParams();
    // BOOLEANO PRA ATIVAR O LEITOR QRCODE
    const [active, setActive] = useState(false)
    // PEGAR STOP_ID PRA IDEN
    const [stopId, setStopId] = useState()
    // NOME PRA USAR NOS CARDS
    const [name, setName] = useState()
    // IDENTIFICAR SE É PARENT_STATION
    const [locationType, setLocationType] = useState()
    // PESQUISAR STOP_ID NO GPS
    const [gpsUrl, setGpsUrl] = useState()
    // COORDENADAS PRA USAR NO MAPA
    const [center, setCenter] = useState()
    // COORDENADAS PRA USAR NO SHAPE
    const [stopCoords, setStopCoords] = useState()




    useEffect(() => {
        const urlCode = searchParams.get('code');
        if (urlCode !== null) {
            setCode(urlCode.toUpperCase())
        }
    }, [])

    useEffect(() => {
        if (code) {
            
            api
                .get("/stops/?stop_code=" + code.toUpperCase())
                .then(response => {
                    setStopId(response.data.results[0].stop_id)
                    setLocationType(response.data.results[0].location_type)
                    setName(response.data.results[0].stop_name)
                    setCenter([parseFloat(response.data.results[0].stop_lat), parseFloat(response.data.results[0].stop_lon)])
                    setStopCoords([response.data.results[0].stop_lon, response.data.results[0].stop_lat])
                })
        }
        
    }, [code])

    return (
        <CodeContext.Provider value={{ code, setCode, setSearchParams, active, setActive, stopId, locationType, setStopId, gpsUrl, setGpsUrl, name, center, stopCoords }}>
            {children}
        </CodeContext.Provider>
    )
}