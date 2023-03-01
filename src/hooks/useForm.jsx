import { createContext, useEffect, useState } from "react";


export const FormContext = createContext()




export function FormProvider({ children }) {
    const [activeForm, setActiveForm] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState()

    function activateForm() {
        if (activeForm) {
            setActiveForm(false)
        } else {
            setActiveForm(true)
        }
    }

    return (
        <FormContext.Provider value={{activeForm, setActiveForm, activateForm, selectedPlatform, setSelectedPlatform}}>
            {children}
        </FormContext.Provider>
    )
}