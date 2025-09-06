"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Basic marker icon fix for Leaflet in bundlers
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ lat, lng, label }) {
  const center = [Number(lat) || 43.6532, Number(lng) || -79.3832]; // default: Toronto
  const zoom = 12;

  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-neutral-border">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup>{label || "Selected location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
