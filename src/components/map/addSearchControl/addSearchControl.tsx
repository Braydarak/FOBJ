import React, { useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from "react-leaflet";

const AddSearchControl: React.FC = () => {
    const map = useMap(); // Obtener la instancia del mapa
  
    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: true,
        retainZoomLevel: false,
      });
  
      map.addControl(searchControl as any);
  
      return () => {
        map.removeControl(searchControl as any); // Limpiar el control al desmontar
      };
    }, [map]);
  
    return null; // No renderiza nada
  };

  export default AddSearchControl;