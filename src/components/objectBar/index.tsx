import React from "react";
import { ObjectBarProps } from "./types";
import Map from "../map";

const ObjectBar: React.FC<ObjectBarProps> = ({
  objectTop,
  address,
  onClick,
  coordinates,
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
    <div className="group w-full mb-4 bg-cardBG border border-gray-100 card-shadow rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <div className="w-full flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 md:p-5">
        <div className="w-full md:w-28 flex items-center justify-between md:flex-col md:items-start md:justify-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Objeto reportado {objectTop}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-wide text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
              />
            </svg>
            Encontrado en
          </div>
          <div className="mt-1 flex items-start justify-between gap-3">
            <span className="block text-base md:text-lg font-semibold text-inputText truncate">
              {formattedAddress}
            </span>
          </div>
        </div>

        <div className="w-full md:w-[280px]">
          <Map
            heightClass="h-[120px] md:h-[80px]"
            onAddressSelect={() => undefined}
            showSearchControl={false}
            zoomControl={false}
            disableDragging={true}
            disableZoom={true}
            disableScrollWheelZoom={true}
            disableDoubleClickZoom={true}
            disableBoxZoom={true}
            coordinates={coordinates}
          />
        </div>

        <div className="w-full md:w-auto flex-shrink-0">
          <button
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 uppercase px-6 py-2 text-sm md:text-base rounded-full bg-secondary text-backgroundcolor transition-colors hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            onClick={onClick}
          >
            Ver más
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjectBar;
