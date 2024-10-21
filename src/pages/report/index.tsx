import React, { useState } from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import Dropdown from "../../components/dropdown";
import { Option } from "../../components/dropdown/types";
import ReportInput from "./ItemInput";

const ReportPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");


  const dropdownOptions = {
    placeholder: "TIPO DE OBJETO",
    items: [
      { value: "Dni", label: "Dni" },
      { value: "Phone", label: "Telefono" },
      { value: "Clothing", label: "Prenda de vestir" },
      { value: "Cash", label: "Dinero" },
      { value: "Other", label: "Otros" },
    ] as Option[],
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleSubmission = () => {
    // Lógica para manejar la presentación después de enviar el formulario
    // Por ejemplo, mostrar un mensaje de éxito
  };

  return (
    <div className="overflow-x-hidden w-full flex flex-col h-full justify-between items-stretch">
      <Header />
      <Layout>
        <div className="text-2xl w-full font-semibold my-8 uppercase">
          Reportar el objeto
        </div>
        <div className="w-full md:w-1/2 mb-40 md:mb-0">
          <Dropdown
            options={dropdownOptions}
            value={selectedOption}
            onChange={handleDropdownChange}
          />
          {selectedOption && (
            <ReportInput
              onSubmission={handleSubmission}
              selectedOption={selectedOption}
            />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default ReportPage;
