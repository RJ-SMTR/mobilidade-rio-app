import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import busSppo from '../../assets/imgs/busSppo.svg'
import { TripContext } from '../../hooks/getTrips'
import { useContext } from 'react'
import { Oval } from 'react-loader-spinner'
import { RoutesContext } from '../../hooks/getRoutes'
import { GrClose } from 'react-icons/gr'
import { ThemeContext } from '../../hooks/getTheme'
import { ShapeContext } from '../../hooks/getShape'


export function SequenceCard() {

    const { setTrip, sequenceInfo, stopInfo } = useContext(TripContext)
    const {stopId} = useContext(RoutesContext)
    const {theme} = useContext(ThemeContext)
    const { setPoints } = useContext(ShapeContext)
    function clearMapInfo() {
        setTrip('')
        setPoints('')
    }


    return (
        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                <div className={styles.sequenceCard}>
                    <div className='flex justify-end'>
                        <button onClick={() => clearMapInfo()}>
                            <GrClose />
                        </button>
                    </div>
                    <div className={styles.directionBanner}>
                        <p className='text-sm'>Dirija-se à <span className='font-bold'>porta direita</span> em Rio Centro</p>
                    </div>
                    {!stopInfo ?
                        <div className='flex justify-center'>
                            <Oval
                                height={40}
                                width={40}
                                color="#707070"
                                wrapperStyle={{}}
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#707070"
                                strokeWidth={4}
                                strokeWidthSecondary={4} />
                        </div>
                        :
                        <>
                            <h1 className="text-xl font-semibold flex items-start">
                                <div className={styles.routeHeader}>
                                    {theme ? <img src={busSppo} alt="" /> : <img src={bus} alt="" />}
                                    <p className='ml-2 font-semibold leading-none'>
                                        {stopInfo.trip_short_name}
                                    </p>
                                </div>
                                {stopInfo.trip_headsign}
                            </h1>

                            <ul className={styles.timeline}>
                                {sequenceInfo.map((e) => {
                                    return <li key={e.id} className={`${styles.event} ${e.stop_id.stop_id == stopId ? styles.active : ''}`} >
                                        {e.stop_id.stop_name}
                                    </li>
                                })}

                            </ul>
                        </>
                    }
                </div>
            </div>
        </>
    )


}