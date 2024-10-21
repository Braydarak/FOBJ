declare module 'leaflet-geosearch' {
   
    
    export class OpenStreetMapProvider {
      search(options: { query: string }): Promise<any>;
    }
  
    export class GeoSearchControl {
      constructor(options: {
        provider: OpenStreetMapProvider;
        style?: string;
        showMarker?: boolean;
        retainZoomLevel?: boolean;
        animateZoom?: boolean;
        autoClose?: boolean;
        searchLabel?: string;
        keepResult?: boolean;
      });
    }
  }
  export {};


export interface MapProps {
  widthClass?: string;
  heightClass?: string;
  onAddressSelect: (data: { address: string; coordinates: [number, number] }) => void;
  showSearchControl?: boolean;
  zoomControl?:boolean;
  coordinates?: [number, number];
}

export interface LocationMarkerProps {
  onClick: (position: [number, number], address: string) => void;
}