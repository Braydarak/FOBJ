import React, { useState } from "react";
import Header from "../../components/header";
import Layout from "../../components/layout";
import Button from "../../components/customButton";
import LineComponent from "../../components/lineComponent";
import Dropdown from "../../components/dropdown";
import { Option } from "../../components/dropdown/types";

const Search: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
  };

  const dropdownOptions = {
    placeholder: "Seleccione una opción",
    items: [
      { value: "option1", label: "DNI" },
      { value: "option2", label: "Ropa" },
      { value: "option3", label: "Telefono" },
    ] as Option[],
  };
  return (
    <>
      <Header />
      <Layout>
        <div className="flex flex-col items-center w-full">
          <p className="font-semibold text-lg mt-12 md:text-[40px] md:text-left md:mb-4 w-full uppercase">
            Seleccioná el tipo de objeto
          </p>
          <div className="md:w-2/5 md:mt-10 md:mb-5 w-full mt-3">
            <Dropdown
              options={dropdownOptions}
              value={selectedOption}
              onChange={handleDropdownChange}
            />
          </div>
          <div className="md:w-80 w-full mt-10">
            <Button
              text="Buscar"
              textColor="text-backgroundcolor"
              bgColor="bg-secondary"
              roundedSize="rounded-[30px]"
              disabled={true}
              textSize="text-[25px]"
              textTransform="uppercase"
            />
          </div>
          <div className="mt-28 w-4/5 mx-auto flex flex-col justify-center items-center">
            <div className="mb-14 w-full">
              <LineComponent color="bg-inputs" border="border-inputs" />
            </div>
            <p className="text-center text-xl text-inputs">
              Completá los datos
            </p>
            <div className="mt-14 w-full">
              <LineComponent color="bg-inputs" border="border-inputs" />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Search;
