
import { SelectInputs } from '../Selectinputs/SelectInputs'
import logo from '../../assets/imgs/dark_logo.png'
import { GrFormClose } from 'react-icons/gr'
import styles from './styles.module.scss'
import { useContext } from 'react'
import { CodeContext } from '../../hooks/getCode'
import { TripContext } from '../../hooks/getTrips'

export function Header(props) {
    const {code, setCode} = useContext(CodeContext)
    const {setTrip} = useContext(TripContext)

    function clearInfo(){
        setCode('')
        setTrip('')
    }
    return (
        <>
            <header className={styles.header}>
                <div className="p-3">
                    <div className='flex justify-end mb-6'>
                        <img src={logo} alt="" className={styles.logo} />
                    </div>
                    <div className="flex items-center r mb-6">
                        {/* SVG */}
                        <svg width="24" height="93" viewBox="0 0 24 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11.069" cy="31.069" r="2.06897" fill="#fff" />
                            <circle cx="11.069" cy="50.931" r="2.06897" fill="#fff" />
                            <circle cx="11.069" cy="41" r="2.06897" fill="#fff" />
                            <circle cx="11.5" cy="9.5" r="7" stroke="#fff" fill='#3EC3FF' stroke-width="5" />
                            <path d="M11.9366 75.7504C13.1727 75.7504 14.1747 74.7244 14.1747 73.4587C14.1747 72.193 13.1727 71.1669 11.9366 71.1669C10.7005 71.1669 9.69849 72.193 9.69849 73.4587C9.69849 74.7244 10.7005 75.7504 11.9366 75.7504Z" fill="#fff" />
                            <path d="M11.9367 62C8.79145 61.9998 5.77326 63.2708 3.53809 65.5366C1.30293 67.8024 0.0314523 70.88 0 74.1004C0 82.4728 10.5192 91.7926 10.9668 92.1898C11.2371 92.4265 11.581 92.5566 11.9367 92.5566C12.2923 92.5566 12.6363 92.4265 12.9065 92.1898C13.4288 91.7926 23.8734 82.4728 23.8734 74.1004C23.8419 70.88 22.5704 67.8024 20.3353 65.5366C18.1001 63.2708 15.0819 61.9998 11.9367 62V62ZM11.9367 78.8061C10.9038 78.8061 9.89412 78.4924 9.03532 77.9049C8.17652 77.3173 7.50717 76.4821 7.1119 75.505C6.71664 74.5279 6.61322 73.4527 6.81472 72.4155C7.01623 71.3782 7.5136 70.4254 8.24395 69.6775C8.97431 68.9297 9.90483 68.4204 10.9179 68.214C11.9309 68.0077 12.9809 68.1136 13.9352 68.5183C14.8894 68.9231 15.705 69.6085 16.2789 70.4878C16.8527 71.3672 17.159 72.4011 17.159 73.4587C17.159 74.8769 16.6088 76.237 15.6294 77.2399C14.65 78.2427 13.3217 78.8061 11.9367 78.8061V78.8061Z" fill="#fff" />
                        </svg>
                        {/* SVG END */}
                        <div className="flex flex-col w-full ml-4">
                      <form>
                           <div className='relative'>
                                    <button className='absolute right-0 top-0 bottom-0' onClick={() => clearInfo()}>
                                        <GrFormClose/>
                            </button>
                             <input type="text" placeholder='Selecione a estação de origem' className="rounded-lg py-3.5 px-3 w-full  inputShadow" value={code.toUpperCase()} />
                           </div>
                              <SelectInputs id="whereTo">
                                  <option value="">
                                      Selecione a estação de destino
                                  </option>
                              </SelectInputs>
                      </form>
                        </div>
                    </div>
                </div>

            </header>
        </>
    )
}