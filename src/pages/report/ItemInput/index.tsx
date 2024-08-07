import React, { useEffect, useState } from "react";
import DynamicForm from "../../../components/dynamicForm";
import { Field } from "../../../components/preview/types";
//Actions Redux
import {
  updateInputs,
  writeToFirebase,
  clearInputs,
} from "../../../reducers/actions/objectActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../reducers/store";
import { ObjectState } from "../../../reducers/objectReducer";
import ErrorComponent from "../../../components/error";
import Loader from "../../../components/loader";
import { useNavigate } from "react-router-dom";

interface ItemInputFormProps {
  onSubmission: () => void;
  onChange?: (key: string, value: string) => void;
  selectedOption: string;
}

const ItemInputForm: React.FC<ItemInputFormProps> = ({
  onChange,
  selectedOption,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  const inputs =
    useSelector(
      (state: RootState) =>
        state.objects[
          `${selectedOption.toLowerCase()}Inputs` as keyof ObjectState
        ]
    ) || {};
  const success = useSelector((state: RootState) => state.objects.success);
  const error = useSelector((state: RootState) => state.objects.error);
  const loading = useSelector((state: RootState) => state.objects.loading);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setValidationMessage(null);
        dispatch(clearInputs(selectedOption.toLowerCase()));
        navigate("/home");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch, selectedOption]);

  const handleInputChange = (key: string, value: string) => {
    const updatedInputs = {
      ...inputs,
      [key]: value,
    };

    dispatch(
      updateInputs(`${selectedOption.toLowerCase()}Inputs`, updatedInputs)
    );

    if (onChange) {
      onChange(key, value);
    }

    // Verificar la validez del formulario mientras se actualizan los campos
    const isValid = Object.values(updatedInputs).every(
      (val) => (val as string).trim() !== "" && val !== "Seleccionar"
    );

    if (isValid) {
      setValidationMessage(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = Object.values(inputs).every(
      (value) => (value as string).trim() !== "" && value !== "Seleccionar"
    );

    if (!isValid) {
      setValidationMessage("Por favor, complete todos los campos.");
      return;
    }
    if (selectedOption === "Dni" && !inputs.documentNumber) {
      setValidationMessage("El número de documento es requerido.");
      return;
    }

    //crear el nuevo objeto
    dispatch(writeToFirebase(inputs, selectedOption));
  };

  const dniFieldsConfig = [
    { key: "name", label: "Nombre" },
    { key: "documentNumber", label: "Número de Documento", type: "number" },
    { key: "address", label: "Dirección" },
    { key: "date", label: "Fecha de Nacimiento", type: "date" },
  ];

  const phoneFieldsConfig = [
    { key: "model", label: "Modelo" },
    { key: "color", label: "Color" },
    { key: "date", label: "Fecha de Encuentro", type: "date" },
    { key: "information", label: "Información" },
  ];

  const clothingFieldsConfig = [
    { key: "brand", label: "Marca" },
    { key: "date", label: "Fecha de Encuentro", type: "date" },
    { key: "description", label: "Descripción de la prenda" },
  ];
  const cashFieldsConfig = [
    { key: "amount", label: "Cantidad", type: "number" },
    { key: "date", label: "Fecha", type: "date" },
    { key: "location", label: "Localidad" },
  ];

  const otherFieldsConfig = [
    { key: "description", label: "Descripción del objeto encontrado" },
    { key: "date", label: "Fecha", type: "date" },
  ];

  const dniFields: Field[] = selectedOption === "Dni" ? dniFieldsConfig : [];
  const cashFields: Field[] = selectedOption === "Cash" ? cashFieldsConfig : [];
  const otherFields: Field[] =
    selectedOption === "Other" ? otherFieldsConfig : [];
  const phoneFields: Field[] =
    selectedOption === "Phone" ? phoneFieldsConfig : [];
  const clothingFields: Field[] =
    selectedOption === "Clothing" ? clothingFieldsConfig : [];

  const fields: Field[] = [
    ...dniFields,
    ...phoneFields,
    ...clothingFields,
    ...cashFields,
    ...otherFields,
    { key: "map", label: "Mapa" },
  ];

  return (
    <div className="relative">
      {loading ? (
        <div className="inset-0 mt-10 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <Loader />
        </div>
      ) : (
        <div className="transition-opacity opacity-100">
          <div className="flex justify-center">
            {success && (
              <ErrorComponent
                textColor="text-successGreen"
                message="Formulario enviado con éxito, Redireccionando..."
              />
            )}
            {error && (
              <ErrorComponent message={"Error al enviar el formulario"} />
            )}
            {validationMessage && (
              <ErrorComponent message={validationMessage} />
            )}
          </div>
          <DynamicForm
            fields={fields}
            inputs={inputs}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default ItemInputForm;
