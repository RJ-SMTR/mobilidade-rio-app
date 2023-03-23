import { useContext, useEffect } from "react"
import { CodeContext } from "../hooks/getCode"
import { TripContext } from "../hooks/getTrips"
import { useParams } from "react-router-dom";
import { ShapeContext } from "../hooks/getShape";
import { FormContext } from "../hooks/useForm";


//  MAP IMMORTS
import L from "leaflet";
import { MapContainer, TileLayer, Marker, LayerGroup, Polyline, Polygon, Circle } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useMap } from 'react-leaflet/hooks'
import BusMarker from "../components/MovingMarkers";

// COMPONENTS
import { Header } from "../components/Header/Header"
import { InfoCard } from "../components/InfoCard/InfoCard"
import { SequenceCard } from '../components/SequenceCard/SequenceCard'
import { Oval } from 'react-loader-spinner'
import { Form } from "../components/Form/Form";
import CenterButton from "../components/CenterButton"


// STYLING
import centerMarker from '../assets/imgs/centerMarker.svg'
import marker from '../assets/imgs/marker.svg'
import { MovingMarkerContext } from "../hooks/getMovingMarkers";




export function Home() {

    const { setCode } = useContext(CodeContext)
    const { center, tracked, arrivals } = useContext(MovingMarkerContext)
    const { points } = useContext(ShapeContext)
    const { trip, sequenceInfo, stopInfo } = useContext(TripContext)
    const { activeForm } = useContext(FormContext)

    // Usa código da URL para setar código para as pesquisas
    let params = useParams()
    setCode(params.codeURL)

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
        className: "z-1000"
    })

    const normalMarker = new Icon({
        iconUrl: marker,
        iconSize: [28, 28]
    })





    const blackOptions = { color: 'black' }

    // Ícones do gps no mapa
    function markerOptions(e) {
        if (stopInfo && trip) {
            const options = {
                className: 'marker-test',
                html: '<div></div>' +
                    `<p>${e.linha}</p>`
            }
            if (e.linha != stopInfo.trip_short_name) {
                options.className = ' marker-test shadowed'
            }
            return options
        } else if (arrivals) {
            const options = {
                className: 'marker-test',
                html: '<div></div>' +
                    `<p>${e.linha}</p>`
            }
            if (e.distancia < -0.1) {
                options.className = ' marker-test shadowed'
            }
            return options
        } else {
            const options = {
                className: 'marker-test',
                html: '<div></div>' +
                    `<p>${e.linha}</p>`
            }
            return options

        }
    }




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
                    : <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="">

                        <TileLayer
                            onLoad={(e) => { e.target._map.invalidateSize() }}
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            subdomains="abcd"
                        />
                        <div id="map"></div>
                        <ComponentResize />
                        {/* <FixCenter /> */}
                        <LayerGroup>
                            {sequenceInfo.map((e) => (
                                <Marker key={e.id} position={[e.stop_id.stop_lat, e.stop_id.stop_lon]} icon={normalMarker} />
                            ))}
                            {points ? <Polyline pathOptions={blackOptions} positions={points} /> : <></>}
                        </LayerGroup>
                        <LayerGroup>
                            {/* REMOVER INNERCIRCLE */}
                          {tracked ? tracked.map((e) => {
                                return <div>
                                    <BusMarker id={e.code} data={e} icon={L.divIcon(
                                        markerOptions(e)
                                    )} />
                                </div>
                            }) : <></>}

                        </LayerGroup>
                        <Marker position={center} icon={yourPosition} />
                        <CenterButton location={center}/>
                    </MapContainer>}
            </div>

            {trip ?
                // CARD COM TRIP ESCOLHIDA
                <SequenceCard />
                :
                //  CARD COM LISTA DE TRIPS
                <InfoCard />}
            {activeForm ? <Form /> : <></>}

        </>
    )
}