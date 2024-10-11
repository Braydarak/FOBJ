import React, { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

const LocationMarker: React.FC<{
  onClick: (position: [number, number], address: string) => void;
}> = ({ onClick }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const clickedPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(clickedPosition);
      fetchAddress(clickedPosition);
    },
  });
  const fetchAddress = async (latlng: [number, number]) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latlng[0]}&lon=${latlng[1]}&format=json`
    );
    const data = await response.json();

    if (data && data.address) {
      // Extraer solo el número de la calle y el nombre de la calle
      const street = data.address.road || ""; // Nombre de la calle
      const houseNumber = data.address.house_number || ""; // Número de la casa
      const locality = data.address.city || data.address.town || data.address.village || ""; // Localidad

      // Formatear la dirección
      const formattedAddress = houseNumber ? `${houseNumber} ${street}, ${locality}` : `${street}, ${locality}`;

      // Llama a la función pasada como prop con la dirección formateada
      onClick(latlng, formattedAddress);
    }
  };

  return position ? (
    <Marker position={position}>
      <Popup>
        Marcador en {position[0].toFixed(4)}, {position[1].toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
};

export default LocationMarker;
