import { useContext, useEffect, useState } from "react";
import { Popup, useMap } from "react-leaflet";
import { CodeContext } from "../hooks/getCode";
import { MovingMarkerContext } from "../hooks/getMovingMarkers";
import { MdMyLocation } from 'react-icons/md'



export default function CenterButton({ location }) {
    const { center } = useContext(MovingMarkerContext)
    const { stopId } = useContext(CodeContext)
    const map = useMap()
    function fixCenter() {
        console.log(location)
        map.setView(location);

    }
    useEffect(() => {
        fixCenter()
    }, [center, stopId])


    return (
        <>
            <button className='centerButton inputShadow' onClick={() => fixCenter()}>
                <MdMyLocation />
            </button>

        </>
    );
}
