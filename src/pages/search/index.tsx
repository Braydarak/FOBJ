import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Layout from "../../components/layout";
import Button from "../../components/customButton";
import LineComponent from "../../components/lineComponent";
import Dropdown from "../../components/dropdown";
import { Option } from "../../components/dropdown/types";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollectionData } from "../../reducers/actions/objectActions";
import { RootState, AppDispatch } from "../../reducers/store";
import ObjectCard from "../../components/objectCard";
import CustomInput from "../../components/customInput";
import ErrorComponent from "../../components/error";

const Search: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const collectionData = useSelector(
    (state: RootState) => state.objects.collectionData
  );
  
  const error = useSelector((state: RootState) => state.objects.error);



  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
    setInputValue("");
    setErrorMessage(null);
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setErrorMessage(null);
  };


  const handleSearchClick = async () => {
    setErrorMessage(null);
    if (selectedOption) {
      setErrorMessage(null);
      try {
        await dispatch(fetchCollectionData(selectedOption, inputValue));
      } catch (error) {
        setErrorMessage(
          "No se pudo completar la búsqueda. Inténtelo de nuevo."
        );
      }
    } else {
      setErrorMessage("Por favor, seleccione una opción.");
    }
  };


  const dropdownOptions = {
    placeholder: "Seleccione una opción",
    items: [
      { value: "Cash", label: "dinero" },
      { value: "Clothing", label: "indumentaria" },
      { value: "Dni", label: "DNI" },
      { value: "Phone", label: "telefono" },
      { value: "Other", label: "Otros" },
    ] as Option[],
  };
  const getPlaceholderText = () => {
    switch (selectedOption) {
      case "Cash":
        return "ingrese el monto que busca";
      case "Dni":
        return "ingrese su numero de documento";
      default:
        return "";
    }
  };
  const hasResults = collectionData[selectedOption]?.length > 0;

  // Define los títulos para cada tipo de objeto
  const getObjectCardTitles = () => {
    switch (selectedOption) {
      case "Cash":
        return {
          top: "Cantidad",
          middle: "Localidad",
          bottom: "Fecha",
        };
      case "Clothing":
        return {
          top: "Marca",
          middle: "Descripción",
          bottom: "Fecha",
        };
      case "Dni":
        return {
          top: "Dni",
          middle: "Nombre",
          bottom: "Fecha",
        };
      case "Phone":
        return {
          top: "Marca",
          middle: "Color",
          bottom: "Fecha",
        };
      case "Other":
        return {
          top: "Descripción",
          middle: "Fecha",
          bottom: "",
        };
      default:
        return {
          top: "",
          middle: "",
          bottom: "",
        };
    }
  };

  return (
    <>
      <Header />
      <Layout>
        <div className="flex flex-col items-center w-full">
          <p className="font-semibold text-lg mt-12 md:text-[40px] md:text-left md:mb-4 w-full uppercase">
            Busca tu objeto
          </p>
          <div className="md:w-2/5 md:mt-10 md:mb-5 w-full mt-3">
            <Dropdown
              options={dropdownOptions}
              value={selectedOption}
              onChange={handleDropdownChange}
            />
            <CustomInput
              value={inputValue}
              placeholder={getPlaceholderText()}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:w-80 w-full mt-10">
            <Button
              text="Buscar"
              textColor="text-backgroundcolor"
              bgColor={selectedOption ? "bg-secondary" : "bg-disabled"}
              roundedSize="rounded-[30px]"
              disabled={!selectedOption}
              textSize="text-[25px]"
              textTransform="uppercase"
              onClick={handleSearchClick}
            />
          </div>

          <div className="mt-28 mb-28 w-4/5 mx-auto flex flex-col justify-center items-center">
            {errorMessage || error ? (
              <>
                <div className="mb-14 w-full">
                  <LineComponent color="bg-inputs" border="border-inputs" />
                </div>
                <ErrorComponent message={errorMessage || error} />
                <div className="mt-14 w-full">
                  <LineComponent color="bg-inputs" border="border-inputs" />
                </div>
              </>
            ) : !hasResults ? (
              <>
                <div className="mb-14 w-full">
                  <LineComponent color="bg-inputs" border="border-inputs" />
                </div>
                <div className="text-center mt-4 mb-8">
                  <p className="text-xl text-inputs">Completá los datos</p>
                </div>
                <div className="mt-14 w-full">
                  <LineComponent color="bg-inputs" border="border-inputs" />
                </div>
              </>
            ) : (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14"> 
                {collectionData[selectedOption]?.map(
                  (item: any, index: number) => (
                    <ObjectCard
                      key={index}
                      objectTop={getObjectCardTitles().top}
                      dataTop={
                        item.documentNumber ||
                        item.amount ||
                        item.model ||
                        item.brand
                      }
                      objectMiddle={getObjectCardTitles().middle}
                      dataMiddle={
                        item.name ||
                        item.location ||
                        item.description ||
                        item.color
                      }
                      objectBottom={getObjectCardTitles().bottom}
                      dataBottom={item.date}
                      address={item.map}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Search;
