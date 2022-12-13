import { SelectInputs } from "../components/Selectinputs/SelectInputs"
import { Header } from '../components/HeaderSearch/Header'
import fromTo from '../assets/imgs/fromTo.svg'
import qrCode from '../assets/imgs/qrCode.svg'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



export  function SearchMain() {
    const navigate = useNavigate()
    const [firstCode, setFirstCode] = useState("")
  
    const searchCode = event => {
        setFirstCode(event.target.value)

    }

    useEffect(() => {
        if (firstCode.length == 4) {
            navigate(`/${firstCode}`)
            console.log(firstCode)
        }
    }, [firstCode])

    return (
        <>
            <Header />
            <div className="px-4 mt-60 relative z-1">
                <h1 className="text-xl text-center mb-3">
                    Saiba quais as linhas e<br /> próximos ônibus nas<br /> estações da <span className="font-bold">TransOlímpica</span>
                </h1>
                {/* Inputs */}
                <div className="flex content-center mb-6">
                    <div className="flex flex-col w-full">
                            <input type="text" placeholder='Selecione a estação de origem' className="rounded-lg py-3.5 px-3 w-full inputShadow" maxLength={4} onChange={searchCode}  />
                    </div>
                </div>
                {/* Inputs end */}
                <button className="w-full rounded-lg text-white bg-black uppercase py-3">
                    <img className="inline-block mr-3" src={qrCode} alt="" />
                    Usar qrcode
                </button>
            </div>
        </>
    )
}