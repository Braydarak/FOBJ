import React from "react";
import { PreviewProps, Field } from "./types";
import Button from "../customButton";

const Preview: React.FC<PreviewProps> = ({
  fields,
  inputs,
  onEdit,
  onSave,
}) => {
  return (
    <div>
      <div className="w-full md:grid md:grid-cols-2">
        <div className="grid grid-cols-4 w-full space-y-3 md:col-span-2 md:grid-cols-4 md:space-y-0 md:gap-4">
          {fields.map((field: Field) => (
            <React.Fragment key={field.key}>
              <p className="bg-blue-500 text-left text-xl font-medium col-span-2 md:col-span-2 uppercase">
                {field.label}:
              </p>
              <p className="bg-blue-500 text-end text-lg font-normal col-span-2 md:col-span-2">
                {inputs[field.key]}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-full mt-10 space-y-5 md:flex md:justify-center md:space-y-0 md:space-x-5">
        <Button
          text="Editar"
          onClick={onEdit}
          textColor="text-backgroundcolor"
          bgColor="bg-disableInput"
          roundedSize="rounded-[30px]"
          textSize="text-[25px]"
          textTransform="uppercase"
          disabled={false}
        />
        <Button
          text="Reportar"
          onClick={onSave}
          textColor="text-backgroundcolor"
          bgColor="bg-secondary"
          roundedSize="rounded-[30px]"
          textSize="text-[25px]"
          textTransform="uppercase"
          disabled={false}
        />
      </div>
    </div>
  );
};

export default Preview;
