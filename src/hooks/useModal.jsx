import { createContext, useState } from "react";


export const ModalContext = createContext()




export function ModalProvider({ children }) {
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal, modalIsOpen  }}>
            {children}
        </ModalContext.Provider>
    )
}