import React from "react";
import Header from "../../components/header";
import Layout from "../../components/layout";
import CustomSelectOption from "../../components/customSelectOption/Index";
import Button from "../../components/customButton";
import LineComponent from "../../components/lineComponent";

const DefaultBrowser: React.FC = () => {
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const [selectedOption, setSelectedOption] = React.useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Header />
      <Layout>
        <div className="flex flex-col items-center w-full">
          <p className="font-semibold text-lg mt-12 md:text-4xl md:text-left md:mb-4 w-full">
            Seleccioná el tipo de objeto
          </p>
          <div className="md:w-2/5 md:p-10 w-full mt-3">
            <CustomSelectOption
              value={selectedOption}
              onChange={handleSelectChange}
              options={options}
              placeholder={"Tipo de objeto"}
              textColor={`text-customColor`}
            />
          </div>
          <div className="md:w-80 w-full mt-10">
            <Button
              text={"Buscar"}
              textColor={"text-backgroundcolor"}
              bgColor={"bg-disableInput"}
              roundedSize={"rounded-[30px]"}
              disabled={false}
            />
          </div>
          <div className="mt-28 w-4/5 mx-auto flex flex-col justify-center items-center">
            <div className="mb-14 w-full">
              <LineComponent />
            </div>
            <p className="text-center text-xl text-inputs">
              Completá los datos
            </p>
            <div className="mt-14 w-full">
              <LineComponent />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DefaultBrowser;
