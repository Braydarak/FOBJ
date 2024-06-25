import React from "react";
import { CustomInputProps } from "./types";

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  underlabel,
  error,
  placeholder,
  value,
  onChange,
  borderColor = "border-inputBorder",
  type = "text",
  name,
  onUnderlabelClick,
}) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-base text-inputText ml-1 font-lato md:text-[20px]">
        {label}
      </label>
      <input
        className={`mt-1 p-2 border ${borderColor} text-base md:text-[20px] text-inputText font-lato rounded-md w-full focus:outline-none`}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      <label className="block text-sm text-error ml-1 font-lato md:text-[14px] mt-1">
        {error}
      </label>
      <div className="w-full flex justify-end">
        <label
          className="text-end text-sm hover:underline mt-1 text-primary font-lato md:text-[14px] cursor-pointer"
          onClick={onUnderlabelClick}
        >
          {underlabel}
        </label>
      </div>
    </div>
  );
};

export default CustomInput;
