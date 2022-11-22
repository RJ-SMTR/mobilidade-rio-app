import { Header } from "../components/Header/Header"
import { MapContainer, TileLayer } from 'react-leaflet'
import { InfoCard } from "../components/InfoCard/InfoCard"

export function Home(){
    const position = [51.505, -0.09]
  
    return(
        <>
        <Header />
            <div className="overflow-hidden mapWrapper">
             <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="">
                 <TileLayer
                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 />
                 <div id="map"></div>
             </MapContainer>
           </div>
        <InfoCard>
        </InfoCard>
        </>
    )
}