
import logo from '../../assets/imgs/dark_logo.png'
import { GrFormClose } from 'react-icons/gr'
import styles from './styles.module.scss'
import { useContext, useEffect, useState } from 'react'
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'
import { redirect } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export function Header(props) {
    let navigate = useNavigate()
    const { code, setCode } = useContext(CodeContext)
    const { setTrip } = useContext(TripContext)
    const [newCode, setNewCode] = useState("")

    function clearInfo() {
        setTrip('')
        setCode("")
        navigate('/')

    }

    const searchNewCode = event => {
        setNewCode(event.target.value)

    }

    useEffect(() => {
        if (newCode.length == 4) {
            navigate(`/${newCode}`)
            console.log(newCode)
        }
    }, [newCode])

    return (
        <>
            <header className={styles.header}>
                <div className="p-3">
                    <div className='flex justify-end mb-6'>
                        <img src={logo} alt="" className={styles.logo} />
                    </div>
                    <div className="flex-column items-center">
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