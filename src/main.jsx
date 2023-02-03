import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import { CodeProvider } from './hooks/getCode'
import { TripProvider } from './hooks/getTrips'
import { ThemeProvider } from './hooks/getTheme'
import { ShapeProvider } from './hooks/getShape'
import { GPSProvider } from './hooks/getGPS'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router } from 'react-router-dom'

import 'leaflet/dist/leaflet.css'
import 'react-toastify/dist/ReactToastify.css';
import { NameProvider } from './hooks/getName'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <NameProvider>
        <CodeProvider>
          <RoutesProvider>
            <TripProvider>
              <ShapeProvider>
                <ThemeProvider>
                  <GPSProvider>
                    <App />
                  </GPSProvider>
                </ThemeProvider>
                <ToastContainer />
              </ShapeProvider>
            </TripProvider>
          </RoutesProvider>
        </CodeProvider>
      </NameProvider>
    </Router>

  </React.StrictMode>
)
