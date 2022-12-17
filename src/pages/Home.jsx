import { useContext, useState, useEffect, useRef } from "react"
import { CodeContext } from "../hooks/getCode"
import { TripContext } from "../hooks/getTrips"
import axios from "axios"

//  MAP IMPORTS
import L from "leaflet";
import { MapContainer, TileLayer, Marker, LayerGroup, Polyline } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useMap } from 'react-leaflet/hooks'
import "leaflet-routing-machine";


// COMPONENTS
import { Header } from "../components/Header/Header"
import { InfoCard } from "../components/InfoCard/InfoCard"
import { SequenceCard } from '../components/SequenceCard/SequenceCard'
import { Oval } from 'react-loader-spinner'


// STYLING
import centerMarker from '../assets/imgs/centerMarker.svg'
import marker from '../assets/imgs/marker.svg'
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useParams } from "react-router-dom";
import { ShapeContext } from "../hooks/getShape";

export function Home() {
    const { code, setCode } = useContext(CodeContext)
    const { trip, sequenceInfo } = useContext(TripContext)
    const {points} = useContext(ShapeContext)
    const [center, setCenter] = useState('')


    let params = useParams()
    setCode(params.codeURL)

    // AJUSTAR TAMANHO DO MAPA DE ACORDO COM A TELA
    const ComponentResize = () => {
        const map = useMap()
        setTimeout(() => {
            map.invalidateSize()
        }, 0)
        return null
    }
    // MARCADORES CUSTOMIZADOS
    const yourPosition = new Icon({
        iconUrl: centerMarker,
        iconSize: [28, 28],
        className: "z-1000"
    })

    const normalMarker = new Icon({
        iconUrl: marker,
        iconSize: [28, 28]
    })

    // USADO PARA CENTRALIAR O MAPA
    useEffect(() => {
        axios.get('https://api.dev.mobilidade.rio/gtfs/stops/?stop_code=' + code.toUpperCase())
            .then(response => setCenter([parseFloat(response.data.results[0].stop_lat), parseFloat(response.data.results[0].stop_lon)]))
    }, [code])

    const FixCenter = () => {
        const map = useMap()
        useEffect(() => {
            map.setView(center);
        }, [center])

    }

   
    const blackOptions = { color: 'black' }

    return (
        <>
            <Header />
            <div className="overflow-hidden mapWrapper">
                {!center ?
                    <div className="loaderWrapper">
                        <Oval
                            height={40}
                            width={40}
                            color="#707070"
                            wrapperStyle={{}}
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#707070"
                            strokeWidth={4}
                            strokeWidthSecondary={4}

                        />
                    </div>
                    : <MapContainer center={center} zoom={15} scrollWheelZoom={true} className="">

                        <TileLayer
                            onLoad={(e) => { e.target._map.invalidateSize() }}
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            subdomains="abcd"
                        />
                        <div id="map"></div>
                        <ComponentResize />
                        <FixCenter />
                        <LayerGroup>
                            {sequenceInfo.map((e) => (
                                <Marker key={e.id} position={[e.stop_id.stop_lat, e.stop_id.stop_lon]} icon={normalMarker} />
                            ))} 
                            {points ? <Polyline pathOptions={blackOptions}  positions={points} /> : <></> }
                        </LayerGroup>
                        <Marker position={center} icon={yourPosition} />
                    </MapContainer>}

            </div>
            {trip ?
            // CARD COM TRIP ESCOLHIDA
             <SequenceCard /> 
             : 
            //  CARD COM LISTA DE TRIPS
             <InfoCard />}
        </>
    )
}