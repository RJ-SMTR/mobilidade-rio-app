import { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { CodeContext } from "../hooks/getCode";
import { MdMyLocation } from 'react-icons/md'



export default function CenterButton({ location }) {
    const { stopId, center } = useContext(CodeContext)
    const map = useMap()
    function fixCenter() {
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
