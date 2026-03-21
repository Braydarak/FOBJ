import React from "react";
import CustomInput from "../customInput";
import Button from "../customButton";
import { DynamicFormProps } from "./types";
import Map from "../map";
import AddressAutocomplete from "../addressAutocomplete";

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  inputs,
  onInputChange,
  onSubmit,
  mapAddressHandler,
  coordinates,
  ReadOnly,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full gap-5 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 w-full relative">
        {fields.map((field) => (
          <div
            key={field.key}
            className={`w-full ${field.key === "map" || field.key === "description" || field.key === "information" ? "md:col-span-2" : ""}`}
          >
            {field.key !== "map" && (
              <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                {field.label}
              </label>
            )}
            {field.key === "map" && (
              <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1 mt-2">
                Ubicación en el Mapa
              </label>
            )}

            {field.key === "map" ? (
              <AddressAutocomplete
                value={inputs[field.key] || ""}
                onChange={(val) => onInputChange(field.key, val)}
                onSelect={(address, coords) =>
                  mapAddressHandler({ address, coordinates: coords })
                }
                placeholder="Busca o selecciona una dirección en el mapa..."
                readOnly={ReadOnly}
              />) : field.type === "file" ? ( 
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onInputChange(field.key, e.target.files[0]);
                  }
                }}
                className="w-full px-3 py-2 text-sm text-gray-500 bg-white border border-gray-400 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 file:hidden"
                disabled={ReadOnly}
              />
            ) : (
              <CustomInput
                label=""
                type={
                  field.type === "date"
                    ? "date"
                    : field.type === "number"
                      ? "number"
                      : "text"
                }
                value={inputs[field.key] || ""}
                onChange={(e) => onInputChange(field.key, e.target.value)}
                placeholder={
                  field.placeholder
                    ? field.placeholder
                    : `Ingresa ${field.label.toLowerCase()}`
                }
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full mt-1 mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0 relative">
        <Map
          widthClass="w-full"
          heightClass="h-[250px] md:h-[300px]"
          onAddressSelect={mapAddressHandler}
          coordinates={coordinates || undefined}
        />
      </div>

      <div className="w-full flex justify-center mt-6">
        <div className="w-full md:w-2/3">
          <Button
            text="Guardar Reporte"
            textColor="text-white"
            bgColor="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            roundedSize="rounded-xl"
            disabled={false}
            textSize="text-lg"
            textTransform="uppercase"
            font="font-bold tracking-wide"
          />
        </div>
      </div>
    </form>
  );
};

export default DynamicForm;
