import { Home } from "./pages/Home"
import { SearchMain } from './pages/SearchMain'
import './assets/styles/globals.scss'
import { useEffect} from 'react'
import { Route, Routes} from 'react-router-dom'
import ReactGA from 'react-ga';
const TRACKING_ID = "G-0VNNWR1TFR"
ReactGA.initialize(TRACKING_ID);




function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SearchMain/>}/>
      <Route  path="/:codeURL" action={({params}) => {}} element={<Home/>} />
    </Routes>
  )
}


export default App
