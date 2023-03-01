import { createContext, useEffect, useState } from "react";


export const FormContext = createContext()




export function FormProvider({ children }) {
    const [activeForm, setActiveForm] = useState(false)

    function activateForm() {
        if (activeForm) {
            setActiveForm(false)
        } else {
            setActiveForm(true)
        }
    }
   
    return (
        <FormContext.Provider value={{activeForm, setActiveForm, activateForm}}>
            {children}
        </FormContext.Provider>
    )
}