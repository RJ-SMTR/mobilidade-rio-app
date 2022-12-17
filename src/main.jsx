import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import { CodeProvider } from './hooks/getCode'
import { TripProvider } from './hooks/getTrips'
import { ThemeProvider } from './hooks/getTheme'
import { ShapeProvider } from './hooks/getShape'
import { BrowserRouter as Router } from 'react-router-dom'

import 'leaflet/dist/leaflet.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <CodeProvider>
      <RoutesProvider>
        <TripProvider>
          <ShapeProvider>
          <ThemeProvider>
          <App />
          </ThemeProvider>
          </ShapeProvider>
        </TripProvider>
      </RoutesProvider>
    </CodeProvider>
    </Router>

  </React.StrictMode>
)
