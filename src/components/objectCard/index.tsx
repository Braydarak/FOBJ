import React from "react";
import { ObjectCardProps } from "./types";
import Map from "../map";

const ObjectCard: React.FC<ObjectCardProps> = ({
  objectTop,
  objectMiddle,
  objectBottom,
  dataTop,
  dataMiddle,
  dataBottom,
  address,
  onClick,
  coordinates,
  category,
}) => {
  const capitalizeAddress = (address: string) => {
    const words = address.toLowerCase().split(" ");

    const capitalizedWords = words.map((word, index) => {
      if (word === "av.") {
        return "Av.";
      } else if (index > 0 && words[index - 1] === "av.") {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else if (word === "y" && index > 0 && index < words.length - 1) {
        return "y";
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    });

    return capitalizedWords.join(" ");
  };

  const formattedAddress = capitalizeAddress(address);

  return (
    <div className="group w-full max-w-[400px] bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative">
      {/* Map Header Background */}
      <div className="w-full h-52 relative bg-gray-100 border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
          <Map
            widthClass="w-full"
            heightClass="h-full"
            onAddressSelect={() => {}}
            showSearchControl={false}
            zoomControl={false}
            coordinates={coordinates}
            disableDragging={true}
            disableZoom={true}
            disableScrollWheelZoom={true}
            disableDoubleClickZoom={true}
            disableBoxZoom={true}
          />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            {category}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-grow bg-white">
        {/* Main Info Section */}
        <div className="px-6 py-5 border-b border-gray-100 border-dashed">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {objectTop || "Identificador"}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {dataBottom || "N/A"}
            </span>
          </div>
          <h3 className="text-2xl font-black text-gray-800 leading-none tracking-tight">
            {dataTop || "Sin nombre"}
          </h3>
        </div>

        {/* Description Section */}
        <div className="px-6 py-5 border-b border-gray-100 border-dashed bg-gray-50/50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Descripción
          </span>
          <p className="text-sm text-gray-600 font-medium leading-relaxed line-clamp-3">
            {dataMiddle || "Sin descripción disponible para este objeto."}
          </p>
        </div>

        {/* Location Section */}
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-full flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Ubicación aproximada
            </span>
            <span className="text-xs font-bold text-gray-700 line-clamp-1">
              {formattedAddress}
            </span>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="p-4 mt-auto bg-white">
          <button
            onClick={onClick}
            className="w-full py-3.5 px-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg shadow-gray-200"
          >
            <span className="text-sm tracking-widest uppercase">
              Ver Detalles
            </span>
            <svg
              className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjectCard;
