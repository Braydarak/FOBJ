import React from "react";
import CustomInput from "../customInput";
import Button from "../customButton";
import { DynamicFormProps } from "./types";
import Map from "../map";

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  inputs,
  onInputChange,
  onSubmit,
  mapAddressHandler,
}) => {
  return (
    <form onSubmit={onSubmit} className="md:flex md:flex-col md:items-center">
      {fields.map((field) => (
        <CustomInput
          key={field.key}
          label={`${field.label}:`}
          type={
            field.type === "date"
              ? "date"
              : field.type === "number"
              ? "number"
              : "text"
          }
          value={inputs[field.key] || ""}
          onChange={(e) => onInputChange(field.key, e.target.value)}
        />
      ))}
      <div className="flex justify-center w-full mt-4">
        <Map
          widthClass="w-[300px] md:w-[700px]"
          heightClass="h-[200px]"
          onAddressSelect={mapAddressHandler}
        />
      </div>

      <div className="md:w-80  w-full mt-10">
        <Button
          text="Guardar"
          textColor="text-backgroundcolor"
          bgColor="bg-secondary"
          roundedSize="rounded-[30px]"
          disabled={false}
          textSize="text-[25px]"
          textTransform="uppercase"
        />
      </div>
    </form>
  );
};

export default DynamicForm;
