
import { useState, useEffect, useContext } from "react"
import { api } from '../../services/api'


import { Oval } from 'react-loader-spinner'
import { GrClose } from 'react-icons/gr'
import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import busSppo from '../../assets/imgs/busSppo.svg'
import pin from '../../assets/imgs/pin.svg'
import whitePin from '../../assets/imgs/whitePin.svg'

import { MovingMarkerContext } from '../../hooks/getMovingMarkers'
import { FormContext } from "../../hooks/useForm";
import { ThemeContext } from '../../hooks/getTheme'
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'
import { RoutesContext } from '../../hooks/getRoutes'
import { GPSContext } from "../../hooks/getGPS"




export function InfoCard() {
    const { code, setGpsUrl, gpsUrl } = useContext(CodeContext)
    const { routes, isParent, getMultiplePages, plataforms, setRoutes, activateLoader } = useContext(RoutesContext)
    const { setTracked, arrivals, setArrivals } = useContext(MovingMarkerContext)
    const { setTrip } = useContext(TripContext);
    const { stopFetching } = useContext(GPSContext)
    const { theme } = useContext(ThemeContext)
    const { activateForm, setSelectedPlatform } = useContext(FormContext)
    const [name, setName] = useState()
    const [linha, setLinha] = useState(false)
    const [sortedPlatforms, setSortedPlatforms] = useState()



    useEffect(() => {
        api.get('/stops/?stop_code=' + code.toUpperCase())
            .then(response => setName(response.data.results[0].stop_name))
    }, [code])

    function infoLinha() {
        if (!linha) {
            setLinha(true)
        } else {
            setLinha(false)
        }
    }

    useEffect(() => {
        if(plataforms){
        setSortedPlatforms(
            plataforms.map((e) =>
                Object.values(e)
                    .sort((a, b) => {
                        const platformA = Object.values(a)[0];
                        const platformB = Object.values(b)[0];
                        if (platformA.platform_code < platformB.platform_code) {
                            return -1;
                        }
                        if (platformA.platform_code > platformB.platform_code) {
                            return 1;
                        }
                        return 0;
                    })
                    .map((p) => {
                        const platform = Object.values(p)[0];
                        const isConvencionais = platform.stop_desc.includes("Convencionais");
                        const modifiedPlatform = {
                            ...platform,
                            isConvencionais: isConvencionais
                        };
                        return { ...p, ...{ [Object.keys(p)[0]]: modifiedPlatform } };
                    })
            )
        );
                }
    }, [plataforms])
  
    return (

        <>

            {isParent ? <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">

                <div className={styles.routesCard}>
                    <button className='formButton inputShadow' onClick={() => activateForm()}>
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.8289 9.34643C21.5163 8.97112 21.1251 8.669 20.683 8.46139C20.2409 8.25378 19.7586 8.14574 19.2701 8.14491H14.197L14.82 6.55399C15.0791 5.85742 15.1655 5.10838 15.0715 4.37113C14.9776 3.63388 14.7062 2.93042 14.2806 2.32109C13.8551 1.71176 13.2881 1.21476 12.6283 0.872708C11.9684 0.530659 11.2355 0.353774 10.4923 0.357227C10.2783 0.357674 10.0689 0.419835 9.88937 0.536258C9.7098 0.652681 9.56763 0.818425 9.47988 1.01362L6.30919 8.14491H3.69475C2.80957 8.14491 1.96065 8.49654 1.33473 9.12246C0.708814 9.74837 0.357178 10.5973 0.357178 11.4825V19.2702C0.357178 20.1553 0.708814 21.0043 1.33473 21.6302C1.96065 22.2561 2.80957 22.6077 3.69475 22.6077H17.8572C18.638 22.6075 19.394 22.3335 19.9936 21.8334C20.5933 21.3334 20.9986 20.639 21.1391 19.8709L22.5521 12.0832C22.6394 11.6019 22.62 11.1073 22.495 10.6344C22.37 10.1614 22.1426 9.72175 21.8289 9.34643ZM5.9198 20.3827H3.69475C3.39969 20.3827 3.11672 20.2655 2.90808 20.0568C2.69944 19.8482 2.58223 19.5652 2.58223 19.2702V11.4825C2.58223 11.1874 2.69944 10.9044 2.90808 10.6958C3.11672 10.4872 3.39969 10.37 3.69475 10.37H5.9198V20.3827ZM20.3826 11.6827L18.9697 19.4704C18.9223 19.7296 18.7845 19.9635 18.5808 20.1306C18.377 20.2976 18.1206 20.387 17.8572 20.3827H8.14485V9.49106L11.1709 2.68241C11.4824 2.77322 11.7717 2.92761 12.0205 3.13585C12.2693 3.34409 12.4723 3.60165 12.6165 3.89227C12.7608 4.18289 12.8433 4.50026 12.8587 4.82435C12.8741 5.14844 12.8222 5.47221 12.7062 5.77523L12.1166 7.36614C11.9909 7.7024 11.9485 8.06408 11.9929 8.42029C12.0374 8.7765 12.1673 9.11668 12.3717 9.41178C12.5761 9.70689 12.8488 9.94816 13.1667 10.115C13.4845 10.2819 13.838 10.3693 14.197 10.37H19.2701C19.4335 10.3697 19.595 10.4054 19.7431 10.4747C19.8912 10.5439 20.0221 10.6449 20.1268 10.7705C20.2339 10.8943 20.3124 11.0403 20.3567 11.198C20.4009 11.3557 20.4098 11.5212 20.3826 11.6827Z" fill="white" />
                        </svg>
                    </button>
                    {!routes ? <></> : <div className='flex justify-end'>
                        <button onClick={() => (setRoutes(), setTracked(), infoLinha(), setArrivals(), stopFetching(), setGpsUrl())}>
                            <GrClose />
                        </button>
                    </div>}
                    <p className='text-[#707070] text-sm'>Você está em </p>
                    <h1 className="text-xl font-semibold mb-3">{name}</h1>
                    {linha ?
                        <p className='text-[#707070] text-sm'>Veja o próximo ônibus na estação:</p> :
                        <p className='text-[#707070] text-sm'>Selecione o sentido para mais informações:</p>
                    }
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

                                /> : sortedPlatforms.map((e) => Object.values(e).map((values) => {
                                    return <li className='flex justify-between border-b py-2.5' onClick={() => { getMultiplePages("/stop_times/?stop_id=" + Object.keys(values)[0]), infoLinha(), setSelectedPlatform(Object.keys(values)), activateLoader(), setGpsUrl('?stop_id=' + Object.keys(values)[0]) }}>
                                        <div className={styles.routeName}>
                                            {!Object.values(values)[0].isConvencionais ? <>
                                                <div className={` ${styles.shortName} + bg-[#F8AC04]`}>
                                                    <img src={pin} alt="" />
                                                    <p className="text-sm ml-2.5">{Object.values(values)[0].stop_desc}</p>
                                                </div>
                                            </>
                                                : <>
                                                    <div className={` ${styles.shortName} + bg-[#004a80]`}>
                                                        <img src={whitePin} alt="" />
                                                        <p className="text-sm ml-2.5 text-white">{Object.values(values)[0].stop_desc}</p>
                                                    </div>
                                                </>}


                                        </div>
                                    </li>
                                }))

                            }</> : !arrivals || arrivals.length < 1 ?
                            // MOSTRA ROUTES QND NÃO TIVER NENHUM ARRIVAL (PLACEHOLDER)
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

                                />

                            : arrivals.map((e) => {
                                return <li key={e.id} onClick={() => setTrip(e.trip_id.trip_id)} className="flex justify-between border-b py-2.5">
                                    <div className={styles.routeName}>
                                        <div className="flex">
                                            <div className={` ${styles.shortName}  ${e.trip_id.route_id.route_type === 702 ? 'bg-[#F8AC04]' :'bg-[#004a80]' }`}>
                                                {e.trip_id.route_id.route_type === 702 ?<><img src={bus} alt="" />
                                                <p className='ml-2 font-semibold leading-none'>{e.trip_id.trip_short_name}</p>
                                                </> 
                                                 : <>
                                                    <img src={busSppo} alt="" />
                                                        <p className='ml-2 font-semibold leading-none text-white'>{e.trip_id.trip_short_name}</p>
                                                    </>
                                                }
                                            </div>
                                            <p className="text-sm ml-2.5">{e.trip_id?.trip_headsign ?? 'Circular'}</p>
                                        </div>

                                    </div>
                                    {e.smallestEtas != undefined ? 
                                        <p className="bg-[#F0EFEF] p-1 font-bold rounded-sm ml-4 flex">
                                            {Math.ceil(parseInt(e.smallestEtas)) > 1 && Math.ceil(parseInt(e.smallestEtas) > -1)
                                                ? `${Math.ceil((e.smallestEtas[0]))} min` : "Agora"}
                                            <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path id="wifi1" d="M6.28882 9.03169C6.28884 8.05757 5.97519 7.1214 5.41382 6.42003C5.29862 6.27631 5.14072 6.19359 4.97487 6.19006C4.80902 6.18653 4.6488 6.26249 4.52945 6.40122C4.4101 6.53995 4.34141 6.73009 4.33848 6.92981C4.33555 7.12953 4.39862 7.32248 4.51382 7.4662C4.83883 7.89362 5.0191 8.45215 5.0191 9.03169C5.0191 9.61123 4.83883 10.1698 4.51382 10.5972C4.39862 10.7409 4.33555 10.9338 4.33848 11.1336C4.34141 11.3333 4.4101 11.5234 4.52945 11.6622C4.6488 11.8009 4.80902 11.8768 4.97487 11.8733C5.14072 11.8698 5.29862 11.7871 5.41382 11.6433C5.97519 10.942 6.28884 10.0058 6.28882 9.03169Z" fill="black" />
                                                <path id="wifi2" d="M9.65389 9.03158C9.65344 8.12255 9.51273 7.22294 9.24016 6.38634C8.9676 5.54974 8.56874 4.79328 8.06736 4.16201C8.01168 4.09331 7.94616 4.0396 7.87457 4.00394C7.80297 3.96828 7.72669 3.95136 7.65008 3.95416C7.57347 3.95695 7.49804 3.9794 7.42808 4.02023C7.35813 4.06106 7.29502 4.11947 7.24236 4.19211C7.13602 4.33883 7.07871 4.53464 7.08304 4.73648C7.08518 4.83642 7.10239 4.93484 7.13369 5.0261C7.16499 5.11736 7.20975 5.19969 7.26544 5.26838C7.65629 5.75985 7.96718 6.34906 8.17952 7.00082C8.39187 7.65258 8.50131 8.3535 8.50131 9.06168C8.50131 9.76987 8.39187 10.4708 8.17952 11.1225C7.96718 11.7743 7.65629 12.3635 7.26544 12.855C7.21093 12.9247 7.16756 13.0078 7.13785 13.0995C7.10814 13.1913 7.09268 13.2898 7.09236 13.3894C7.09279 13.5364 7.12625 13.6801 7.18859 13.8027C7.25093 13.9252 7.33944 14.0213 7.44316 14.0789C7.54688 14.1366 7.66128 14.1533 7.77221 14.1271C7.88315 14.1008 7.98576 14.0327 8.06736 13.9313C8.57154 13.2965 8.97202 12.5351 9.24468 11.6931C9.51734 10.851 9.65654 9.94567 9.65389 9.03158Z" fill="black" />
                                                <path id="wifi3" d="M10.2712 16.3473C11.7236 14.3832 12.5352 11.7606 12.5352 9.03161C12.5352 6.3026 11.7236 3.68003 10.2712 1.71597C10.1629 1.58895 10.0219 1.52003 9.87628 1.52304C9.7307 1.52605 9.59137 1.60076 9.48624 1.73219C9.38112 1.86362 9.31798 2.04204 9.30948 2.23167C9.30098 2.42129 9.34776 2.6081 9.44043 2.75461C10.6882 4.43871 11.3857 6.68936 11.3857 9.03161C11.3857 11.3739 10.6882 13.6245 9.44043 15.3086C9.33735 15.4481 9.27949 15.6342 9.27889 15.8279C9.27919 15.9293 9.29519 16.0296 9.32592 16.1227C9.35665 16.2158 9.40149 16.2999 9.45774 16.3698C9.5681 16.5071 9.71561 16.5817 9.86804 16.5775C10.0205 16.5732 10.1654 16.4905 10.2712 16.3473Z" fill="black" />
                                            </svg>
                                        </p>
                                    : <></>}
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
                        <button className='formButton inputShadow' onClick={() => activateForm()}>
                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.8289 9.34643C21.5163 8.97112 21.1251 8.669 20.683 8.46139C20.2409 8.25378 19.7586 8.14574 19.2701 8.14491H14.197L14.82 6.55399C15.0791 5.85742 15.1655 5.10838 15.0715 4.37113C14.9776 3.63388 14.7062 2.93042 14.2806 2.32109C13.8551 1.71176 13.2881 1.21476 12.6283 0.872708C11.9684 0.530659 11.2355 0.353774 10.4923 0.357227C10.2783 0.357674 10.0689 0.419835 9.88937 0.536258C9.7098 0.652681 9.56763 0.818425 9.47988 1.01362L6.30919 8.14491H3.69475C2.80957 8.14491 1.96065 8.49654 1.33473 9.12246C0.708814 9.74837 0.357178 10.5973 0.357178 11.4825V19.2702C0.357178 20.1553 0.708814 21.0043 1.33473 21.6302C1.96065 22.2561 2.80957 22.6077 3.69475 22.6077H17.8572C18.638 22.6075 19.394 22.3335 19.9936 21.8334C20.5933 21.3334 20.9986 20.639 21.1391 19.8709L22.5521 12.0832C22.6394 11.6019 22.62 11.1073 22.495 10.6344C22.37 10.1614 22.1426 9.72175 21.8289 9.34643ZM5.9198 20.3827H3.69475C3.39969 20.3827 3.11672 20.2655 2.90808 20.0568C2.69944 19.8482 2.58223 19.5652 2.58223 19.2702V11.4825C2.58223 11.1874 2.69944 10.9044 2.90808 10.6958C3.11672 10.4872 3.39969 10.37 3.69475 10.37H5.9198V20.3827ZM20.3826 11.6827L18.9697 19.4704C18.9223 19.7296 18.7845 19.9635 18.5808 20.1306C18.377 20.2976 18.1206 20.387 17.8572 20.3827H8.14485V9.49106L11.1709 2.68241C11.4824 2.77322 11.7717 2.92761 12.0205 3.13585C12.2693 3.34409 12.4723 3.60165 12.6165 3.89227C12.7608 4.18289 12.8433 4.50026 12.8587 4.82435C12.8741 5.14844 12.8222 5.47221 12.7062 5.77523L12.1166 7.36614C11.9909 7.7024 11.9485 8.06408 11.9929 8.42029C12.0374 8.7765 12.1673 9.11668 12.3717 9.41178C12.5761 9.70689 12.8488 9.94816 13.1667 10.115C13.4845 10.2819 13.838 10.3693 14.197 10.37H19.2701C19.4335 10.3697 19.595 10.4054 19.7431 10.4747C19.8912 10.5439 20.0221 10.6449 20.1268 10.7705C20.2339 10.8943 20.3124 11.0403 20.3567 11.198C20.4009 11.3557 20.4098 11.5212 20.3826 11.6827Z" fill="white" />
                            </svg>
                        </button>
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

                                /></> : routes.map((e) => {
                                    return <li key={e.id} onClick={() => setTrip(e.trip_id.trip_id)} className="flex justify-between border-b py-2.5">
                                        <div className={`${styles.routeName} + flex`}>
                                            <div className={` ${styles.shortName} + bg-[#004a80]`}>
                                                <img src={busSppo} alt="" />
                                                <p className='ml-2 font-semibold leading-none text-white '>{e.trip_id.trip_short_name}</p>
                                            </div>
                                            <p className="text-sm ml-2.5">{e.trip_id?.trip_headsign ?? 'Circular'}</p>
                                        </div>
                                    </li>
                                })}
                        </ul>
                    </div>
                </div>}
        </>
    )


}