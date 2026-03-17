import React from "react";
import { CardProps } from "./types";

const Card: React.FC<CardProps> = ({ title, obj, amount, onClick }) => {
  return (
    <div
      className="group relative w-[150px] h-[140px] md:w-[250px] md:h-[200px] bg-white border border-gray-100 shadow-sm rounded-[24px] flex justify-center items-center cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-secondary"
      onClick={onClick}
    >
      {/* Estado Normal (Frente) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 transition-all duration-500 ease-in-out transform group-hover:-translate-y-full opacity-100 group-hover:opacity-0 bg-gradient-to-b from-cardBG to-white">
        <span className="text-xl md:text-3xl font-bold text-primary tracking-wide uppercase">
          {title}
        </span>
        <div className="mt-2 w-8 h-1 bg-secondary rounded-full"></div>
      </div>

      {/* Estado Hover (Reverso) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 transition-all duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary to-[#003380] text-[#FFFFFF]">
        <h2 className="text-[10px] md:text-sm font-medium mb-1 uppercase tracking-wider text-[#FFFFFF]">
          Cantidad de {obj}
        </h2>
        <p className="text-4xl md:text-6xl font-bold text-[#FFFFFF] drop-shadow-md">
          {amount}
        </p>
        <div className="mt-3 flex items-center gap-1 opacity-90 text-[9px] md:text-xs font-medium text-[#FFFFFF]">
          <span>Ver detalles</span>
          <svg
            className="w-3 h-3 md:w-4 md:h-4 text-[#FFFFFF]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Card;


