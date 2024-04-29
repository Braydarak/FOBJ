import React, { useState } from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import Dropdown from "../../components/dropdown";
import { Option } from "../../components/dropdown/types";
import Button from "../../components/customButton";

const ConfigPage: React.FC = () => {
  const dropdownOptions = {
    placeholder: "TELEFONO",
    items: [
      { value: "option1", label: "Usuario" },
      { value: "option2", label: "Telefono" },
    ] as Option[],
  };

  // Estado para almacenar la opción seleccionada en el dropdown
  const [selectedOption, setSelectedOption] = useState("");

  // Función para manejar el cambio en el dropdown
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="overflow-x-hidden w-full flex flex-col h-full justify-between items-stretch">
      <Header />
      <Layout>
        <h3 className="text-2xl w-full font-semibold my-8 uppercase">
          configuración
        </h3>
        <div className="w-full md:grid md:grid-cols-2">
          <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full space-y-2 md:w-full">
            {/* row 1 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              usuario
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              JonyEze
            </div>

            {/* row 2 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              nombre
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              Jonathan Ezequiel
            </div>

            {/* row 3 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              apellido
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              Darakdjian
            </div>

            {/* row 4 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-1 uppercase">
              email
            </div>
            <div className="bg-blue-500 text-right text-xl font-medium col-span-3">
              jonydarakdjian@gmail.com
            </div>

            {/* row 5 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              telefono
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              11 6941-3912
            </div>
          </div>
          <div className="md:w-1/2  md:justify-center  md:items-center md:text-center md:mx-auto">
            <div className="font-semibold text-2xl w-full text-center mt-8 md:mt-0 uppercase">
              preferencia de contacto
            </div>
            <div className="w-full mt-5 md:mt-10">
              <Dropdown
                options={dropdownOptions}
                value={selectedOption}
                onChange={handleDropdownChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-10">
              <div className="flex justify-center items-center">
                <Button
                  text="Cargar Imagen"
                  textColor={"text-inputBorder"}
                  withBorder={true}
                  borderColor="border-inputBorder"
                  font="font-normal"
                  bgColor="bg-gray-600"
                  disabled={false}
                />
              </div>
              <div className="mx-auto w-20 h-20 bg-white border-4 border-black rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="md:w-80 w-full mt-10 md:mt-14">
          <Button
            text="Guardar"
            textTransform="uppercase"
            textSize="text-[25px]"
            textColor="text-backgroundcolor"
            bgColor="bg-secondary"
            roundedSize="rounded-[30px]"
            disabled={false}
          />
        </div>
      </Layout>
    </div>
  );
};

export default ConfigPage;
