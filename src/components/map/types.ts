export interface MapProps {
  widthClass?: string;
  heightClass?: string;
  onAddressSelect: (data: { address: string; coordinates: [number, number] }) => void;
  showSearchControl?: boolean;
  zoom?: number;
  zoomControl?:boolean;
  coordinates?: [number, number];
  disableDragging?: boolean;        
  disableZoom?: boolean;            
  disableScrollWheelZoom?: boolean; 
  disableDoubleClickZoom?: boolean; 
  disableBoxZoom?: boolean; 
}

export interface LocationMarkerProps {
  onClick: (position: [number, number], address: string) => void;
}