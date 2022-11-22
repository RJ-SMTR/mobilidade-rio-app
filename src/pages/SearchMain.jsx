import { SelectInputs } from "../components/Selectinputs/SelectInputs"
import { Header } from '../components/Header/Header'
import fromTo from '../assets/imgs/fromTo.svg'
import qrCode from '../assets/imgs/qrCode.svg'



export  function SearchMain() {
    return (
        <>
            <Header />
            <div className="px-4 mt-60 relative z-1">
                <h1 className="text-xl text-center mb-3">
                    Saiba quais as linhas e<br /> próximos ônibus nas<br /> estações da <span className="font-bold">TransOlímpica</span>
                </h1>
                {/* Inputs */}
                <div className="flex content-center mb-6">
                    <img src={fromTo} alt="" />
                    <div className="flex flex-col w-full ml-4">
                        <SelectInputs id="fromTo" className="mb-5">
                            <option value="" selected>
                                Selecione a estação de origem
                            </option>
                        </SelectInputs>

                        <SelectInputs id="whereTo">
                            <option value="">
                                Selecione a estação de destino
                            </option>
                        </SelectInputs>
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