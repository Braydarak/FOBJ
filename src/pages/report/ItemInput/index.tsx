import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../../../firebase";
import Preview from "../../../components/preview";
import DynamicForm from "../../../components/dynamicForm";
import { Field } from "../../../components/preview/types";
//Actions Redux
import {
  updateInputs,
  writeToFirebase,
  clearInputs,
  setValidationError,
  clearValidationError
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
  onSubmission,
  onChange,
  selectedOption,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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
  const validationError = useSelector((state: RootState) => state.objects.validationError);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearInputs(selectedOption.toLowerCase()));
        dispatch(clearValidationError());
        navigate("/home");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch, selectedOption]);

  
  const handleInputChange = (key: string, value: string) => {
    dispatch(
      updateInputs(`${selectedOption.toLowerCase()}Inputs`, {
        ...inputs,
        [key]: value,
      })
    );
    const isValid = Object.values({
      ...inputs,
      [key]: value,
    }).every((value) => (value as string).trim() !== "");

    if (isValid) {
      dispatch(clearValidationError()); 
    }

    if (onChange) {
      onChange(key, value);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPreview(true);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

    if (!isValid) {
      dispatch(setValidationError("Por favor, complete todos los campos."));
      return;
    }

    //crear el nuevo objeto
    dispatch(clearValidationError());
    dispatch(writeToFirebase(inputs, selectedOption));
  };

  const dniFieldsConfig = [
    { key: "name", label: "Nombre"  },
    { key: "documentNumber", label: "Número de Documento", type: "number" },
    { key: "address", label: "Dirección"  },
    { key: "date", label: "Fecha de Nacimiento", type:"date" },
    ];
  
  const phoneFields: Field[] = selectedOption === "Phone" ? [
    { key: "model", label: "Modelo" },
    { key: "color", label: "Color" },
    { key: "date", label: "Fecha de Encuentro" },
    { key: "information", label: "Información" }
  ] : [];

  const clothingFields: Field[] = selectedOption === "Clothing" ? [
    { key: "brand", label: "Marca" },
    { key: "date", label: "Fecha de Encuentro" },
    { key: "description", label: "Descripción de la prenda" }
  ] : [];
  const cashFieldsConfig = [
    { key: "amount", label: "Cantidad", type: "number" },
    { key: "date", label: "Fecha", type: "date" },
    { key: "location", label: "Localidad" }
  ];

  const otherFieldsConfig = [
    { key: "description", label: "Descripción del objeto encontrado" },
    { key: "date", label: "Fecha", type: "date" },
  ];


  const dniFields: Field[] = selectedOption === "Dni" ? dniFieldsConfig : [];
  const cashFields: Field[] = selectedOption === "Cash" ? cashFieldsConfig : [];
  const otherFields: Field[] = selectedOption === "Other" ? otherFieldsConfig : [];
  
  
  
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
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
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
          {validationError && (
              <ErrorComponent
                message={validationError}
              />
            )}
            {error && !validationError && (
              <ErrorComponent message={"Error al enviar el formulario"} />
            )}
        </div>
    <div>
      {!showPreview ? (
        <DynamicForm
          fields={fields}
          inputs={inputs}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onPreview={handlePreview}
        />
      ) : (
        <Preview
          fields={fields}
          inputs={inputs}
          onEdit={handleEdit}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ItemInputForm;
