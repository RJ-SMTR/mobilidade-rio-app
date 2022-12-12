import { Home } from "./pages/Home"
import { SearchMain } from './pages/SearchMain'
import './assets/styles/globals.scss'
import {useContext, useEffect} from 'react'
import { CodeContext } from "./hooks/getCode"


function App() {
  const {code} = useContext(CodeContext)

  return (
    <>
      {!code ? <SearchMain /> : <Home props={code} />}
      
      
      {/* PÁGINA INICIAL */}
       
      
      {/* PÁGINA DPS DE LER QRCODE */}
     
    </>
  )
}

export default App
