import React from "react";
import { CustomSelectOptionProps } from './types';

const CustomSelectOption: React.FC<CustomSelectOptionProps> = ({
  label,
  underlabel,
  error,
  options,
  value,
  onChange,
  borderColor = "border-inputs",
  placeholder = "Select an option",
  textColor = "text-inputText",
}) => {
  return (
    <div className="mb-4 w-full">
      <label className={`block text-base ml-1 font-lato md:text-[20px]`}>
        {label}
      </label>
      <select
        className={`mt-1 p-2 border-2 ${borderColor} ${textColor} text-base md:text-[20px] ${textColor} font-lato rounded-md w-full focus:outline-none`}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && (
        <label className="block text-sm text-error ml-1 font-lato md:text-[14px] mt-1">
          {error}
        </label>
      )}
      {underlabel && (
        <div className="w-full flex justify-end">
          <label className="text-end text-sm hover:underline mt-1 text-primary font-lato md:text-[14px] cursor-pointer">
            {underlabel}
          </label>
        </div>
      )}
    </div>
  );
};

export default CustomSelectOption;
