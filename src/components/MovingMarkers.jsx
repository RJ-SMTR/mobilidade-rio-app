import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import { FiClock } from 'react-icons/fi'



export default function BusMarker({ id, data, icon }) {
    const [prevPositions, setPrevPositions] = useState({});

    useEffect(() => {
        setPrevPositions((prevPositions) => ({
            ...prevPositions,
            [id]: [data.lat, data.lng],
        }));
    }, [id, data.lat, data.lng]);

    const prevPos = prevPositions[id] || [data.lat, data.lng];
    

    return (
        <>

            <LeafletTrackingMarker
                icon={icon}
                position={[data.lat, data.lng]}
                previousPosition={prevPos}
                duration={6000}
                rotationAngle={0}
                key={id}
            >
                <Popup>
                    {data.code ? <h1> Código: {data.code} </h1> : <></>}
                    <div className="flex items-center">
                        {/* <FiClock className={data.hora[0] > 1 ? 'text-red-600 mr-1' : '' + "mr-1" }/> */}
                        {/* <p></p> */}
                        <h1 className={data.hora[0] > 1 ? 'text-red-600' : ''}> Atualizado a <span className="font-bold">{data.hora[0]} min</span> atrás</h1>
                    </div>
        
                     {data.velocidade} km/h<br/>
                    {/* Sentido de {data.sentido === 1 ? `ida` : 'volta'} */} 
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
