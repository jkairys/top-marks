import React, { useState } from "react";
import { useMapFolders } from "./context/map-folders";
import { useMapLayers } from "./context/map-layer";
import type { GpsMark } from "./context/map-layer";
import { v4 as uuidv4 } from "uuid";
import markerIcon from './assets/marker.svg';
import { useNavigate } from 'react-router-dom';

function parseGpsLine(line: string): GpsMark | null {
  // Try to match: Name – [S|N]DDD.DD.DDD | [E|W]DDD.DD.DDD or Name – DD DD DDD | DDD DD DDD
  const regex1 = /^(.+?)\s*[-–]\s*([SN]?)(\d{2,3})[ .](\d{2})[ .](\d{3})\s*\|\s*([EW]?)(\d{3})[ .](\d{2})[ .](\d{3})$/i;
  const regex2 = /^(.+?)\s*[-–]\s*([SN])(\d{3})\.(\d{2})\.(\d{3})\s*\|\s*([EW])(\d{3})\.(\d{2})\.(\d{3})$/i;
  const regex3 = /^(.+?)\s*[-–]\s*([SN])(\d{2,3})\.(\d{2})\.(\d{3})\s*\|\s*([EW])(\d{3})\.(\d{2})\.(\d{3})$/i;

  let match = line.match(regex1) || line.match(regex2) || line.match(regex3);
  if (!match) return null;

  const [
    ,
    name,
    latDir,
    latDeg,
    latMin,
    latFrac,
    lngDir,
    lngDeg,
    lngMin,
    lngFrac,
  ] = match;

  const lat =
    (latDir === "S" ? -1 : 1) *
    (parseInt(latDeg) + parseInt(latMin) / 60 + parseInt(latFrac) / 60000);
  const lng =
    (lngDir === "W" ? -1 : 1) *
    (parseInt(lngDeg) + parseInt(lngMin) / 60 + parseInt(lngFrac) / 60000);

  return {
    name: name.trim(),
    lat,
    lng,
  };
}

export const NewLayer: React.FC = () => {
  const { folders, addLayer } = useMapFolders();
  const {  } = useMapLayers();
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<GpsMark[]>([]);
  const [layerName, setLayerName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(folders[0]?.id || "");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    const lines = value.split("\n").map((l) => l.trim()).filter(Boolean);
    const marks: GpsMark[] = [];
    for (const line of lines) {
      const mark = parseGpsLine(line);
      if (mark) marks.push(mark);
    }
    setParsed(marks);
  };

  const handleAddLayer = () => {
    if (!layerName || parsed.length === 0 || !selectedFolder) return;
    addLayer(selectedFolder, {
      id: uuidv4(),
      name: layerName,
      marks: parsed,
    });
    setInput("");
    setParsed([]);
    setLayerName("");
    navigate('/map');
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h2>Add New Layer</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Folder:
          <select value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="" disabled>Select folder</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </label>
        <input
          type="text"
          placeholder="Layer name"
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
        />
        <textarea
          rows={6}
          placeholder="Paste GPS marks here"
          value={input}
          onChange={handleInputChange}
          style={{ width: "100%", marginTop: 8 }}
        />
        <button onClick={handleAddLayer} disabled={!layerName || parsed.length === 0 || !selectedFolder}>Add Layer</button>
      </div>
      <div style={{ flex: 1 }}>
        <h3>Parsed Marks</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {parsed.map((m, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <img src={markerIcon} alt="marker" style={{ width: 20, height: 20, marginRight: 8 }} />
              <span style={{ fontWeight: 500 }}>{m.name}</span>
              <span style={{ marginLeft: 8, color: '#555', fontSize: 13 }}>
                ({m.lat.toFixed(6)}, {m.lng.toFixed(6)})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};