import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify"



export const CodeContext = createContext()




export function CodeProvider({ children }) {
    const [code, setCode] = useState('')
    const [codeExists, setCodeExists] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const urlCode = searchParams.get('code');
        if (urlCode !== null) {
            setCode(urlCode.toUpperCase)
        }
    }, [])
    // CHECA SE CÓDIGO PESQUISADO EXISTE
    function checkCode() {
        axios.get("https://api.dev.mobilidade.rio/gtfs/stops/?stop_code=" + code.toUpperCase())
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
                    setCodeExists(code)
                }
            })

    }
    useEffect(() => {
        checkCode()
    }, [code])
    return (
        <CodeContext.Provider value={{ code, setCode, setSearchParams,codeExists }}>
            {children}
        </CodeContext.Provider>
    )
}