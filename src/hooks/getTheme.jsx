import { createContext, useContext, useEffect, useState } from "react";
import { CodeContext } from "./getCode";



export const ThemeContext = createContext()




export function ThemeProvider({ children }) {
    const { code } = useContext(CodeContext)
    const [theme, setTheme] = useState("")

    const setBrt = () => {
        document.documentElement.setAttribute("data-theme", "brt");
    }

    const setSppo = () => {
        document.documentElement.setAttribute("data-theme", "sppo");
    };

    useEffect(() => {
        if (code != "7kky" && code != "1k84") {
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