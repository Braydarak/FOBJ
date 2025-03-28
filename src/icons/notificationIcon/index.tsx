import React from "react";
import { NotificationIconProps } from "./types";

const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  color, 
  className, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 448 512"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <path d="M224 512a64 64 0 0 0 57.3-35.6c5.6-11.2-2.6-24.4-15.3-24.4H182c-12.7 0-20.9 13.2-15.3 24.4A64 64 0 0 0 224 512Zm215.4-150.5c-19.4-20.1-55.4-52.9-55.4-154.5 0-78.8-54.5-139.3-127.9-155.3V32a32 32 0 1 0-64 0v19.7C118.5 67.7 64 128.2 64 207c0 101.6-36 134.4-55.4 154.5A31.9 31.9 0 0 0 32 384h384a31.9 31.9 0 0 0 23.4-22.5Z" />
    </svg>
  );
};

export default NotificationIcon;
