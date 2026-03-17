import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Button from "../../components/customButton";
import CustomInput from "../../components/customInput";
import { useAuth } from "../../context/authContext";
import UserIcon from "../../components/userIcon";
import Loader from "../../components/loader";

const ConfigPage: React.FC = () => {
  const { user } = useAuth();

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

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGoogleUserData = async (uid: string) => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const { displayName, email, providerData } = currentUser;
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
          await setDoc(doc(firestore, "users", uid), newUserData);
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      }
    };

    const fetchUserData = async (uid: string) => {
      setIsLoading(true);
      try {
        const userDoc = doc(firestore, "users", uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data() as any);
        } else {
          await fetchGoogleUserData(uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

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
          {} as typeof inputData,
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
    } finally {
      setIsLoading(false);
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

  const handleInputChange = (field: keyof typeof userData, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="overflow-x-hidden w-full flex flex-col h-full min-h-screen">
      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 border-b pb-4 border-gray-200 uppercase tracking-wide">
          Configuración de Perfil
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center flex-grow">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-16 items-start w-full">
            {/* Sección de Foto de Perfil (Arriba en móvil, Derecha en escritorio) */}
            <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md flex items-center justify-center bg-gray-100">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 text-gray-400">
                    <UserIcon />
                  </div>
                )}
              </div>
              <div className="w-full mt-4">
                <Button
                  text="Cambiar Foto"
                  textColor="text-gray-700"
                  withBorder={true}
                  borderColor="border-gray-300"
                  font="font-medium"
                  bgColor="bg-white hover:bg-gray-50 transition-colors"
                  disabled={false}
                  textSize="text-sm"
                  roundedSize="rounded-xl"
                />
              </div>
            </div>

            {/* Sección de Datos (Abajo en móvil, Izquierda en escritorio) */}
            <div className="w-full md:w-2/3 space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Usuario */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Usuario
                  </label>
                  {userData.username ? (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-100">
                      {userData.username}
                    </div>
                  ) : (
                    <CustomInput
                      value={inputData.username}
                      placeholder="Ingrese el usuario"
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                    />
                  )}
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Nombre
                  </label>
                  {userData.firstName ? (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-100">
                      {userData.firstName}
                    </div>
                  ) : (
                    <CustomInput
                      value={inputData.firstName}
                      placeholder="Ingrese el nombre"
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  )}
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Apellido
                  </label>
                  {userData.lastName ? (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-100">
                      {userData.lastName}
                    </div>
                  ) : (
                    <CustomInput
                      value={inputData.lastName}
                      placeholder="Ingrese el apellido"
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  )}
                </div>

                {/* Email */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  {userData.email ? (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-100 truncate">
                      {userData.email}
                    </div>
                  ) : (
                    <CustomInput
                      value={inputData.email}
                      placeholder="Ingrese el email"
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  )}
                </div>

                {/* Teléfono */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </label>
                  {userData.phoneNumber ? (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-100">
                      {userData.phoneNumber}
                    </div>
                  ) : (
                    <CustomInput
                      value={inputData.phoneNumber}
                      placeholder="Ingrese el teléfono"
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                    />
                  )}
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                <div className="w-full md:w-auto min-w-[200px]">
                  <Button
                    text="Guardar Cambios"
                    textTransform="uppercase"
                    textSize="text-base"
                    textColor="text-white"
                    bgColor="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    roundedSize="rounded-xl"
                    font="font-bold tracking-wide"
                    withBorder={true}
                    borderColor="border-blue-800"
                    disabled={false}
                    onClick={saveUserData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPage;
