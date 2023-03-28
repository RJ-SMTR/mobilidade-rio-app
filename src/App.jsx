import { Home } from "./pages/Home"
import { SearchMain } from './pages/SearchMain'
import './assets/styles/globals.scss'
import { Route, Routes} from 'react-router-dom'





function App() {

  return (
    <Routes>
      <Route path="/" element={<SearchMain/>}/>
      <Route  path="/:codeURL" action={({params}) => {}} element={<Home/>} />
    </Routes>
  )
}


export default App
