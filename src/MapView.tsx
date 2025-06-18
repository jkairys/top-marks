import React, { useState } from 'react';
import { useMapFolders } from './context/map-folders';
import MapMenu from './MapMenu';
import MapDisplay from './MapDisplay';

const MapView: React.FC = () => {
  const { folders, removeFolder, removeLayer } = useMapFolders();
  // State for enabled layers and folders
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [folderEnabled, setFolderEnabled] = useState<Record<string, boolean>>({});

  // Initialize enabled state for folders and layers
  React.useEffect(() => {
    setFolderEnabled(prev => {
      const next = { ...prev };
      folders.forEach(f => { if (!(f.id in next)) next[f.id] = true; });
      Object.keys(next).forEach(id => { if (!folders.find(f => f.id === id)) delete next[id]; });
      return next;
    });
    setEnabled(prev => {
      const next = { ...prev };
      folders.forEach(f => f.layers.forEach(l => { if (!(l.id in next)) next[l.id] = true; }));
      Object.keys(next).forEach(id => {
        if (!folders.some(f => f.layers.find(l => l.id === id))) delete next[id];
      });
      return next;
    });
  }, [folders]);

  const handleToggleLayer = (layerId: string) => setEnabled(en => ({ ...en, [layerId]: !en[layerId] }));
  const handleToggleFolder = (folderId: string) => setFolderEnabled(fen => ({ ...fen, [folderId]: !fen[folderId] }));
  const handleRemoveLayer = (folderId: string, layerId: string) => {
    setEnabled(en => { const copy = { ...en }; delete copy[layerId]; return copy; });
    removeLayer(folderId, layerId);
  };
  const handleRemoveFolder = (folderId: string) => {
    setFolderEnabled(fen => { const copy = { ...fen }; delete copy[folderId]; return copy; });
    removeFolder(folderId);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', minHeight: 0, overflow: 'hidden' }}>
      <MapMenu
        folders={folders}
        enabled={enabled}
        folderEnabled={folderEnabled}
        onToggleLayer={handleToggleLayer}
        onToggleFolder={handleToggleFolder}
        onRemoveLayer={handleRemoveLayer}
        onRemoveFolder={handleRemoveFolder}
      />
      <MapDisplay folders={folders} enabled={enabled} folderEnabled={folderEnabled} />
    </div>
  );
};

export default MapView;
