import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";
import { RoutesContext } from "./getRoutes";
import { api } from "../services/api";
import { ServiceIdContext } from "./getServiceId";



export const ThemeContext = createContext()




export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("")
    const [routeType, setRouteType] = useState([])
    const { stopId } = useContext(CodeContext)
    const {serviceId} = useContext(ServiceIdContext)

    const setBrt = () => {
        document.documentElement.setAttribute("data-theme", "brt");
    }

    const setSppo = () => {
        document.documentElement.setAttribute("data-theme", "sppo");
    };

    async function findTheme(url) {
        let routeTypes = [];
        await api
            .get(url)
            .then(({ data }) => {
                data.results.forEach((item) => {
                    routeTypes.push(item.trip_id.route_id.route_type);
                });
                const brtRoute = (e) => e === 702
                if (routeTypes.some(brtRoute)) {
                    setBrt();
                    setTheme("")
                } else if (routeTypes === 3 || 700) {
                    setSppo();
                    setTheme("sppo")
                }
                setRouteType([...routeTypes]);

            });
    }

    useEffect(() => {
        if (stopId && serviceId) {
          findTheme(`/stop_times/?stop_id=${stopId}&service_id=${serviceId}`)
        }
    }, [stopId, serviceId])

   

    return (
        <ThemeContext.Provider value={{ theme, setTheme, setSppo, setRouteType, routeType }}>
            {children}
        </ThemeContext.Provider>
    )
}