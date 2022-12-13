import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import proximity from '../../assets/imgs/proximity.svg'
import { useState, useEffect, useContext } from "react"
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'
import axios from 'axios'
import { RoutesContext } from '../../hooks/getRoutes'
import { Oval } from 'react-loader-spinner'

export function InfoCard(){
    const [name, setName] = useState()
    const {code} = useContext(CodeContext)
    const {routes, setRoutes, getMultiplePages, stopId} = useContext(RoutesContext)
    const { setTrip } = useContext(TripContext);


    useEffect(() => {
        axios.get('https://api.dev.mobilidade.rio/gtfs/stops/?stop_code=' + code.toUpperCase())
               .then(response => setName(response.data.results[0].stop_name)) 
    }, [code])

    return(
        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                <div className={styles.routesCard}>
                    <p className='text-[#707070] text-sm'>Você está em</p>
                    <h1 className="text-xl font-semibold">{name}</h1>
                    <p className="text-sm mb-3">Aberta todos os dias entre 04:00 e 00h</p>
                    {/* <p className="text-sm mb-6 text-[#707070]">Próximos ônibus na estação</p> */}
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
                                        <img src={bus} alt="" />
                                        <p className='ml-2 font-semibold leading-none'>{e.trip_id.trip_short_name}</p>
                                    </div>
                                    <p className="text-sm ml-2.5">{e.trip_id?.trip_headsign ?? 'Circular'}</p>
                                </div>
                                {/* <div className='flex items-center'>
                                    <img src={proximity} width="24%" alt="" />
                                    <p className='font-bold w-90'>3 min</p>
                                </div> */}
                            </li>
                        })} 
                       
                    
                    </ul>
                </div>
            </div>
        </>
    )


}