import { useContext, useState, useEffect, useRef } from "react"
import { CodeContext } from "../hooks/getCode"
import { TripContext } from "../hooks/getTrips"
import axios from "axios"

//  MAP IMMORTS
import L from "leaflet";
import { MapContainer, TileLayer, Marker, LayerGroup } from 'react-leaflet'
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

export function Home() {
    const ComponentResize = () => {
        const map = useMap()
        setTimeout(() => {
            map.invalidateSize()
        }, 0)
        return null
    }

    const yourPosition = new Icon({
        iconUrl: centerMarker,
        iconSize: [28, 28],
        className: "teste"
    })

    const normalMarker = new Icon({
        iconUrl: marker,
        iconSize: [28, 28]
    })


    const [center, setCenter] = useState()
    const { code } = useContext(CodeContext)
    const { trip, sequenceInfo } = useContext(TripContext)
    function Routing() {

        const map = useMap();

        useEffect(() => {
            if (!map) return;
            const routingControl = L.Routing.control({
                show: false,
                collapsible: false,
                waypoints: sequenceInfo.map((e) => {
                    return [e.stop_id.stop_lat, e.stop_id.stop_lon];
                }),
                fitSelectedRoutes: true,
                draggableWaypoints: false,
                showAlternatives: false,
                routeWhileDragging: false,
                addWaypoints: false,
                createMarker: function () { return null; },
                lineOptions: {
                    styles: [
                        {
                            color: "#000",
                            opacity: 1,
                            weight: 3
                        }
                    ]
                },
            }).addTo(map);

            return () => map.removeControl(routingControl);
        }, [trip]);

        return null;
    }



    useEffect(() => {
        axios.get('http://localhost:8010/gtfs/stops/?stop_code=' + code.toUpperCase())
            .then(response => setCenter([parseFloat(response.data.results[0].stop_lat), parseFloat(response.data.results[0].stop_lon)]))

    }, [code])

    const position = center


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
                    : <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="">

                        <TileLayer
                            onLoad={(e) => { e.target._map.invalidateSize() }}
                            // attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            subdomains="abcd"
                        />
                        <div id="map"></div>
                        <ComponentResize />
                        <LayerGroup>
                            {!trip ? <> </> : <Routing />}
                            {sequenceInfo.map((e) => (
                                <Marker key={e.id} position={[e.stop_id.stop_lat, e.stop_id.stop_lon]} icon={normalMarker} />
                            ))}

                        </LayerGroup>
                        <Marker position={position} icon={yourPosition} />
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