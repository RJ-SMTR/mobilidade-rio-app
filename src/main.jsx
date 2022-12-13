import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import { CodeProvider } from './hooks/getCode'
import { TripProvider } from './hooks/getTrips'
import { BrowserRouter as Router } from 'react-router-dom'

import 'leaflet/dist/leaflet.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>

    <CodeProvider>
      <RoutesProvider>
        <TripProvider>
          <App />
        </TripProvider>
      </RoutesProvider>
    </CodeProvider>
    </Router>

  </React.StrictMode>
)
