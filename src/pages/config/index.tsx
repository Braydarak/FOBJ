import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "../../components/layout";
import Header from "../../components/header";
import Dropdown from "../../components/dropdown";
import { Option } from "../../components/dropdown/types";
import Button from "../../components/customButton";
import CustomInput from "../../components/customInput";
import { useAuth } from "../../context/authContext";

const ConfigPage: React.FC = () => {
  const { user } = useAuth();
  const dropdownOptions = {
    placeholder: "TELEFONO",
    items: [
      { value: "option1", label: "Usuario" },
      { value: "option2", label: "Telefono" },
    ] as Option[],
  };
  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [inputData, setInputData] = useState<{
    [key: string]: string;
  }>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserData = async (uid: string) => {
    const userDoc = doc(firestore, "users", uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      setUserData(userSnapshot.data() as any);
    } else {
      fetchGoogleUserData();
    }
  };

  const fetchGoogleUserData = async () => {
    const user = auth.currentUser;

    if (user && userId) {
      const { displayName, email, providerData } = user;
      const phoneNumber = providerData[0]?.phoneNumber || "";

      const newUserData = {
        username: displayName || "",
        firstName: displayName?.split(" ")[0] || "",
        lastName: displayName?.split(" ")[1] || "",
        email: email || "",
        phoneNumber,
      };

      setUserData(newUserData);

      try {
        await setDoc(doc(firestore, "users", userId), newUserData);
      } catch (error) {
        console.error("Error al guardar los datos en Firestore:", error);
      }
    }
  };

  const saveUserData = async () => {
    if (!userId) return;

    const userDocRef = doc(firestore, "users", userId);

    try {
      const updatedData = {
        ...userData, // Mantiene los datos originales como el email
        ...Object.keys(inputData).reduce(
          (acc, key) => {
            if (inputData[key as keyof typeof inputData]) {
              acc[key] = inputData[key as keyof typeof inputData];
            }
            return acc;
          },
          {} as typeof inputData
        ),
      };

      await updateDoc(userDocRef, updatedData);
      setUserData(updatedData);
      setInputData({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
      alert("Datos guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId, fetchUserData]);

  const handleInputChange = (field: keyof typeof userData, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="overflow-x-hidden w-full flex flex-col h-full justify-between items-stretch">
      <Header />
      <Layout>
        <h3 className="text-2xl w-full font-semibold my-8 uppercase">
          configuración
        </h3>
        <div className="w-full md:grid md:grid-cols-2">
          <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full space-y-2 md:w-full">
            {/* row 1 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              usuario
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {userData.username ? (
                userData.username
              ) : (
                <div className="h-0">
                  <CustomInput
                    value={inputData.username}
                    placeholder="Ingrese el usuario"
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            {/* row 2 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              nombre
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {userData.firstName ? (
                userData.firstName
              ) : (
                <div className="h-0">
                  <CustomInput
                    value={inputData.firstName}
                    placeholder="Ingrese el nombre"
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            {/* row 3 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              Apellido
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {userData.lastName ? (
                userData.lastName
              ) : (
                <div className="h-0">
                  <CustomInput
                    value={inputData.lastName}
                    placeholder="Ingrese el apellido"
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            {/* row 4 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-1 uppercase">
              email
            </div>
            <div className="bg-blue-500 text-right text-xl font-medium col-span-3">
              {userData.email ? (
                userData.email
              ) : (
                <div className="h-0">
                  <CustomInput
                    value={inputData.email}
                    placeholder="Ingrese el email"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* row 5 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              telefono
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {userData.phoneNumber ? (
                userData.phoneNumber
              ) : (
                <div className="h-0">
                  <CustomInput
                    value={inputData.phoneNumber}
                    placeholder="Ingrese el teléfono"
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div className="md:w-1/2  md:justify-center  md:items-center md:text-center md:mx-auto">
           <div className="grid grid-cols-2 gap-4 w-full mt-10">
              <div className="flex justify-center items-center">
                <Button
                  text="Cargar Imagen"
                  textColor={"text-inputBorder"}
                  withBorder={true}
                  borderColor="border-inputBorder"
                  font="font-normal"
                  bgColor="bg-gray-600"
                  disabled={false}
                />
              </div>
              <div className="mx-auto w-20 h-20 ">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Foto de perfil"
                   className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-80 w-full mt-10 md:mt-14">
          <Button
            text="Guardar"
            textTransform="uppercase"
            textSize="text-[25px]"
            textColor="text-backgroundcolor"
            bgColor="bg-secondary"
            roundedSize="rounded-[30px]"
            disabled={false}
            onClick={saveUserData}
          />
        </div>
      </Layout>
    </div>
  );
};

export default ConfigPage;
