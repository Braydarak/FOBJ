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
    <div className="w-3/4 md:h-[100px] h-auto mb-5 bg-cardBG card-shadow rounded-[30px] flex flex-col md:flex-row items-center text-[18px] font-medium overflow-hidden p-2 gap-2 md:gap-6">
      {/* Información superior e inferior */}
      <div className="flex justify-between items-center flex-grow ">
        <div className="flex justify-center md:justify-start items-center w-16">
          <span className="uppercase font-medium">{objectTop}</span>
        </div>
      </div>

      {/* Dirección y mapa */}
      <div className="flex flex-col items-center text-center w-full">
        <div className="flex flex-col items-center ">
          <span className="uppercase ">Encontrado en</span>
          <span>{formattedAddress}</span>
        </div>
      </div>
      <div className="w-full">
        <Map
          heightClass="h-[80px]"
          onAddressSelect={(address) => console.log(address)}
          showSearchControl={false}
          zoomControl={false}
          coordinates={coordinates}
        />
      </div>
      {/* Botón de acción */}
      <div className="flex-shrink-0">
        <button
          className="uppercase px-8 py-2 text-[20px] rounded-[30px] bg-secondary text-backgroundcolor"
          onClick={onClick}
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default ObjectBar;
