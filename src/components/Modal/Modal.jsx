import Modal from 'react-modal';
import { useContext } from 'react';
import { GrClose } from 'react-icons/gr';
import { ModalContext } from '../../hooks/useModal';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: '85%', 
        transform: 'translate(-50%, -50%)',
    },
};

export default function ModalHelp(){
 const {modalIsOpen, closeModal} = useContext(ModalContext)
    return(
        <>
            <div>
                
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Modal Ajuda"
                >
                    <div className='flex justify-end'>
                        <button onClick={closeModal}>
                            <GrClose />
                        </button>
                    </div>
                    <h1 className='text-lg'>Olá!</h1>
                    <p>Informamos que em caso de imprevisto, podem ocorrer a ausência de previsão de chegada dos ônibus! Caso aconteça, procure um dos nossos colaboradores na estação para obter maiores esclarecimentos e orientações.</p>
                    
                </Modal>
            </div>

        </>
    )
}