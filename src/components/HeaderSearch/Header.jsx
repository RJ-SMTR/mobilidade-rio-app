import logo from '../../assets/imgs/logoPrefeitura.png'
import styles from './styles.module.scss'
export function Header() {
    return (
        <>
        <header>
                <div className="flex justify-end p-4">
                    <img src={logo} alt="" className={styles.logo} />
                </div>
            </header > 
        </>
    )
}