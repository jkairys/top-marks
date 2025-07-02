import React from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WMSTileLayer } from 'react-leaflet';
import L from 'leaflet';
import { CRS } from 'leaflet';

interface MapDisplayProps {
  folders: Array<{ id: string; name: string; layers: Array<{ id: string; name: string; marks: { name: string; lat: number; lng: number }[] }> }>;
  enabled: Record<string, boolean>;
  folderEnabled: Record<string, boolean>;
  showWind?: boolean;
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
  // Assign a unique color per folder
  const visibleFolders = folders.filter(f => folderEnabled[f.id]);
  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 500 }}>
      {visibleFolders.map((folder, folderIdx) =>
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
                color: '#fff',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                // Removed textShadow for clarity
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

const MapDisplay: React.FC<MapDisplayProps> = ({ folders, enabled, folderEnabled, showWind }) => {
  // Assign a unique color per folder
  const visibleFolders = folders.filter(f => folderEnabled[f.id]);
  return (
    <div style={{ flex: 1, height: '100vh', minWidth: 0, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {showWind && (
          <WMSTileLayer
            url="http://localhost:4000/bom-wms/mapcache/meteye"
            layers="IDZ73069,IDZ73070_swell_small,IDZ73070_swell_big,IDZ73070_swell2_small,IDZ73070_swell2_big"
            format="image/png"
            transparent={true}
            attribution="BOM MetEye"
            opacity={0.3}
            version="1.1.1"
            // params={{ TIMESTEP: '69', BASETIME: '202506180600', ISSUETIME: '20250618064546' }}
            crs={CRS.EPSG4326}
          />
        )}
        {visibleFolders.map((folder, folderIdx) =>
          folder.layers.filter(l => enabled[l.id]).flatMap(layer =>
            layer.marks.map((mark, i) => (
              <Circle
                key={layer.id + '-' + i}
                center={[mark.lat, mark.lng]}
                radius={120}
                pathOptions={{ color: getLayerColor(folderIdx), fillColor: getLayerColor(folderIdx), fillOpacity: 0.6 }}
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
