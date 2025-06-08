import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface MapLayersContextType {
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
}

const MapLayersContext = createContext<MapLayersContextType | undefined>(undefined);

export const MapLayersProvider = ({ children }: { children: ReactNode }) => {
  const [layers, setLayers] = useState<Layer[]>([]);

  const addLayer = (layer: Layer) => setLayers((prev) => [...prev, layer]);
  const removeLayer = (id: string) => setLayers((prev) => prev.filter(l => l.id !== id));

  return (
    <MapLayersContext.Provider value={{ layers, addLayer, removeLayer }}>
      {children}
    </MapLayersContext.Provider>
  );
};

export const useMapLayers = () => {
  const ctx = useContext(MapLayersContext);
  if (!ctx) throw new Error("useMapLayers must be used within MapLayersProvider");
  return ctx;
};