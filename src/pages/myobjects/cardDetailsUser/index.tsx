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

  const fieldsByCollection: Record<string, Field[]> = {
    Dni: [
      { label: "Nombre", value: itemDetails?.name || "N/A" },
      {
        label: "Número de documento",
        value: itemDetails?.documentNumber || "N/A",
      },
      { label: "Dirección", value: itemDetails?.address || "N/A" },
    ],
    Cash: [
      { label: "Monto", value: itemDetails?.amount || "N/A" },
      { label: "Ubicación", value: itemDetails?.location || "N/A" },
    ],
    Phone: [
      { label: "Modelo", value: itemDetails?.model || "N/A" },
      { label: "Color", value: itemDetails?.color || "N/A" },
      { label: "Información", value: itemDetails?.information || "N/A" },
    ],
    Clothing: [
      { label: "Marca", value: itemDetails?.brand || "N/A" },
      { label: "Descripción", value: itemDetails?.description || "N/A" },
    ],
    Other: [{ label: "Descripción", value: itemDetails?.description || "N/A" }],
  };

  const specificFields = fieldsByCollection[collectionName!] || [];
  const formattedDate = itemDetails?.date
    ? itemDetails.date.split("-").reverse().join("/")
    : "N/A";

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24 md:pb-0">
      <Layout>
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[60vh]">
            <Loader height="h-[70px]" width="w-[70px]" />
          </div>
        ) : (
          <div className="w-full md:max-w-5xl md:mx-auto px-4 md:px-6 py-6 md:py-10">
            <button
              className="inline-flex items-center justify-center text-secondary hover:text-primary w-10 h-10 rounded-full hover:bg-white transition-colors mb-4"
              onClick={() => navigate("/myobjects")}
              aria-label="Volver"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12l7.5-7.5M3 12h18"
                />
              </svg>
            </button>

            <div className="flex items-start justify-between gap-4 mb-6 md:mb-10">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight truncate">
                  Detalle del reporte
                </h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  Reportado por {userDetails?.username || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                  Información
                </h2>

                <div className="flex flex-col gap-3">
                  {specificFields.map((field: Field) => (
                    <div
                      key={field.label}
                      className="flex items-start justify-between gap-4"
                    >
                      <span className="text-sm md:text-base text-gray-500 font-medium">
                        {field.label}
                      </span>
                      <span className="text-sm md:text-base text-gray-900 font-semibold text-right break-words">
                        {field.value || "N/A"}
                      </span>
                    </div>
                  ))}

                  <div className="h-px bg-gray-100 my-1" />

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Fecha
                    </span>
                    <span className="text-sm md:text-base text-gray-900 font-semibold text-right">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                  Ubicación
                </h2>

                <p className="text-sm md:text-base text-gray-700 break-words">
                  {itemDetails?.map || "Mapa no disponible"}
                </p>

                <div className="mt-4">
                  {itemDetails?.coordinates &&
                  itemDetails.coordinates.length === 2 ? (
                    <Map
                      widthClass="w-full"
                      heightClass="h-[180px] md:h-[260px]"
                      showSearchControl={false}
                      zoom={14}
                      zoomControl={false}
                      disableDragging={true}
                      disableZoom={true}
                      disableScrollWheelZoom={true}
                      disableDoubleClickZoom={true}
                      disableBoxZoom={true}
                      coordinates={itemDetails.coordinates}
                      onAddressSelect={() => {}}
                    />
                  ) : (
                    <div className="w-full h-[180px] md:h-[260px] rounded-xl border border-gray-100 flex items-center justify-center text-gray-500">
                      Coordenadas no disponibles
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center mt-8 md:mt-10">
              <div className="w-full md:w-80">
                <Button
                  text="Eliminar"
                  textTransform="uppercase"
                  textSize="text-[18px]"
                  textColor="text-backgroundcolor"
                  bgColor="bg-secondary"
                  roundedSize="rounded-full"
                  disabled={false}
                  onClick={handleDelete}
                />
              </div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default CardDetailsUser;
