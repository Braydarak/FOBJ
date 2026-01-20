import React from "react";
import { DeleteIconProps } from "./types";


const DeleteIcon: React.FC<DeleteIconProps> = ({ 
  color = "#000000", 
  className = "", 
  onClick,
  width = 25,
  height = 25
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e); // Pasa el evento al manejador
  };

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <path 
        d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" 
        transform="translate(-123 -200)"
      />
    </svg>
  );
};

export default DeleteIcon;