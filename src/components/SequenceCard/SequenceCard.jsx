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
import { FormContext } from "../../hooks/useForm";


export function SequenceCard() {

    const { setTrip, sequenceInfo, stopInfo, setSequenceInfo } = useContext(TripContext)
    const {stopId} = useContext(RoutesContext)
    const {theme} = useContext(ThemeContext)
    const { activateForm } = useContext(FormContext)
    const {setPoints} = useContext(ShapeContext)
    function clearMapInfo() {
        setTrip()
        setSequenceInfo()
        setPoints()
    }
  
    return (
        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                <div className={styles.sequenceCard}>
                    <button className='formButton inputShadow' onClick={() => activateForm()}>
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.8289 9.34643C21.5163 8.97112 21.1251 8.669 20.683 8.46139C20.2409 8.25378 19.7586 8.14574 19.2701 8.14491H14.197L14.82 6.55399C15.0791 5.85742 15.1655 5.10838 15.0715 4.37113C14.9776 3.63388 14.7062 2.93042 14.2806 2.32109C13.8551 1.71176 13.2881 1.21476 12.6283 0.872708C11.9684 0.530659 11.2355 0.353774 10.4923 0.357227C10.2783 0.357674 10.0689 0.419835 9.88937 0.536258C9.7098 0.652681 9.56763 0.818425 9.47988 1.01362L6.30919 8.14491H3.69475C2.80957 8.14491 1.96065 8.49654 1.33473 9.12246C0.708814 9.74837 0.357178 10.5973 0.357178 11.4825V19.2702C0.357178 20.1553 0.708814 21.0043 1.33473 21.6302C1.96065 22.2561 2.80957 22.6077 3.69475 22.6077H17.8572C18.638 22.6075 19.394 22.3335 19.9936 21.8334C20.5933 21.3334 20.9986 20.639 21.1391 19.8709L22.5521 12.0832C22.6394 11.6019 22.62 11.1073 22.495 10.6344C22.37 10.1614 22.1426 9.72175 21.8289 9.34643ZM5.9198 20.3827H3.69475C3.39969 20.3827 3.11672 20.2655 2.90808 20.0568C2.69944 19.8482 2.58223 19.5652 2.58223 19.2702V11.4825C2.58223 11.1874 2.69944 10.9044 2.90808 10.6958C3.11672 10.4872 3.39969 10.37 3.69475 10.37H5.9198V20.3827ZM20.3826 11.6827L18.9697 19.4704C18.9223 19.7296 18.7845 19.9635 18.5808 20.1306C18.377 20.2976 18.1206 20.387 17.8572 20.3827H8.14485V9.49106L11.1709 2.68241C11.4824 2.77322 11.7717 2.92761 12.0205 3.13585C12.2693 3.34409 12.4723 3.60165 12.6165 3.89227C12.7608 4.18289 12.8433 4.50026 12.8587 4.82435C12.8741 5.14844 12.8222 5.47221 12.7062 5.77523L12.1166 7.36614C11.9909 7.7024 11.9485 8.06408 11.9929 8.42029C12.0374 8.7765 12.1673 9.11668 12.3717 9.41178C12.5761 9.70689 12.8488 9.94816 13.1667 10.115C13.4845 10.2819 13.838 10.3693 14.197 10.37H19.2701C19.4335 10.3697 19.595 10.4054 19.7431 10.4747C19.8912 10.5439 20.0221 10.6449 20.1268 10.7705C20.2339 10.8943 20.3124 11.0403 20.3567 11.198C20.4009 11.3557 20.4098 11.5212 20.3826 11.6827Z" fill="white" />
                        </svg>
                    </button>
                    <div className='flex justify-end'>
                        <button onClick={() => clearMapInfo()}>
                            <GrClose />
                        </button>
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
                                {sequenceInfo ? 
                                    sequenceInfo.map((e) => {
                                        return <li key={e.id} className={`${styles.event} ${e.stop_id.stop_id == stopId ? styles.active : ''}`} >
                                            {e.stop_id.stop_name}
                                        </li>
                                    }) 
                                    : <>
                                        <Oval
                                            height={40}
                                            width={40}
                                            color="#707070"
                                            wrapperStyle={{}}
                                            visible={true}
                                            ariaLabel='oval-loading'
                                            secondaryColor="#707070"
                                            strokeWidth={4}
                                            strokeWidthSecondary={4} /></>
                                }
                          

                            </ul>
                        </>
                    }
                </div>
            </div>
        </>
    )


}