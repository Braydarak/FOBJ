import React, { useState, useEffect } from "react";
import Button from "../../components/customButton";
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
import LineComponent from "../../components/lineComponent";

const Search: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const translations: Record<string, string> = {
    Cash: "Dinero",
    Clothing: "Ropa",
    Phone: "Teléfono",
    Dni: "Dni",
    Other: "Otros",
  };
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const location = useLocation();

  const dispatch: AppDispatch = useDispatch();
  const collectionData = useSelector(
    (state: RootState) => state.objects.collectionData,
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
    event: React.ChangeEvent<HTMLSelectElement>,
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
          "No se pudo completar la búsqueda. Inténtelo de nuevo.",
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
        item,
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
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-center w-full mb-10">
        <h1 className="font-bold text-2xl md:text-4xl text-gray-800 mb-8 uppercase tracking-wide text-center">
          Encuentra tu objeto perdido
        </h1>

        {/* Search Controls */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5">
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
              Categoría
            </label>
            <Dropdown
              options={dropdownOptions}
              value={selectedOption}
              onChange={handleDropdownChange}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
              Detalles de búsqueda
            </label>
            <CustomInput
              value={inputValue}
              placeholder={getPlaceholderText()}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full mt-4 flex justify-center">
            <div className="w-full md:w-2/3">
              <Button
                text="Buscar Objetos"
                textColor="text-white"
                bgColor={
                  selectedOption
                    ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    : "bg-gray-300"
                }
                roundedSize="rounded-xl"
                disabled={!selectedOption}
                textSize="text-lg"
                textTransform="uppercase"
                font="font-bold tracking-wide"
                onClick={handleSearchClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="w-full flex justify-center mb-10">
        <LineComponent color="bg-black" />
      </div>

      {/* Results Section */}
      <div className="w-full flex flex-col items-center justify-center flex-grow pb-24">
        {isLoading ? (
          <div className="my-20">
            <Loader />
          </div>
        ) : errorMessage || error ? (
          <div className="w-full max-w-2xl text-center p-8 bg-red-50 rounded-2xl border border-red-100">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <ErrorComponent message={errorMessage || error} />
          </div>
        ) : !hasResults ? (
          <div className="w-full max-w-2xl text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
            <div className="text-gray-300 mb-6">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Comienza tu búsqueda
            </h3>
            <p className="text-gray-500">
              Selecciona una categoría y completa los datos para encontrar lo
              que buscas.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center w-full mt-4">
              {collectionData[selectedOption]
                ?.slice(0, visibleCount)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="w-full flex justify-center hover:-translate-y-1 transition-transform duration-300"
                  >
                    <ObjectCard
                      category={translations[selectedOption] || selectedOption}
                      imageUrl={item.imageUrl}
                      objectTop={cardTitles.top}
                      dataTop={truncateString(
                        item.documentNumber ||
                          item.amount ||
                          item.model ||
                          item.brand ||
                          item.title,
                      )}
                      objectMiddle={cardTitles.middle}
                      dataMiddle={truncateString(
                        item.name ||
                          item.location ||
                          item.description ||
                          item.color,
                      )}
                      objectBottom={cardTitles.bottom}
                      dataBottom={item.date}
                      address={item.map}
                      coordinates={
                        item.coordinates && item.coordinates.length === 2
                          ? [item.coordinates[0], item.coordinates[1]]
                          : undefined
                      }
                      onClick={() => handleCardClick(item)}
                    />
                  </div>
                ))}
            </div>

            {/* Load More Button */}
            {collectionData[selectedOption]?.length > visibleCount && (
              <div className="flex justify-center mt-16 mb-8">
                <button
                  onClick={() => setVisibleCount(visibleCount + 10)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                >
                  <ArrowIcon />
                  <span>Cargar más resultados</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
