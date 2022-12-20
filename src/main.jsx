import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import { CodeProvider } from './hooks/getCode'
import { TripProvider } from './hooks/getTrips'
import { ThemeProvider } from './hooks/getTheme'
import {ToastContainer} from 'react-toastify'
import { BrowserRouter as Router } from 'react-router-dom'

import 'leaflet/dist/leaflet.css'
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <CodeProvider>
      <RoutesProvider>
        <TripProvider>
          <ThemeProvider>
          <App />
          </ThemeProvider>
          <ToastContainer/>
        </TripProvider>
      </RoutesProvider>
    </CodeProvider>
    </Router>

  </React.StrictMode>
)