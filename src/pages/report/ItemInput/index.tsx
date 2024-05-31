import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../../../firebase";
import Preview from "../../../components/preview";
import DynamicForm from "../../../components/dynamicForm";
import { Field } from "../../../components/preview/types";

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
  const [inputs, setInputs] = useState({
    name: "",
    address: "",
    date: "",
    documentNumber: "",
    map: "",
    color:"",
    amount:"",
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));

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

  const handleSave = () => {
    writeToFirebase(inputs);
    onSubmission();
  };
  const handleEdit = () => {
    setShowPreview(false);
  };

  const writeToFirebase = (data: any) => {
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);
    push(ref(database, selectedOption), data); 
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
