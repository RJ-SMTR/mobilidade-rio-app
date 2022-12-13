import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import axios from 'axios'


export const CodeContext = createContext()




export function CodeProvider({ children }) {
    const [code, setCode] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();


    // const searchHandler = (query) => {
    //     setCode(query);
    // }

    useEffect(() => {
        const urlCode = searchParams.get('code');
        if(urlCode !== null){
            setCode(urlCode.toUpperCase)
        }
    }, [])

    return (
        <CodeContext.Provider value={{ code, setCode,  setSearchParams }}>
            {children}
        </CodeContext.Provider>
    )
}