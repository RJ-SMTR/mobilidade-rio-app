import { useContext } from 'react'
import logo from '../../assets/imgs/logoPrefeitura.png'
import triangles from '../../assets/imgs/trianglesSppo.svg'
import logoBrt from '../../assets/imgs/light_logo.png'
import trianglesBrt from '../../assets/imgs/triangles.svg'
import { ThemeContext } from '../../hooks/getTheme'
import styles from './styles.module.scss'
export function Header() {
    const {theme} = useContext(ThemeContext)
    return (
        <>
            {theme ? <header>
                <img className="absolute top-0 z-0 w-full " src={triangles} alt="" />
                <div className="flex justify-end p-4">
                    <img src={logo} alt="" className={styles.logo} />
                </div>
            </header > :
                <header>
                    <img className="absolute top-0 z-0 w-full " src={trianglesBrt} alt="" />
                    <div className="flex justify-end p-4">
                        <img src={logoBrt} alt="" className={styles.logo} />
                    </div>
                </header>
            }
        </>
    )
}