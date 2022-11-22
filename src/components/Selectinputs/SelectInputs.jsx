import styles from './styles.module.scss'



export function SelectInputs({children, id, className}){

    return(
        <div className={styles.inputWrapper}>
            <select name="from" id={id} className={`rounded-lg py-3.5 px-3 ` + className}>
                 {children}
            </select>   
        </div>
    )
}