import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export const NameContext = createContext()

export function NameProvider({ children }) {
    const navigate = useNavigate()
    const [firstCode, setFirstCode] = useState("")
    const [results, setResults] = useState()
    const [codeR, setCodeR] = useState()




    const searchCode = event => {
        setFirstCode(event.target.value)
        if(event.target.value.length == 0){
            setResults()
        }
    }
    
    let allSimilar = []
    async function similarNames(url) {
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    if (item.stop_code != null && !allSimilar.some(i => i.stop_code === item.stop_code)) {
                        allSimilar.push(item)
                    } else {
                        setResults()
                    }
                })
                if (data.next) {
                    similarNames(data.next)
                }
                setResults([...allSimilar])
            })
    }


    useEffect(() => {
        api.get("/stops/?stop_code=" + firstCode.toUpperCase())
            .then(response => {
                if (response.data.count == 0 && firstCode != '' ) {
                    similarNames('/stops/?stop_name=' + firstCode)
                    setCodeR(false)
                    console.log(firstCode)
                } else {
                    setCodeR(true)
                    setResults()
                }
            })
    }, [firstCode])

    useEffect(() => {
        if (firstCode.length == 4 && codeR === true && !/^[a-zA-Z]+$/.test(firstCode)) {
            navigate(`/${firstCode}`)
        }
    }, [codeR])


    
 
   
    return (
        <NameContext.Provider value={{ setFirstCode, searchCode, results, setResults,codeR, setCodeR, similarNames }}>
            {children}
        </NameContext.Provider>
    )
}