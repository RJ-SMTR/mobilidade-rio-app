import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {toast } from 'react-toastify'
import { api } from "../services/api";

export const CodeContext = createContext()




export function CodeProvider({ children }) {
    const [code, setCode] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();
    const [codeExists, setCodeExists] = useState(false)
    const [active, setActive] = useState(false)
    const [gpsUrl, setGpsUrl] =  useState()


    useEffect(() => {
        const urlCode = searchParams.get('code');
        if(urlCode !== null){
            setCode(urlCode.toUpperCase())
        }
    }, [])
    // CHECA SE CÓDIGO PESQUISADO EXISTE
    function checkCode() {
        api.get("/stops/?stop_code=" + code.toUpperCase())
            .then(response => {
                if (response.data.count == 0 && code.length == 4) {
                    toast.error(`O código ${code.toUpperCase()} não existe`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                    });
                } else {
                    setCodeExists(true)
                }
            })

    }
    useEffect(() => {
        checkCode()
    }, [code])
    return (
        <CodeContext.Provider value={{ code, setCode,  setSearchParams, codeExists, active, setActive, gpsUrl, setGpsUrl }}>
            {children}
        </CodeContext.Provider>
    )
}