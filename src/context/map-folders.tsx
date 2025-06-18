import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface GpsMark {
  name: string;
  lat: number;
  lng: number;
}

export interface Layer {
  id: string;
  name: string;
  marks: GpsMark[];
}

export interface Folder {
  id: string;
  name: string;
  layers: Layer[];
}

interface MapFoldersContextType {
  folders: Folder[];
  addFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  addLayer: (folderId: string, layer: Layer) => void;
  removeLayer: (folderId: string, layerId: string) => void;
  updateFolderName: (folderId: string, name: string) => void;
}

const MapFoldersContext = createContext<MapFoldersContextType | undefined>(undefined);

export const MapFoldersProvider = ({ children }: { children: ReactNode }) => {
  // Load folders from localStorage if available
  const [folders, setFolders] = useState<Folder[]>(() => {
    const stored = localStorage.getItem('topmarks-folders');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback to default if corrupted
        return [{ id: "default", name: "Default Folder", layers: [] }];
      }
    }
    return [{ id: "default", name: "Default Folder", layers: [] }];
  });

  // Persist folders to localStorage on change
  useEffect(() => {
    localStorage.setItem('topmarks-folders', JSON.stringify(folders));
  }, [folders]);

  const addFolder = (folder: Folder) => setFolders(prev => [...prev, folder]);
  const removeFolder = (id: string) => setFolders(prev => prev.filter(f => f.id !== id));
  const addLayer = (folderId: string, layer: Layer) => setFolders(prev => prev.map(f => f.id === folderId ? { ...f, layers: [...f.layers, layer] } : f));
  const removeLayer = (folderId: string, layerId: string) => setFolders(prev => prev.map(f => f.id === folderId ? { ...f, layers: f.layers.filter(l => l.id !== layerId) } : f));
  const updateFolderName = (folderId: string, name: string) => setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name } : f));

  return (
    <MapFoldersContext.Provider value={{ folders, addFolder, removeFolder, addLayer, removeLayer, updateFolderName }}>
      {children}
    </MapFoldersContext.Provider>
  );
};

export const useMapFolders = () => {
  const ctx = useContext(MapFoldersContext);
  if (!ctx) throw new Error("useMapFolders must be used within MapFoldersProvider");
  return ctx;
};
