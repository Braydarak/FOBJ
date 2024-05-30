import React from "react";
import CustomInput from "../customInput";
import Button from "../customButton";
import { DynamicFormProps } from "./types";

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  inputs,
  onInputChange,
  onSubmit,
  onPreview,
}) => {
  return (
    <form onSubmit={onSubmit} className="md:flex md:flex-col md:items-center">
      {fields.map((field) => (
        <CustomInput
          key={field.key}
          label={`${field.label}:`}
          type={field.type === "date" ? "date" : (field.type === "number" ? "number" : "text")}
          value={inputs[field.key]}
          onChange={(e) => onInputChange(field.key, e.target.value)}
        />
      ))}

      <div className="md:w-80  w-full mt-10">
        <Button
          text="Agregar"
          onClick={onPreview}
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
