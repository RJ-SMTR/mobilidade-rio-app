import styles from './styles.module.scss'
import { useContext, useState } from 'react'
import { FormContext } from "../../hooks/useForm";
import { CodeContext } from '../../hooks/getCode'
import { RoutesContext } from '../../hooks/getRoutes'
import { GrClose } from 'react-icons/gr'
import { TripContext } from '../../hooks/getTrips';
import axios from 'axios';



export function Form() {
    const { activateForm, selectedPlatform } = useContext(FormContext)
    const { code } = useContext(CodeContext)
    const { stopInfo } = useContext(TripContext)
    const [selectedOption, setSelectedOption] = useState();
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedOption === null || selectedOption === undefined) {
            setMessage("Por favor, selecione se a informação foi útil ou não.");
        } else {

            const formData = {
                "like": selectedOption,
                "stop_code": code,
            }
            if (stopInfo) {
                formData.route_id = stopInfo.route_id.route_id
            } 
            if(comment) {
                formData.comment = comment
            }
            if(selectedPlatform){
                formData.stop_id = selectedPlatform[0]
            }


            axios.post('https://api.dev.mobilidade.rio/feedback/brt/', formData)
                .then(function () {
                    setMessage("Feedback enviado com sucesso!");
                })
                .catch(function (error) {
                    if (error.request) {
                        setMessage("Ocorreu um erro ao enviar o feedback. Não foi possível se comunicar com o servidor.");
                    } else {
                        setMessage("Ocorreu um erro ao enviar o feedback.");
                    }

                });


        }
        setTimeout(() => {
        setMessage('');
    }, 5000);



    }

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    return (

        <>
            <div className="fixed bottom-0 translate-x-1/2 right-1/2 w-11/12 z-[402]">
                <div className={styles.formCard}>
                    <div className="flex justify-end">
                        <button onClick={() => activateForm()}>
                            <GrClose />
                        </button>
                    </div>
                    <h1 className="text-xl text-center font-semibold mb-3">Essa informação<br /> foi útil para você?</h1>
                    {message && (
                        <div className={`${styles.message} ${message.includes('sucesso') ? styles['message--success'] : styles['message--error']}`}>
                            {message}
                        </div>
                    )}
                    <form className='flex flex-col' onSubmit={handleSubmit}>
                        <div className='flex  justify-evenly'>
                            <label className={styles.thumbContainer}>
                                <input type="radio" value="thumbsUp" checked={selectedOption === true} onChange={() => setSelectedOption(true)} />
                                <span className={styles.thumbUp}></span>
                            </label>
                            <label className={styles.thumbContainer}>
                                <input type="radio" value="thumbsDown" checked={selectedOption === false} onChange={() => setSelectedOption(false)} />
                                <span className={styles.thumbDown}></span>
                            </label>
                        </div>
                        <div className='mt-5'>
                            <p className="text-sm text-center font-semibold mb-3">Quer deixar um comentário?</p>
                            <input className='rounded-md w-full p-2 pb-8 bg-[#cccccc]/25' type="text" name="comment" id="comment" value={comment} onChange={handleCommentChange} placeholder='Digite algo aqui...' />

                        </div>
                        <button className='block bg-black text-white text-bold uppercase p-1 inputShadow rounded-md mt-3' type="submit">Enviar</button>
                    </form>

                </div>
            </div>

        </>
    )


}