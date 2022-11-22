import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import proximity from '../../assets/imgs/proximity.svg'

export function InfoCard(){

    return(
        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                {/* CARD SEM PESQUISAR DESTINO */}
                {/* <div className={styles.routesCard}>
                    <p className='text-[#707070] text-sm'>Você está em</p>
                    <h1 className="text-xl font-semibold">RioCentro</h1>
                    <p className="text-sm mb-3">Aberta todos os dias entre 04:00 e 00h</p>
                    <p className="text-sm mb-6 text-[#707070]">Próximos ônibus na estação</p>
                    <ul className={styles.routeList}>
                        <li className="flex justify-between border-b py-2.5">
                            <div className={styles.routeName}>
                                <div className={styles.shortName}>
                                    <img src={bus} alt="" />
                                    <p className='ml-2 font-semibold leading-none'>51</p>
                                </div>
                                <p className="text-sm ml-2.5">Vila Militar</p>

                            </div>
                            <div className='flex items-center'>
                                <img src={proximity} width="24%" alt="" />
                                <p className='font-bold w-90'>3 min</p>
                            </div>

                        </li>
                        <li className="flex justify-between border-b py-2.5">
                            <div className={styles.routeName}>
                                <div className={styles.shortName}>
                                    <img src={bus} alt="" />
                                    <p className='ml-2 font-semibold leading-none'>51</p>
                                </div>
                                <p className="text-sm ml-2.5">Vila Militar</p>

                            </div>
                            <div className='flex items-center'>
                                <img src={proximity} width="24%" alt="" />
                                <p className='font-bold w-90'>3 min</p>
                            </div>

                        </li>
                    
                    </ul>
                </div> */}

                
                {/* CARD DEPOIS DE PESQUISAR DESTINO */}
                <div className={styles.destinationCard}>
                    <div className={styles.directionBanner}>
                        <p className='text-sm'>Dirija-se à <span className='font-bold'>porta direita</span> em Rio Centro</p>
                    </div>
                    <h1 className="text-xl font-semibold">Morro do Outeiro</h1>
                    <p className="text-sm mb-3">Aberta todos os dias entre 04:00 e 00h</p>
                    <p className="text-sm mb-6 text-[#707070]">Próximos ônibus de Rio Centro para Morro do Outeiro </p>
                    <ul className={styles.routeList}>
                        <li className="flex justify-between border-b py-2.5">
                            <div className={styles.routeName}>
                                <div className={styles.shortName}>
                                    <img src={bus} alt="" />
                                    <p className='ml-2 font-semibold leading-none'>51</p>
                                </div>
                                <p className="text-sm ml-2.5">Vila Militar</p>

                            </div>
                            <div className='flex items-center'>
                                <img src={proximity} width="24%" alt="" />
                                <p className='font-bold w-90'>3 min</p>
                            </div>

                        </li>
                        <li className="flex justify-between border-b py-2.5">
                            <div className={styles.routeName}>
                                <div className={styles.shortName}>
                                    <img src={bus} alt="" />
                                    <p className='ml-2 font-semibold leading-none'>51</p>
                                </div>
                                <p className="text-sm ml-2.5">Vila Militar</p>

                            </div>
                            <div className='flex items-center'>
                                <img src={proximity} width="24%" alt="" />
                                <p className='font-bold w-90'>3 min</p>
                            </div>

                        </li>
                    
                    </ul>
                </div>
            </div>
        </>
    )


}