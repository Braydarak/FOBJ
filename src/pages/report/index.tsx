import React, { useState } from "react";
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
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleSubmission = () => {
    // Lógica para manejar la presentación después de enviar el formulario
    // Por ejemplo, mostrar un mensaje de éxito
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      <div className="flex flex-col items-center w-full mb-10">
        <h1 className="font-bold text-2xl md:text-4xl text-gray-800 mb-8 uppercase tracking-wide text-center">
          Reportar un Objeto
        </h1>

        <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
              ¿Qué tipo de objeto encontraste/perdiste?
            </label>
            <Dropdown
              options={dropdownOptions}
              value={selectedOption}
              onChange={handleDropdownChange}
            />
          </div>

          {selectedOption ? (
            <div className="w-full animate-fade-in-up">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
              <ReportInput
                onSubmission={handleSubmission}
                selectedOption={selectedOption}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-8 text-gray-400">
              <svg
                className="w-16 h-16 mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-center font-medium">
                Selecciona una categoría para continuar con el reporte.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
