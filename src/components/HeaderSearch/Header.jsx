import logo from '../../assets/imgs/light_logo.png'
import styles from './styles.module.scss'
export function Header() {
    return (
        <header>
            {/* Polygons */}
            <svg className="absolute top-0 z-0 w-full " width="414" height="432" viewBox="0 0 414 432" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M233.114 234.786L-173.682 144.118L106.061 -123.004L233.114 234.786Z" fill="#010101" />
                <path d="M260.628 228.939L-146.168 138.271L133.575 -128.85L260.628 228.939Z" fill="#F8AC04" />
            </svg>
            {/* Polygon end */}
            <div className="flex justify-end p-4">
                <img src={logo} alt="" className={styles.logo} />
            </div>
        </header>
    )
}