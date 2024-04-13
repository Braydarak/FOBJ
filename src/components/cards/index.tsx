import React from "react";
import { CardProps } from "./types";

const Card: React.FC<CardProps> = ({ title, obj, amount, onClick }) => {
  return (
    <div className="relative w-[150px] h-[140px] bg-cardBG card-shadow md:w-[250px] md:h-[200px] flex justify-center items-center md:text-[40px] font-medium cursor-pointer overflow-hidden"  onClick={onClick}>
      <div className="w-full h-full flex justify-center items-center opacity-100 transition-opacity duration-300 hover:opacity-0">
        <span className="pointer-events text-whiteBG text-3xl">{title}</span>
      </div>
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-evenly items-center opacity-0 transition-opacity duration-300 hover:opacity-100 bg-cardBG">
        <h2 className="text-xs font-bold mb-2 uppercase text-whiteBG md:text-xl">cantidad de {obj}</h2>
        <p className="text-4xl font-semibold md:text-[50px]">{amount}</p>
        <h2 className="text-[10px] font-bold text-inputs md:text-base">Presione para verlos</h2>
      </div>
    </div>
  );
};

export default Card;
