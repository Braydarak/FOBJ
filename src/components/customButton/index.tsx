import React from "react";
import { ButtonProps } from "./types";
import Loader from "../loader";

const capitalizeWords = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  textColor = "text-white",
  bgColor = "bg-secondary",
  disabled = false,
  loading = false,
  roundedSize = "rounded-[8px]",
}) => {
  const buttonText = loading ? (
    <Loader width="w-[30px]" height="h-[30px]" logoSize="20" />
  ) : (
    capitalizeWords(text as string)
  );

  return (
    <button
      className={`font-semibold ${roundedSize} w-full h-[44px] text-[16px] ${bgColor} ${textColor}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {buttonText}
    </button>
  );
};

export default Button;
