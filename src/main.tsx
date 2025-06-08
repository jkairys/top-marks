import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MapLayersProvider } from './context/map-layer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapLayersProvider>
      <App />
    </MapLayersProvider>
  </StrictMode>,
)
