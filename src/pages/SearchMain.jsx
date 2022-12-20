import { Header } from '../components/HeaderSearch/Header'
import qrCode from '../assets/imgs/qrCodeWhite.svg'
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from 'react-qr-reader';
import { CodeContext } from '../hooks/getCode';
import {toast } from 'react-toastify'




export  function SearchMain() {
    const navigate = useNavigate()
    const [firstCode, setFirstCode] = useState("")
    const { toggle, setToggle} = useContext(CodeContext)
  
    const searchCode = event => {
        setFirstCode(event.target.value)

    }
    
    useEffect(() => {
        if (firstCode.length == 4) {
            navigate(`/${firstCode}`)
         
        }
    }, [firstCode])

    return (
        <>
            <Header />
            <div className="px-4 mt-60 relative z-1">
                <h1 className="text-xl text-center text-white mb-3">
                    Saiba quais linhas de ônibus passam nos pontos da cidade
                </h1>
                {/* Inputs */}
                <div className="flex content-center mb-6">
                    <div className="flex flex-col w-full">
                            <input type="text" placeholder='Selecione a estação de origem' className="rounded-lg py-3.5 px-3 w-full inputShadow" maxLength={4} onChange={searchCode}  />
                    </div>
                </div>
                {/* Inputs end */}
                <button className="w-full rounded-lg bg-white uppercase py-3" onClick={() => setToggle(true)}>
                    <img className="inline-block mr-3" src={qrCode} alt="" />
                    Usar qrcode
                </button>
            </div>
            
            {toggle ? <QrReader
                className="w-11/12 mx-auto"
                scanDelay={5000}
                constraints={{ facingMode: "environment"}}
                onResult={(result, error) => {
                    if (!!result) {
                        window.location.href = result;
                    }
                    
                    if (!!error) {
                        toast.error(`O código ${firstCode.toUpperCase()} não existe`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "colored",
                        });
                    }
                }}
            /> : <></>}
           
        </>
    )
}