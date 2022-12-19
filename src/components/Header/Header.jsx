
import logo from '../../assets/imgs/dark_logo.png'
import logoSppo from '../../assets/imgs/logoPrefeitura.png'
import { GrFormClose } from 'react-icons/gr'
import styles from './styles.module.scss'
import { useContext, useEffect, useState } from 'react'
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../hooks/getTheme'
import { ShapeContext } from '../../hooks/getShape'
import { RoutesContext } from '../../hooks/getRoutes'

export function Header(props) {
    let navigate = useNavigate()
    const { setCode, setCodeExists } = useContext(CodeContext)
    const { setTrip } = useContext(TripContext)
    const {setRoutes} = useContext(RoutesContext)
    const {theme} = useContext(ThemeContext)
    const{setPoints} = useContext(ShapeContext)
    const [newCode, setNewCode] = useState("")

    function clearInfo() {
        setTrip('')
        setCode("")
        setPoints("")
        navigate('/')
        setRoutes([])
        setCodeExists('')

    }

   
    const searchNewCode = event => {
        setNewCode(event.target.value)
        setTrip('')
        setPoints('')
        setRoutes([])
        setCodeExists('')

    }

    useEffect(() => {
        if (newCode.length == 4) {
            navigate(`/${newCode}`)
        }
    }, [newCode])
    
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
                        <h1 className={`text-lg text-center + ${styles.headerText}`}>Busque pelo código da estação</h1>
                        <div className="flex flex-col w-full">
                            <div className='relative'>
                                <button className='absolute right-[12px] top-0 bottom-0' onClick={() => clearInfo()}>
                                    <GrFormClose />
                                </button>
                                <input type="text" className="rounded-lg py-3.5 px-3 w-full inputShadow uppercase" maxLength={4} onChange={searchNewCode} />
                            </div>
                        </div>
                    </div>
                </div>

            </header>
        </>
    )
}