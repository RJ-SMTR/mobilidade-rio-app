import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import { TripContext } from '../../hooks/getTrips'
import { useContext } from 'react'
import { Oval } from 'react-loader-spinner'


export function SequenceCard() {

    const { setTrip, sequenceInfo, stopInfo } = useContext(TripContext)

    return (
        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                <div className={styles.sequenceCard}>
                    <div className={styles.directionBanner}>
                        <p className='text-sm'>Dirija-se à <span className='font-bold'>porta direita</span> em Rio Centro</p>
                    </div>
                    <button className='text-sm underline' onClick={() => setTrip('')}>
                        Voltar
                    </button>
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
                            <h1 className="text-xl font-semibold flex">
                                <div className={styles.routeHeader}>
                                    <img src={bus} alt="" />
                                    <p className='ml-2 font-semibold leading-none'>
                                        {stopInfo.trip_short_name}
                                    </p>
                                </div>
                                {stopInfo.trip_headsign}
                            </h1>

                            <ul className={styles.timeline}>
                                {sequenceInfo.map((e) => {
                                    return <li key={e.id} className={`${styles.event}`} >
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