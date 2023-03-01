import styles from './styles.module.scss'
import { useContext, useState } from 'react'
import { FormContext } from "../../hooks/useForm";
import { GrClose } from 'react-icons/gr'



export function Form() {
    const {activateForm } = useContext(FormContext)

    const [selectedOption, setSelectedOption] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(selectedOption);
    }
 

    return (

        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[402]">
                <div className={styles.formCard}>
                    <div className="flex justify-end">
                        <button onClick={() => activateForm()}>
                            <GrClose />
                        </button>
                    </div>
                    <h1 className="text-xl text-center font-semibold mb-3">Essa informação<br/> foi útil para você?</h1>
                    <form className='flex flex-col' onSubmit={handleSubmit}>
                        <div className='flex  justify-evenly'>
                           <label className={styles.thumbContainer}>
                               <input type="radio" value="thumbsUp" checked={selectedOption === "positivo"} onChange={() => setSelectedOption("positivo")} />
                             <span className={styles.thumbUp}></span>
                           </label>
                           <label className={styles.thumbContainer}>
                               <input type="radio" value="thumbsDown" checked={selectedOption === "negativo"} onChange={() => setSelectedOption("negativo")} />
                                <span className={styles.thumbDown}></span>
                           </label>
                     </div>
                     <div className='mt-5'>
                            <p className="text-sm text-center font-semibold mb-3">Quer deixar um comentário?</p>
                            <input className='rounded-md w-full p-2 pb-8 bg-[#cccccc]/25' type="text" name="" id="" placeholder='Digite algo aqui...' />

                     </div>
                        <button className='block bg-black text-white text-bold uppercase p-1 rounded-md mt-3' type="submit">Enviar</button>
                    </form>

                </div>
            </div>
              
        </>
    )


}