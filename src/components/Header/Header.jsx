
import logo from '../../assets/imgs/dark_logo.png'
import logoSppo from '../../assets/imgs/logoPrefeitura.png'
import { GrFormClose } from 'react-icons/gr'
import styles from './styles.module.scss'
import { useContext, useEffect, useState} from 'react'
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'
import { ShapeContext } from '../../hooks/getShape'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../hooks/getTheme'
import { RoutesContext } from '../../hooks/getRoutes'
import { NameContext } from '../../hooks/getName'
import { api } from '../../services/api'
import { MovingMarkerContext } from '../../hooks/getMovingMarkers'
import { GPSContext } from '../../hooks/getGPS'

export function Header(props) {
    let navigate = useNavigate()
    const { code, setCode, setStopId } = useContext(CodeContext)
    const { setTrip, setSequenceInfo } = useContext(TripContext)
    const {theme, setTheme, setSppo, setRouteType} = useContext(ThemeContext)
    const [newCode, setNewCode] = useState("")
    const [value, setValue] = useState('')
    const [codeIdentifier, setCodeIdentifier] = useState()
    const { setRoutes, setPlataforms} = useContext(RoutesContext)
    const { setResults, results, similarNames } = useContext(NameContext)
    const {setTracked, setArrivals} = useContext(MovingMarkerContext)
    const {setPoints} = useContext(ShapeContext)
    const {stopFetching} = useContext(GPSContext)
    function clearInfo() {
        setTrip('')
        setCode("")
        navigate('/')
        setSequenceInfo()
        setPlataforms([])
        setRoutes()
        setResults()
        setTracked()
        setTheme("sppo")
        setStopId()
        setSppo()
        setPoints()
        stopFetching()
        setRouteType()
        setArrivals()
    }

    useEffect(() => {
        setValue(code)
    }, [code])

    const searchNewCode = event => {
        setNewCode(event.target.value)
        stopFetching()
        setTrip('')
        setValue()
        setPlataforms([])
        setRoutes()
        setSequenceInfo()
        setTracked()
        setInnerCircle([])
        setArrivals()
        if (event.target.value.length == 0) {
            setResults()
        }

    }
    useEffect(() => {
        if(newCode){
        api.get("/stops/?stop_code=" + newCode.toUpperCase())
            .then(response => {
                if (response.data.count == 0) {
                    similarNames('/stops/?stop_name=' + newCode)
                    setCodeIdentifier(false)
                } else {
                    setCodeIdentifier(true)
                    setResults()
                }
            })
        }
    }, [newCode])

    useEffect(() => {
        if (newCode.length == 4 && codeIdentifier === true && !/^[a-zA-Z]+$/.test(newCode)) {
            navigate(`/${newCode}`)
        } else if (newCode.length == 5 && codeIdentifier) {
            navigate(`/${newCode}`)
        }
    }, [codeIdentifier])

 
    return (
        <>
            <header className={`z-[401] relative + ${styles.header}` }  >
                <div className="p-3">
                    <div className='flex justify-end mb-6'>
                        {theme ? <img src={logoSppo} alt="" className={styles.logo} /> : 
                            <img src={logo} alt="" className={styles.logo} />
                        }
                    </div>
                    <div className="flex-column items-center mb-5">
                        <h1 className={`text-lg text-center + ${styles.headerText}`}>Saiba quais linhas passam na cidade</h1>
                        <div className="flex flex-col w-full">
                            <div className='relative'>
                                <button className='absolute right-[12px] top-0 bottom-0' onClick={() => clearInfo()}>
                                    <GrFormClose />
                                </button>
                                <input type="text" placeholder='Selecione a estação de origem' className="rounded-lg py-3.5 px-3 w-full inputShadow" onKeyUp={searchNewCode} onPaste={searchNewCode} defaultValue={value} />
                                {code.length === 0 || !results ? <></> :
                                    <ul className='bg-white border-[1px] rounded-lg absolute max-h-[120px] z-[1001] py-3.5 px-3 overflow-scroll'>
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
                    </div>
                </div>

            </header>
            {/* <div className='warning absolute z-[402] bg-white px-5 py-2 right-0 rounded-md border-2 border-slate-200'>
                <p className='text-red-600'>Versão Beta para testes</p>
            </div> */}
        </>
    )
}