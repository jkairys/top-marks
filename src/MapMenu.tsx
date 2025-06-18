import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, Checkbox, Button, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';

import { useNavigate } from 'react-router-dom';
import { Layer } from 'leaflet';
import { useMapFolders } from './context/map-folders';

interface MapMenuProps {
  folders: Array<{ id: string; name: string; layers: Array<{ id: string; name: string }> }>;
  enabled: Record<string, boolean>;
  folderEnabled: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onRemoveLayer: (folderId: string, layerId: string) => void;
  onRemoveFolder: (folderId: string) => void;
}

const MapMenu: React.FC<MapMenuProps> = ({ folders, enabled, folderEnabled, onToggleLayer, onToggleFolder, onRemoveLayer, onRemoveFolder }) => {
  const navigate = useNavigate();
  const { addFolder, updateFolderName } = useMapFolders();
  // State to track which folder/layer is being edited
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingLayer, setEditingLayer] = useState<{ folderId: string; layerId: string } | null>(null);
  const [newLayerName, setNewLayerName] = useState('');
  const folderInputRef = useRef<HTMLInputElement>(null);
  const layerInputRef = useRef<HTMLInputElement>(null);

  // Focus the input when a new folder is being edited
  useEffect(() => {
    if (editingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
    }
  }, [editingFolder]);

  // Focus the input when a new layer is being edited
  useEffect(() => {
    if (editingLayer && layerInputRef.current) {
      layerInputRef.current.focus();
    }
  }, [editingLayer]);

  // Handler to add a new folder
  const handleAddFolder = () => {
    const tempId = 'temp-folder-' + Date.now();
    addFolder({ id: tempId, name: '', layers: [] });
    setEditingFolder(tempId);
    setNewFolderName('');
  };

  // Handler to save the new folder name
  const handleFolderNameSave = (folderId: string) => {
    updateFolderName(folderId, newFolderName.trim() || 'Untitled Folder');
    setEditingFolder(null);
    setNewFolderName('');
  };

  // Handler for Enter key for folder
  const handleFolderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, folderId: string) => {
    if (e.key === 'Enter') {
      handleFolderNameSave(folderId);
    }
  };

  // Handler to add a new layer to the first folder (or you can add folder selection logic)
  const handleAddLayer = () => {
    if (folders.length === 0) return; // No folder to add to
    const folderId = folders[0].id;
    // Generate a temporary id for the new layer
    const tempId = 'temp-layer-' + Date.now();
    // Add the new layer to the first folder
    folders[0].layers.push({ id: tempId, name: '' });
    setEditingLayer({ folderId, layerId: tempId });
    setNewLayerName('');
  };

  // Handler to save the new layer name
  const handleLayerNameSave = (folderId: string, layerId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    const layer = folder.layers.find(l => l.id === layerId);
    if (!layer) return;
    layer.name = newLayerName.trim() || 'Untitled Layer';
    setEditingLayer(null);
    setNewLayerName('');
  };

  // Handler for Enter key for layer
  const handleLayerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, folderId: string, layerId: string) => {
    if (e.key === 'Enter') {
      handleLayerNameSave(folderId, layerId);
    }
  };

  return (
    <Box sx={{ width: 280, bgcolor: '#f7f7f7', color: '#222', height: '100vh', borderRight: 1, borderColor: '#ddd', p: 2, boxSizing: 'border-box' }}>
      <SimpleTreeView
        sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }} defaultExpandedItems={folders.map(folder => folder.id)}
      >
        {folders.map(folder => (
          <TreeItem
            key={folder.id}
            itemId={folder.id}
            label={
              editingFolder === folder.id ? (
                <Box sx={{ flexGrow: 1 }}>
                  <input
                    type="hidden"
                    style={{ display: 'none' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <TextField
                        inputRef={folderInputRef}
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        onBlur={() => handleFolderNameSave(folder.id)}
                        onKeyDown={e => {
                          e.stopPropagation();
                          handleFolderKeyDown(e as React.KeyboardEvent<HTMLInputElement>, folder.id);
                        }}
                        size="small"
                        variant="outlined"
                        placeholder="Folder name"
                        sx={{ fontSize: 15, p: 0.5 }}
                        
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, textAlign: 'left' }}>
                  <Checkbox
                    checked={!!folderEnabled[folder.id]}
                    onChange={() => onToggleFolder(folder.id)}
                    sx={{ color: '#1976d2', p: 0, mr: 1 }}
                    size="small"
                  />
                  <Typography flexGrow={1} sx={{ fontWeight: 600, color: '#222' }}>{folder.name}</Typography>
                  <IconButton size="small" onClick={() => onRemoveFolder(folder.id)} sx={{ ml: 1 }}>
                    <DeleteIcon fontSize="small" sx={{ color: 'grey' }} />
                  </IconButton>
                </Box>
              )
            }
          >
            {folder.layers.map(layer => (
              <TreeItem
                key={layer.id}
                itemId={layer.id}
                label={
                  editingLayer && editingLayer.folderId === folder.id && editingLayer.layerId === layer.id ? (
                    <Box sx={{ flexGrow: 1 }}>
                      <TextField
                        inputRef={layerInputRef}
                        value={newLayerName}
                        onChange={e => setNewLayerName(e.target.value)}
                        onBlur={() => handleLayerNameSave(folder.id, layer.id)}
                        onKeyDown={e => handleLayerKeyDown(e, folder.id, layer.id)}
                        size="small"
                        variant="outlined"
                        placeholder="Layer name"
                        fullWidth
                        sx={{ fontSize: 14, p: 0.5 }}
                        InputProps={{
                          style: { fontSize: 14, padding: 2 }
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={!!enabled[layer.id]}
                        onChange={() => onToggleLayer(layer.id)}
                        sx={{ color: '#1976d2', p: 0, mr: 1 }}
                        size="small"
                      />
                      <LayersIcon sx={{ color: '#1976d2', fontSize: 18, mr: 0.5 }} />
                      <Typography flexGrow={1} sx={{ color: '#222' }} textAlign={'left'}>{layer.name}</Typography>
                      <IconButton size="small" onClick={() => onRemoveLayer(folder.id, layer.id)} sx={{ ml: 1 }}>
                        <DeleteIcon fontSize="small" sx={{ color: 'grey' }} />
                      </IconButton>
                    </Box>
                  )
                }
              />
            ))}
          </TreeItem>
        ))}
      </SimpleTreeView>
      <Box sx={{ gap: 1 }} display={'flex'} justifyContent={'flex-end'} marginTop={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          onClick={handleAddFolder}
          sx={{ textTransform: 'none' }}
        >
          <FolderIcon />
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          href={'/new-layer'}
          sx={{ textTransform: 'none' }}
        >
          <LayersIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default MapMenu;
