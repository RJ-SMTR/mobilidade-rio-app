import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { RoutesContext } from "./getRoutes";
import { api } from "../services/api";



export const ThemeContext = createContext()




export function ThemeProvider({ children }) {
    const { code } = useContext(CodeContext)
    const [theme, setTheme] = useState("")
    const [routeType, setRouteType] = useState("")
    const {stopId} = useContext(RoutesContext)

    useEffect(() => {
        api.get('/stop_times/?stop_id=' + stopId)
            .then(response => setRouteType(response.data.results[0].trip_id.route_id.route_type))
    }, [stopId])

    const setBrt = () => {
        document.documentElement.setAttribute("data-theme", "brt");
    }

    const setSppo = () => {
        document.documentElement.setAttribute("data-theme", "sppo");
    };

    useEffect(() => {
        if (routeType === 700 || routeType === 3) {
            setSppo();
            setTheme("sppo")
        } else if (routeType === 702) {
            setBrt();
            setTheme("")
        }
    }, [routeType, stopId])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, setSppo }}>
            {children}
        </ThemeContext.Provider>
    )
}