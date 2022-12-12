import { createContext, useEffect, useState } from "react";
import axios from 'axios'


export const CodeContext = createContext()



export function CodeProvider({ children }) {
    const [code, setCode] = useState('')

    const searchHandler = (query) => {
        setCode(query);
    }

    return (
        <CodeContext.Provider value={{ code, setCode, searchHandler }}>
            {children}
        </CodeContext.Provider>
    )
}