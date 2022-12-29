import { Header } from '../components/HeaderSearch/Header'
import qrCode from '../assets/imgs/qrCodeWhite.svg'
import qrCodeBrt from '../assets/imgs/qrCode.svg'
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useZxing } from "react-zxing";
import { CodeContext } from '../hooks/getCode';
import { ThemeContext } from '../hooks/getTheme';




export  function SearchMain() {
    const navigate = useNavigate()
    const [firstCode, setFirstCode] = useState("")
    const { active, setActive} = useContext(CodeContext)
    const { theme } = useContext(ThemeContext)
    const { ref } = useZxing({
        onResult(result) {
            window.location.href = result;
        },
    });
  
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
                <h1 className={theme ? 'text-xl text-center mb-3 text-white' : 'text-xl text-center mb-3 text-black'}>
                    Saiba quais linhas de ônibus passam nos pontos da cidade
                </h1>
                {/* Inputs */}
                <div className="flex content-center mb-6">
                    <div className="flex flex-col w-full">
                            <input type="text" placeholder='Selecione a estação de origem' className="rounded-lg py-3.5 px-3 w-full inputShadow" maxLength={4} onChange={searchCode}  />
                    </div>
                </div>
                {/* Inputs end */}
                {theme ? 
                    <button className="w-full rounded-lg bg-white uppercase py-3" onClick={() => setActive(true)}>
                        <img className="inline-block mr-3" src={qrCode} alt="" />
                        Usar qrcode
                    </button>
                    : <button className="w-full rounded-lg bg-black text-white uppercase py-3" onClick={() => setActive(true)}>
                        <img className="inline-block mr-3" src={qrCodeBrt} alt="" />
                        Usar qrcode
                    </button>}
             
           
            </div>
            
            <video className={active ? 'mx-auto w-11/12 mt-5' : 'hidden'} ref={ref} /> 
           
        </>
    )
}