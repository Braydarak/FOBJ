import React, { useState, useEffect } from "react";
import LocationMarker from "./locationMaker/locationMaker";
import AddSearchControl from './addSearchControl/addSearchControl';
import {
  MapContainer,
  TileLayer,
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



const Map: React.FC<MapProps> = ({ widthClass = "w-full", heightClass = "h-96", onAddressSelect }) => {
  const [center, setCenter] = useState<[number, number]>([-34.573695, -58.487178]);


  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]); // Actualiza el centro a la ubicación del usuario
        },
        () => {
          console.error(
            "No se pudo obtener la ubicación actual. Centrado en Buenos Aires."
          );
        }
      );
    } else {
      console.error("Geolocalización no soportada. Centrado en Buenos Aires.");
    }
  }, []);

  const handleMarkerClick = (position: [number, number], address: string) => {
    console.log("Clicked Position:", position, "Address:", address);
    onAddressSelect(address); // Llama a la función pasada como prop
  };


  return (
    <div
      className={`rounded-[30px] overflow-hidden ${widthClass} ${heightClass}`}
    >
      <MapContainer
        center={center}
        zoom={16}
        className="h-96 w-full rounded-[30px] overflow-hidden"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onClick={handleMarkerClick} /> {/* Manejo de clic en el mapa */}
        <AddSearchControl /> {/* Agregar el control de búsqueda */}
      </MapContainer>
    </div>
  );
};

export default Map;
