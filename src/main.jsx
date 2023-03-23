import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import { CodeProvider } from './hooks/getCode'
import { TripProvider } from './hooks/getTrips'
import { ThemeProvider } from './hooks/getTheme'
import { ShapeProvider } from './hooks/getShape'
import { GPSProvider } from './hooks/getGPS'
import { FormProvider } from './hooks/useForm'
import { MovingMarkerProvider } from './hooks/getMovingMarkers'
import { ServiceIdProvider } from './hooks/getServiceId'
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
          <ServiceIdProvider>
            <ThemeProvider>
              <RoutesProvider>
                <TripProvider>
                  <ShapeProvider>
                    <GPSProvider>
                      <MovingMarkerProvider>
                        <FormProvider>
                          <App />
                        </FormProvider>
                      </MovingMarkerProvider>
                    </GPSProvider>
                    <ToastContainer />
                  </ShapeProvider>
                </TripProvider>
              </RoutesProvider>
            </ThemeProvider>
          </ServiceIdProvider>
        </CodeProvider>
      </NameProvider>
    </Router>

  </React.StrictMode>
)
