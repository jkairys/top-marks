import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import {NewLayer} from './NewLayer'
import MapView from './MapView'

function App() {
  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <h2>Menu</h2>
          <nav>
            <ul>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/new-layer">New Layer</Link></li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/new-layer" element={<NewLayer />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="*" element={<div>Welcome! Select a page above.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
