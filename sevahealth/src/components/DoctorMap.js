"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default Leaflet marker icons missing in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DoctorMap({ coords, doctorName, hospital }) {
  // If no coords provided, default to Center of India
  const position = coords || [20.5937, 78.9629]; 
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='Powered by <a href="https://www.geoapify.com/">Geoapify</a> | <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="font-sans">
              <strong className="text-indigo-700">{doctorName}</strong>
              <br />
              {hospital}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}