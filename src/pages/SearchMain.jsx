import { Header } from '../components/HeaderSearch/Header'
import qrCode from '../assets/imgs/qrCodeWhite.svg'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { CodeContext } from '../hooks/getCode';
import { NameContext } from '../hooks/getName';
import { useEffect, useState } from 'react';


export function SearchMain() {
    const navigate = useNavigate()

    const {searchCode, results, firstCode } = useContext(NameContext)
    const { active, setActive } = useContext(CodeContext)
   
    function setBg(){
        document.body.classList.add('homepage');
    }
    useEffect(() => {
        setBg()
    }, [])
 

    return (
        <>
        <div className="busBg"></div>
            <Header />
            <div className="px-4 mt-60 relative z-1">
                <h1 className='text-xl text-center mb-3 text-white'>
                    Saiba quais linhas passam na cidade
                </h1>
                {/* Inputs */}
                <div className="flex content-center mb-6">
                    <div className="flex flex-col w-full">
                        <input type="text" placeholder='Selecione a estação de origem' className="rounded-lg py-3.5 px-3 w-full inputShadow" onKeyUp={searchCode} onPaste={searchCode}  />
                        {firstCode && firstCode.length === 0 || !results ? <></> :
                            <ul className='bg-white border-[1px] rounded-lg absolute max-h-[120px] mt-12 py-3.5 px-3 overflow-scroll'>
                                {results.length == 0 ? <li>
                                    Não foi possível encontrar a estação
                                </li> :
                                    results.map((e, index) => {
                                        return <li className={index === 0 ? 'border-t-0' : "" + 'py-2 border-t-2 border-gray-300'} onClick={() => navigate(`/${e.stop_code}`)}>
                                            {e.stop_name}
                                        </li>
                                    })
                                }

                            </ul>
                        }

                    </div>
                </div>
                {/* Inputs end */}

                    <button className="w-full rounded-lg bg-white uppercase py-3" onClick={() => setActive(true)}>
                        <img className="inline-block mr-3" src={qrCode} alt="" />
                        Usar qrcode
                    </button>
             
                  
               
                
          

            </div>
            <div className='text-white absolute bottom-0 z-1 right-0 left-0'>
                <p className='text-center p-4 text-xs'>
                    ❤️ Feito em código aberto, acesse <a href="https://github.com/RJ-SMTR/mobilidade-rio-app" className='underline' target='blank'>aqui</a> e colabore!
                </p>
            </div>
          
            {active ? <QrScanner
                onDecode={(result) => window.location.href = result}
                onError={(error) => console.log(error?.message)}
            /> :  <></>}
          


        </>
    )
}
