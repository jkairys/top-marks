import React from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  folders: Array<{ id: string; name: string; layers: Array<{ id: string; name: string; marks: { name: string; lat: number; lng: number }[] }> }>;
  enabled: Record<string, boolean>;
  folderEnabled: Record<string, boolean>;
}

const center: [number, number] = [-38.1, 144.8];
const zoom = 10;

const LAYER_COLORS = [
  '#1976d2', '#d32f2f', '#388e3c', '#fbc02d', '#7b1fa2', '#f57c00', '#0288d1', '#c2185b', '#455a64', '#afb42b',
];
const getLayerColor = (idx: number) => LAYER_COLORS[idx % LAYER_COLORS.length];

const MarkerLabels: React.FC<{ folders: MapDisplayProps['folders']; enabled: MapDisplayProps['enabled']; folderEnabled: MapDisplayProps['folderEnabled'] }> = ({ folders, enabled, folderEnabled }) => {
  const map = useMap();
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const updateLabels = () => {
      if (!containerRef.current) return;
      const labels = containerRef.current.querySelectorAll('.leaflet-marker-label');
      labels.forEach(label => {
        const lat = parseFloat((label as HTMLElement).dataset.lat!);
        const lng = parseFloat((label as HTMLElement).dataset.lng!);
        const point = map.latLngToContainerPoint([lat, lng]);
        (label as HTMLElement).style.left = `${point.x}px`;
        (label as HTMLElement).style.top = `${point.y}px`;
      });
    };
    updateLabels();
    map.on('move zoom', updateLabels);
    window.addEventListener('resize', updateLabels);
    return () => {
      map.off('move zoom', updateLabels);
      window.removeEventListener('resize', updateLabels);
    };
  }, [map, folders, enabled, folderEnabled]);
  let colorIdx = 0;
  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 500 }}>
      {folders.filter(f => folderEnabled[f.id]).flatMap(folder =>
        folder.layers.filter(l => enabled[l.id]).flatMap(layer =>
          layer.marks.map((mark, i) => (
            <div
              key={layer.id + '-' + i + '-label'}
              className="leaflet-marker-label"
              data-lat={mark.lat}
              data-lng={mark.lng}
              style={{
                position: 'absolute',
                fontSize: 10,
                color: getLayerColor(colorIdx),
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                textShadow: '0 0 2px #fff',
              }}
            >
              {mark.name}
            </div>
          ))
        )
      )}
    </div>
  );
};

const MapDisplay: React.FC<MapDisplayProps> = ({ folders, enabled, folderEnabled }) => {
  let colorIdx = 0;
  return (
    <div style={{ flex: 1, height: '100vh', minWidth: 0, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {folders.filter(f => folderEnabled[f.id]).flatMap(folder =>
          folder.layers.filter(l => enabled[l.id]).flatMap(layer =>
            layer.marks.map((mark, i) => (
              <Circle
                key={layer.id + '-' + i}
                center={[mark.lat, mark.lng]}
                radius={120}
                pathOptions={{ color: getLayerColor(colorIdx), fillColor: getLayerColor(colorIdx), fillOpacity: 0.6 }}
              >
                <Popup>
                  <b>{mark.name}</b><br />
                  {mark.lat.toFixed(6)}, {mark.lng.toFixed(6)}
                </Popup>
              </Circle>
            ))
          )
        )}
        <MarkerLabels folders={folders} enabled={enabled} folderEnabled={folderEnabled} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
