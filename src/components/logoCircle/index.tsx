import React from "react";
import { LogoCircleProps } from "./types";

const LogoCircle: React.FC<LogoCircleProps> = ({
  logoComponent,
  borderColor,
  backgroundColor,
  onClick,
}) => {
  return (
    <div className="relative w-16 h-16">
      <button
        className="relative w-full h-full flex justify-center items-center"
        onClick={onClick}
      >
        <div className="w-14 h-14 bg-gray-200 rounded-full flex justify-center items-center z-10">
          {logoComponent}
        </div>
        <div
          className="absolute w-[43px] h-[43px] rounded-full border border-primary"
          style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
        ></div>
      </button>
    </div>
  );
};

export default LogoCircle;
