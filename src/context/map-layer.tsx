import { createContext, useContext, useState } from "react";
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

interface MapLayersContextType {
  folders: Folder[];
  addFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  addLayer: (folderId: string, layer: Layer) => void;
  removeLayer: (folderId: string, layerId: string) => void;
}

const MapLayersContext = createContext<MapLayersContextType | undefined>(undefined);

export const MapLayersProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);

  const addFolder = (folder: Folder) => setFolders(prev => [...prev, folder]);
  const removeFolder = (id: string) => setFolders(prev => prev.filter(f => f.id !== id));
  const addLayer = (folderId: string, layer: Layer) => setFolders(prev => prev.map(f => f.id === folderId ? { ...f, layers: [...f.layers, layer] } : f));
  const removeLayer = (folderId: string, layerId: string) => setFolders(prev => prev.map(f => f.id === folderId ? { ...f, layers: f.layers.filter(l => l.id !== layerId) } : f));

  return (
    <MapLayersContext.Provider value={{ folders, addFolder, removeFolder, addLayer, removeLayer }}>
      {children}
    </MapLayersContext.Provider>
  );
};

export const useMapLayers = () => {
  const ctx = useContext(MapLayersContext);
  if (!ctx) throw new Error("useMapLayers must be used within MapLayersProvider");
  return ctx;
};