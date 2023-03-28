import { Home } from "./pages/Home"
import { SearchMain } from './pages/SearchMain'
import './assets/styles/globals.scss'
import {useContext, useEffect} from 'react'
import { CodeContext } from "./hooks/getCode"
import {BrowserRouter, Route, Routes} from 'react-router-dom'


function App() {

  return (
    <Routes>
      <Route path="/" element={<SearchMain/>}/>
      <Route  path="/:codeURL" action={({params}) => {}} element={<Home/>} />
    </Routes>
  )
}


export default App
