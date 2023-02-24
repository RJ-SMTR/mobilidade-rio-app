import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";





export default function BusMarker({ data, icon }) {


    const [prevPos, setPrevPos] = useState([data.lat, data.lng]);

    useEffect(() => {
        if (prevPos[1] !== data.lng && prevPos[0] !== data.lat) setPrevPos([data.lat, data.lng]);
    }, [data.lat, data.lng, prevPos]);

    return (
        <>

            <LeafletTrackingMarker
                icon={icon}
                position={[data.lat, data.lng]}
                previousPosition={prevPos}
                duration={5000}
                rotationAngle={0}
            >
                <Popup>
                    {data.code ? <h1> Código: {data.code} </h1> : <></>}
                    <h1>{data.hora[0]}:{data.hora[1]}s atrás</h1>
                    {data.velocidade} km/h<br/>
                  Sentido de {data.sentido}
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
