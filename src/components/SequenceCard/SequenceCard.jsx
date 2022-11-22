import styles from './styles.module.scss'
import bus from '../../assets/imgs/bus.svg'
import proximity from '../../assets/imgs/proximity.svg'

export function SequenceCard() {

    return (
        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[401]">
                {/* CARD DEPOIS DE PESQUISAR DESTINO */}
                <div className={styles.sequenceCard}>
                    <div className={styles.directionBanner}>
                        <p className='text-sm'>Dirija-se à <span className='font-bold'>porta direita</span> em Rio Centro</p>
                    </div>
                    <h1 className="text-xl font-semibold flex">
                            <div className={styles.routeHeader}>
                                <img src={bus} alt="" />
                                <p className='ml-2 font-semibold leading-none'>51</p>
                            </div>
                           Vila Militar

                        
                    </h1>
                    <ul className={styles.timeline}>
                        <li className={`${styles.event} ${styles.active}`}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                        <li className={styles.event}>
                            teste 
                        </li>
                    </ul>
                
                </div>
            </div>
        </>
    )


}