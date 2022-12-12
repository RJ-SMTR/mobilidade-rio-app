import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import { CodeProvider } from './hooks/getCode'
import { TripProvider } from './hooks/getTrips'
import 'leaflet/dist/leaflet.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CodeProvider>
      <RoutesProvider>
        <TripProvider>
          <App />
        </TripProvider>
      </RoutesProvider>
    </CodeProvider>
  </React.StrictMode>
)
