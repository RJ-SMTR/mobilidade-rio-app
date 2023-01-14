import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import busSppo from '../../assets/imgs/busSppo.svg'
import pin from '../../assets/imgs/pin.svg'
import { useState, useEffect, useContext } from "react"
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'
import { RoutesContext } from '../../hooks/getRoutes'
import { Oval } from 'react-loader-spinner'
import { ThemeContext } from '../../hooks/getTheme'
import { api } from '../../services/api'
import { GrClose } from 'react-icons/gr'

export function InfoCard(){
    const [name, setName] = useState()
    const {theme} = useContext(ThemeContext)
    const {code} = useContext(CodeContext)
    const {routes, isParent, getMultiplePages, plataforms, setRoutes} = useContext(RoutesContext)
    const { setTrip } = useContext(TripContext);


    useEffect(() => {
        api.get('/stops/?stop_code=' + code.toUpperCase())
               .then(response => setName(response.data.results[0].stop_name)) 
        setRoutes()
        console.log(isParent)
    }, [code])

    return(

        <>
            {isParent ? <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                <div className={styles.routesCard}>
                    {!routes ? <></> : <div className='flex justify-end'>
                        <button onClick={() => setRoutes()}>
                            <GrClose />
                        </button>
                    </div>}
                    <p className='text-[#707070] text-sm'>Você está em </p>
                    <h1 className="text-xl font-semibold mb-3">{name}</h1>
                    <p className='text-[#707070] text-sm'>Selecione o sentido para mais informações:</p>
                    <ul className={styles.routeList}>
                        {!routes ? <>
                            {plataforms.length < 1 ?
                                <Oval
                                    height={40}
                                    width={40}
                                    color="#707070"
                                    wrapperStyle={{}}
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#707070"
                                    strokeWidth={4}
                                    strokeWidthSecondary={4}

                                /> : plataforms.map((e) => Object.values(e).map((values) => {
                                    return <li className='flex justify-between border-b py-2.5' onClick={() => getMultiplePages("/stop_times/?stop_id=" + Object.keys(values))}>
                                        <div className={styles.routeName}>
                                            <div className={styles.shortName}>
                                                <img src={pin} alt="" />
                                            </div>
                                            <p className="text-sm ml-2.5">{Object.values(values)[0].stop_desc}</p>
                                        </div>
                                    </li>
                                }))

                            }</>:
                            routes.map((e) => {
                                return <li key={e.id} onClick={() => setTrip(e.trip_id.trip_id)} className="flex justify-between border-b py-2.5">
                                    <div className={styles.routeName}>
                                        <div className={styles.shortName}>
                                            {theme ? <img src={busSppo} alt="" /> :
                                                <img src={bus} alt="" />
                                            }
                                            <p className='ml-2 font-semibold leading-none'>{e.trip_id.trip_short_name}</p>
                                        </div>
                                        <p className="text-sm ml-2.5">{e.trip_id?.trip_headsign ?? 'Circular'}</p>
                                    </div>
                                </li>
                            })
                        }
                       
                    
                    </ul>
                </div>
            </div> 
            : 
        // FINAL CARD COM PARENT STATION
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                <div className={styles.routesCard}>
                    <p className='text-[#707070] text-sm'>Você está em</p>
                    <h1 className="text-xl font-semibold mb-3">{name}</h1>
                    <ul className={styles.routeList}>
                        {!routes ? <>
                            <Oval
                                height={40}
                                width={40}
                                color="#707070"
                                wrapperStyle={{}}
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#707070"
                                strokeWidth={4}
                                strokeWidthSecondary={4}

                            /></> :  routes.map((e) => {
                                return <li key={e.id} onClick={() => setTrip(e.trip_id.trip_id)} className="flex justify-between border-b py-2.5">
                                    <div className={styles.routeName}>
                                        <div className={styles.shortName}>
                                            {theme ? <img src={busSppo} alt="" /> :
                                                <img src={bus} alt="" />
                                            }
                                            <p className='ml-2 font-semibold leading-none'>{e.trip_id.trip_short_name}</p>
                                        </div>
                                        <p className="text-sm ml-2.5">{e.trip_id?.trip_headsign ?? 'Circular'}</p>
                                    </div>
                                </li>
                            })}
                    </ul>
                </div>
            </div> }
        </>
    )


}