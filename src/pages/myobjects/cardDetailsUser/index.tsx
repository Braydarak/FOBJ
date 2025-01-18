import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../../../firebase";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import Loader from "../../../components/loader";
import Header from "../../../components/header";
import Layout from "../../../components/layout";
import Button from "../../../components/customButton";
import Map from "../../../components/map";

interface Field {
  label: string;
  value: string | number | undefined;
}

const CardDetailsUser: React.FC = () => {
  const { collectionName, itemid } = useParams();
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (collectionName && itemid) {
      const fetchItemDetails = async () => {
        setIsLoading(true);
        try {
          // Obtener los detalles del objeto (Cash, Dni, Clothing, etc.)
          const docRef = doc(firestore, collectionName, itemid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setItemDetails({ ...docSnap.data(), id: docSnap.id });
            const userEmail = docSnap.data()?.userId;

            //obtenemos los datos del usuario buscando por correo electrónico
            if (userEmail) {
              const usersRef = collection(firestore, "users");
              const q = query(usersRef, where("email", "==", userEmail));
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setUserDetails(userData);
              } else {
                console.log("No user found!");
              }
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching item details: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchItemDetails();
    }
  }, [collectionName, itemid]);

  const handleDelete = async () => {
    if (collectionName && itemid) {
      try {
        // Eliminar el objeto de la base de datos
        const docRef = doc(firestore, collectionName, itemid);
        await deleteDoc(docRef);

        // Redirigir a "/myobjects" después de eliminar
        navigate(`/myobjects`);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  // Mostrar un loader mientras se cargan los detalles
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader height="h-[70px]" width="w-[70px]" />
      </div>
    );
  }

  const renderDetails = () => {
    if (!itemDetails) {
      return <p>No se encontraron detalles para este objeto.</p>;
    }

    const fieldsByCollection: Record<string, Field[]> = {
      Dni: [
        { label: "Nombre", value: itemDetails.name },
        { label: "Número de documento", value: itemDetails.documentNumber },
        { label: "Dirección", value: itemDetails.address },
      ],
      Cash: [
        { label: "Monto", value: itemDetails.amount },
        { label: "Ubicación", value: itemDetails.location },
      ],
      Phone: [
        { label: "Modelo", value: itemDetails.model },
        { label: "Color", value: itemDetails.color },
        { label: "Información", value: itemDetails.information },
      ],
      Clothing: [
        { label: "Marca", value: itemDetails.brand },
        { label: "Descripción", value: itemDetails.description },
      ],
      Other: [{ label: "Descripción", value: itemDetails.description }],
    };

    const specificFields = fieldsByCollection[collectionName!] || [];

    return (
      <>
        <Header />
        <Layout>
          <div className="mb-48 md:mb-0">
            <h3 className="text-xl w-full font-semibold my-8 uppercase">
              Reportado por {userDetails?.username || "N/A"}
            </h3>
            <div className="w-full md:grid md:grid-cols-2 gap-6">
              <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full space-y-2 md:w-full">
                {specificFields.map((field: Field, index: number) => (
                  <React.Fragment key={index}>
                    <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
                      {field.label}
                    </div>
                    <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
                      {field.value || "N/A"}
                    </div>
                  </React.Fragment>
                ))}

                <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
                  Fecha
                </div>
                <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
                  {itemDetails.date
                    ? itemDetails.date.split("-").reverse().join("/")
                    : "N/A"}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center ">
                <div className="font-semibold text-2xl text-center mt-5 md:mt-0 uppercase">
                  Encontrado en
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="w-full text-center mb-3">
                    {itemDetails.map || "Mapa no disponible"}
                  </div>

                  <div className="flex items-center justify-center">
                    {itemDetails.coordinates &&
                    itemDetails.coordinates.length === 2 ? (
                      <Map
                        widthClass="w-[300px] md:w-[450px]"
                        heightClass="h-[150px] md:h-[250px]"
                        showSearchControl={false}
                        zoom={14}
                        zoomControl={false}
                        coordinates={itemDetails.coordinates}
                        onAddressSelect={() => {}}
                      />
                    ) : (
                      <p>Coordenadas no disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center mt-10 md:mt-14">
              <div className="md:w-80 w-full">
                <Button
                  text="Eliminar"
                  textTransform="uppercase"
                  textSize="text-[25px]"
                  textColor="text-backgroundcolor"
                  bgColor="bg-secondary"
                  roundedSize="rounded-[30px]"
                  disabled={false}
                  onClick={handleDelete}
                />
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  };
  return <div>{renderDetails()}</div>;
};

export default CardDetailsUser;
