import React, { useState } from 'react';
import { useMapLayers } from './context/map-layer';
import MapMenu from './MapMenu';
import MapDisplay from './MapDisplay';

const MapView: React.FC = () => {
  const { layers, removeLayer } = useMapLayers();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    // All layers enabled by default
    const state: Record<string, boolean> = {};
    layers.forEach(l => { state[l.id] = true; });
    return state;
  });

  // Update enabled state if layers change (e.g. new layer added)
  React.useEffect(() => {
    setEnabled(prev => {
      const next = { ...prev };
      layers.forEach(l => {
        if (!(l.id in next)) next[l.id] = true;
      });
      // Remove deleted layers
      Object.keys(next).forEach(id => {
        if (!layers.find(l => l.id === id)) delete next[id];
      });
      return next;
    });
  }, [layers]);

  const handleToggle = (id: string) => setEnabled(en => ({ ...en, [id]: !en[id] }));
  const handleRemove = (id: string) => {
    setEnabled(en => {
      const copy = { ...en };
      delete copy[id];
      return copy;
    });
    removeLayer(id);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', minHeight: 0, overflow: 'hidden' }}>
      <MapMenu layers={layers} enabled={enabled} onToggle={handleToggle} onRemove={handleRemove} />
      <MapDisplay layers={layers} enabled={enabled} />
    </div>
  );
};

export default MapView;
