import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import ObjectBar from "../../components/objectBar";
import { useAuth } from "../../context/authContext";
import { firestore } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getObjectCardTitles } from "../../utils/objectCardTitles";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import Button from "../../components/customButton";

const MyObject: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [objects, setObjects] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const cardDetailsUser = (collectionName: string, itemId: string) => {
    navigate(`/cardDetailsUser/${collectionName}/${itemId}`);
  };

  // Cargar los objetos del usuario logueado
  useEffect(() => {
    if (user) {
      const fetchObjects = async () => {
        setIsLoading(true);
        try {
          // Aquí estamos buscando los objetos de diferentes colecciones
          const collections = ["Cash", "Clothing", "Phone", "Dni", "Other"];
          const userObjects: any = {};

          // Iteramos sobre las colecciones
          for (const collectionName of collections) {
            const q = query(
              collection(firestore, collectionName),
              where("userId", "==", user.email),
            );

            const snapshot = await getDocs(q);
            const collectionData = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));

            // Guardamos los datos en un objeto, agrupados por colección
            if (collectionData.length > 0) {
              // Obtiene los títulos de la función getObjectCardTitles
              const titles = getObjectCardTitles(collectionName);

              userObjects[collectionName] = {
                data: collectionData,
                titles,
              };
            }
          }

          setObjects(userObjects);
        } catch (error) {
          console.error("Error fetching objects: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchObjects();
    }
  }, [user]);

  const translations: Record<string, string> = {
    Cash: "Dinero",
    Clothing: "Ropa",
    Phone: "Teléfono",
    Dni: "Dni",
    Other: "Otros",
  };
  const hasObjects = Object.keys(objects).some(
    (collection) => objects[collection].data.length > 0,
  );

  const orderedCollections = [
    "Cash",
    "Clothing",
    "Phone",
    "Dni",
    "Other",
  ].filter((collectionName) => objects?.[collectionName]?.data?.length > 0);

  const totalObjects = orderedCollections.reduce((acc, collectionName) => {
    return acc + (objects?.[collectionName]?.data?.length || 0);
  }, 0);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24 md:pb-0">
      <Layout>
        {authLoading || isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        ) : (
          <div className="w-full md:max-w-5xl md:mx-auto px-4 md:px-6 pt-6 md:pt-10">
            <div className="flex items-end justify-between gap-4 mb-6 md:mb-10">
              <div className="min-w-0">
                <h1 className="font-bold text-2xl md:text-4xl text-gray-900 uppercase tracking-tight truncate">
                  Mis Objetos
                </h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  Objetos que reportaste como encontrados.
                </p>
              </div>
              <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                {totalObjects} {totalObjects === 1 ? "objeto" : "objetos"}
              </div>
            </div>

            {hasObjects ? (
              <div className="flex flex-col gap-8">
                {orderedCollections.map((collection: string) => (
                  <div key={collection} className="w-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h2 className="text-base md:text-lg font-semibold text-gray-800 uppercase tracking-wide">
                        {translations[collection] || collection}
                      </h2>
                      <span className="text-xs md:text-sm text-gray-500">
                        {objects[collection].data.length}
                      </span>
                    </div>
                    <div className="w-full flex flex-col items-center">
                      {objects[collection].data.map((item: any) => (
                        <ObjectBar
                          key={item.id}
                          objectTop={translations[collection] || collection}
                          address={item.map || ""}
                          coordinates={item.coordinates}
                          onClick={() => cardDetailsUser(collection, item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-12 text-center">
                <p className="text-gray-800 text-lg md:text-xl font-semibold">
                  No se encontraron objetos
                </p>
                <p className="text-gray-500 mt-2">
                  Cuando reportes un objeto, va a aparecer acá.
                </p>
                <div className="mt-6 w-full max-w-xs mx-auto">
                  <Button
                    text="Volver al inicio"
                    textColor="text-backgroundcolor"
                    bgColor="bg-secondary"
                    onClick={() => navigate("/home")}
                    disabled={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default MyObject;
