import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RoutesProvider } from './hooks/getRoutes'
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoutesProvider>
      <App />
    </RoutesProvider>
  </React.StrictMode>
)
