import React from "react";
import LocationMarker from "./locationMaker/locationMaker";
import AddSearchControl from './addSearchControl/addSearchControl';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { MapProps } from "./types";

// Corrección de iconos predeterminados de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});



const Map: React.FC<MapProps> = ({ widthClass = "w-full", heightClass = "h-96", onAddressSelect, showSearchControl = true, zoomControl = true, coordinates, zoom=16 }) => {
 // Establecer la ubicación predeterminada
 const center: [number, number] = coordinates && coordinates.length === 2 ? coordinates : [-34.573695, -58.487178];

 const handleMarkerClick = (position: [number, number], address: string) => {
  onAddressSelect({ address, coordinates: position }); // Llama a la función pasada como prop
 };

  return (
    <div
      className={`rounded-[30px] overflow-hidden ${widthClass} ${heightClass} z-10`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={zoomControl}
        className="h-full rounded-[30px] overflow-hidden"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
         {coordinates && coordinates.length === 2 && ( // Verificar si hay coordenadas válidas
          <Marker position={coordinates}>
            <Popup>
              Coordenadas: {coordinates[0]}, {coordinates[1]}
            </Popup>
          </Marker>
        )}
        <LocationMarker onClick={handleMarkerClick} /> {/* Manejo de clic en el mapa */}
        {showSearchControl && <AddSearchControl />} {/* Agregar el control de búsqueda */}
      </MapContainer>
    </div>
  );
};

export default Map;
