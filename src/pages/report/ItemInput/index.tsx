import React, { useEffect, useState } from "react";
import DynamicForm from "../../../components/dynamicForm";
import { Field } from "../../../components/preview/types";
import { compressImageNative } from "../../../utils/objectCardTitles/imageCompressor";
import { uploadImageToCloudinary } from "../../../utils/cloudinary/cloudinaryUpload";
import { collection, doc } from "firebase/firestore";
import { firestore } from "../../../firebase";
//Actions Redux
import {
  updateInputs,
  writeToFirebase,
  clearInputs,
  setLoading,
} from "../../../reducers/actions/objectActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../reducers/store";
import { ObjectState } from "../../../reducers/objectReducer";
import ErrorComponent from "../../../components/error";
import Loader from "../../../components/loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

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
  const { user } = useAuth();
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
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isReadOnly = false;

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

  const handleInputChange = (key: string, value: any) => {
    if (key === "image" && value instanceof File) {
      setImageFile(value);
      return;
    }

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    if (!user?.email) {
      setValidationMessage("ID de usuario no disponible.");
      return;
    }

    let imageUrl = null;

    const collectionRef = collection(firestore, selectedOption);
    const newDocRef = doc(collectionRef);
    const firebaseId = newDocRef.id;

    
    const folderName = selectedOption.toLowerCase();
    

    if (imageFile) {
      try {
        dispatch(setLoading(true));

        // 1. Comprimimos
        const compressedFile = await compressImageNative(imageFile);

        // 2. Subimos a Cloudinary
       imageUrl = await uploadImageToCloudinary(compressedFile, folderName, firebaseId);

        if (!imageUrl) {
          setValidationMessage("Error al subir la imagen. Inténtalo de nuevo.");
          dispatch(setLoading(false));
          return;
        }
      } catch (error) {
        console.error("Error procesando imagen:", error);
        setValidationMessage("Hubo un problema procesando la imagen.");
        dispatch(setLoading(false));
        return;
      }
    }

    const cleanedData = Object.fromEntries(
      Object.entries({
        ...inputs,
        id: firebaseId,
        userId: user?.email,
        coordinates: coordinates,
        imageUrl: imageUrl,
      }).filter(([_, value]) => value !== undefined)
    );
    //crear el nuevo objeto
    dispatch(writeToFirebase(cleanedData, selectedOption));
  };

  const dniFieldsConfig = [
    { key: "name", label: "Nombre" },
    { key: "documentNumber", label: "Número de Documento", type: "number" },
    { key: "address", label: "Dirección" },
    { key: "date", label: "Fecha de Nacimiento", type: "date" },
    { key: "image", label: "Foto del DNI", type: "file" },
  ];

  const phoneFieldsConfig = [
    { key: "model", label: "Modelo" },
    { key: "color", label: "Color" },
    { key: "date", label: "Fecha de Encuentro", type: "date" },
    { key: "information", label: "Información" },
    { key: "image", label: "Foto del Teléfono", type: "file" },
  ];

  const clothingFieldsConfig = [
    { key: "brand", label: "Marca" },
    { key: "date", label: "Fecha de Encuentro", type: "date" },
    { key: "description", label: "Descripción de la prenda" },
    { key: "image", label: "Foto de la Prenda", type: "file" },
  ];
  const cashFieldsConfig = [
    { key: "amount", label: "Cantidad", type: "number" },
    { key: "date", label: "Fecha", type: "date" },
    { key: "location", label: "Localidad" },
    { key: "image", label: "Foto (Opcional)", type: "file" },
  ];

  const otherFieldsConfig = [
    { key: "title", label: "Titulo", placeholder: "Ej: Llaves, Valija, etc.." },
    { key: "description", label: "Descripción del objeto encontrado" },
    { key: "date", label: "Fecha", type: "date" },
    { key: "image", label: "Foto del objeto", type: "file" },
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
  const handleAddressSelect = ({
    address,
    coordinates,
  }: {
    address: string;
    coordinates: [number, number];
  }) => {
    handleInputChange("map", address);
    setCoordinates(coordinates);
  };

  return (
    <div className="">
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
            mapAddressHandler={handleAddressSelect}
            coordinates={coordinates}
            ReadOnly={isReadOnly}
          />
        </div>
      )}
    </div>
  );
};

export default ItemInputForm;
