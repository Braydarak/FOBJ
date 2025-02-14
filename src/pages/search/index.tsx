import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Layout from "../../components/layout";
import Button from "../../components/customButton";
import LineComponent from "../../components/lineComponent";
import Dropdown from "../../components/dropdown";
import { useNavigate, useLocation } from "react-router-dom";
import { Option } from "../../components/dropdown/types";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollectionData } from "../../reducers/actions/objectActions";
import { RootState, AppDispatch } from "../../reducers/store";
import ObjectCard from "../../components/objectCard";
import CustomInput from "../../components/customInput";
import ErrorComponent from "../../components/error";
import Loader from "../../components/loader";
import ArrowIcon from "../../icons/arrowIcon/arrowIcon";
import { getObjectCardTitles } from "../../utils/objectCardTitles";

const Search: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const location = useLocation();

  const dispatch: AppDispatch = useDispatch();
  const collectionData = useSelector(
    (state: RootState) => state.objects.collectionData
  );

  const error = useSelector((state: RootState) => state.objects.error);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const collectionFromUrl = queryParams.get("collection");
    if (collectionFromUrl) {
      setSelectedOption(collectionFromUrl);
    }
  }, [location]);

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
      setIsLoading(true);
      setErrorMessage(null);
      try {
        await dispatch(fetchCollectionData(selectedOption, inputValue));

        setVisibleCount(20);
      } catch (error) {
        setErrorMessage(
          "No se pudo completar la búsqueda. Inténtelo de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Por favor, seleccione una opción.");
    }
  };

  const handleCardClick = (item: any) => {
    if (item.coordinates && item.coordinates.length === 2) {
      const [latitude, longitude] = item.coordinates;

      if (latitude !== undefined && longitude !== undefined) {
        navigate(`/cardDetailsView/${item.id}`, {
          state: { cardId: item.id, collectionName: selectedOption },
        });
      } else {
        console.warn("Coordenadas no disponibles para el item:", item);
      }
    } else {
      console.warn(
        "Coordenadas no disponibles o incorrectas para el item:",
        item
      );
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
      case "Clothing":
        return "Ingrese la marca de la prenda";
      case "Phone":
        return "Ingrese la marca del telefono";
      case "Other":
        return "Ingrese el nombre del objeto";
      default:
        return "";
    }
  };

  // Función auxiliar para recortat el texto
  const truncateString = (text: string | undefined): string => {
    if (!text) return "";
    return text.length > 15 ? text.substring(0, 15) + ".." : text;
  };

  const hasResults = collectionData[selectedOption]?.length > 0;
  const cardTitles = getObjectCardTitles(selectedOption);

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

          <div className="mt-28 mb-20 w-4/5 mx-auto flex flex-col justify-center items-center">
            {isLoading ? (
              <Loader />
            ) : errorMessage || error ? (
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
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[10rem] gap-y-[5rem] justify-items-center">
                {collectionData[selectedOption]
                  ?.slice(0, visibleCount)
                  .map((item: any, index: number) => (
                    <ObjectCard
                      key={index}
                      objectTop={cardTitles.top}
                      dataTop={truncateString(
                        item.documentNumber ||
                        item.amount ||
                        item.model ||
                        item.brand ||
                        item.title
                  )}
                      objectMiddle={cardTitles.middle}
                      dataMiddle={truncateString(
                        item.name ||
                        item.location ||
                        item.description ||
                        item.color
                  )}
                      objectBottom={cardTitles.bottom}
                      dataBottom={item.date}
                      address={item.map}
                      coordinates={
                        item.coordinates && item.coordinates.length === 2
                          ? [item.coordinates[0], item.coordinates[1]]
                          : [undefined, undefined]
                      }
                      onClick={() => handleCardClick(item)}
                    />
                  ))}
              </div>
            )}
          </div>
          <div className="flex justify-center mb-28">
            {collectionData[selectedOption]?.length > visibleCount && (
              <button
                onClick={() => setVisibleCount(visibleCount + 10)}
                className="flex items-center text-primary hover:text-secondary focus:outline-none"
              >
                <ArrowIcon /> Cargar más
              </button>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Search;
