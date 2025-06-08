import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  layers: Array<{ id: string; name: string; marks: { name: string; lat: number; lng: number }[] }>;
  enabled: Record<string, boolean>;
}

const center: [number, number] = [-38.1, 144.8];
const zoom = 10;

const MapDisplay: React.FC<MapDisplayProps> = ({ layers, enabled }) => (
  <div style={{ flex: 1, height: '100vh', minWidth: 0, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {layers.filter(l => enabled[l.id]).flatMap((layer) =>
        layer.marks.map((mark, i) => (
          <Circle
            key={layer.id + '-' + i}
            center={[mark.lat, mark.lng]}
            radius={120}
            pathOptions={{ color: '#1976d2', fillColor: '#1976d2', fillOpacity: 0.6 }}
          >
            <Popup>
              <b>{mark.name}</b><br />
              {mark.lat.toFixed(6)}, {mark.lng.toFixed(6)}
            </Popup>
          </Circle>
        ))
      )}
    </MapContainer>
  </div>
);

export default MapDisplay;
