import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { RoutesContext } from "./getRoutes";
import axios from "axios";



export const ThemeContext = createContext()




export function ThemeProvider({ children }) {
    const { code } = useContext(CodeContext)
    const [theme, setTheme] = useState("")
    const [routeType, setRouteType] = useState("")
    const {stopId} = useContext(RoutesContext)

    useEffect(() => {
        axios.get('https://api.mobilidade.rio/gtfs/stop_times/?stop_id=' + stopId)
            .then(response => setRouteType(response.data.results[0].trip_id.route_id.route_type))
    }, [code])

    const setBrt = () => {
        document.documentElement.setAttribute("data-theme", "brt");
    }

    const setSppo = () => {
        document.documentElement.setAttribute("data-theme", "sppo");
    };

    useEffect(() => {
        if (routeType != 702) {
            setSppo();
            setTheme("sppo")
        } else {
            setBrt();
            setTheme("")
        }
    }, [code])

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    )
}