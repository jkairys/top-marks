import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MapLayersProvider } from './context/map-layer'
import { MapFoldersProvider } from './context/map-folders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapLayersProvider>
      <MapFoldersProvider>
        <App />
      </MapFoldersProvider>
    </MapLayersProvider>
  </StrictMode>,
)
