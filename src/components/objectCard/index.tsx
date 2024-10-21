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
    <div className="w-[341px] min-h-[300px] bg-cardBG card-shadow rounded-[30px] flex justify-center flex-col items-center text-[18px] font-medium overflow-hidden">
      <div className="w-[80%] flex justify-evenly items-center -mb-2">
        <div className="w-full grid mb-2">
          <span className="uppercase">{objectTop}</span>
          <span className="uppercase">{objectMiddle}</span>
          <span className="uppercase">{objectBottom}</span>
        </div>
        <div className="w-full grid mb-2 text-end">
          <span className="">{dataTop}</span>
          <span className="">{dataMiddle}</span>
          <span className="">{dataBottom}</span>
        </div>
      </div>

      <div className="-mb-1">
        <div className="flex flex-col justify-center items-center">
          <span className="uppercase -mb-2">Encontrado en</span>
          <span className="text-center">{formattedAddress}</span>
          <Map
            widthClass="w-[250px]"
            heightClass="h-[100px]"
            onAddressSelect={(address) => console.log(address)}
            showSearchControl={false}
            zoomControl={false}
            coordinates={coordinates}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="uppercase w-[211px] h-[40px] text-[25px] rounded-[30px] bg-secondary text-backgroundcolor mt-3"
          onClick={onClick}
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default ObjectCard;
