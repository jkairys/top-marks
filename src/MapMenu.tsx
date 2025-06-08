import React from 'react';

interface MapMenuProps {
  layers: Array<{ id: string; name: string }>;
  enabled: Record<string, boolean>;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const MapMenu: React.FC<MapMenuProps> = ({ layers, enabled, onToggle, onRemove }) => (
  <aside style={{ width: 220, padding: 16, background: '#f7f7f7', borderRight: '1px solid #ddd', color: '#222', fontSize: 15, height: '100vh', boxSizing: 'border-box' }}>
    <h3 style={{ color: '#222', fontWeight: 600, marginBottom: 12 }}>Layers</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {layers.map((layer) => (
        <li key={layer.id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#222', fontWeight: 500, flex: 1 }}>
            <span style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#1976d2',
              marginRight: 4,
              border: '1px solid #bbb',
            }} />
            <input
              type="checkbox"
              checked={!!enabled[layer.id]}
              onChange={() => onToggle(layer.id)}
              style={{ accentColor: '#1976d2', width: 18, height: 18, margin: 0 }}
            />
            <span>{layer.name}</span>
          </label>
          <button
            onClick={() => onRemove(layer.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#b71c1c',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              marginLeft: 8,
              padding: 0,
              lineHeight: 1
            }}
            title={`Remove layer "${layer.name}"`}
            aria-label={`Remove layer ${layer.name}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default MapMenu;
