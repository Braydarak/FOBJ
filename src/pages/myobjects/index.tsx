import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import ObjectBar from "../../components/objectBar";
import { useAuth } from "../../context/authContext";
import { firestore } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getObjectCardTitles } from "../../utils/objectCardTitles";
import { useNavigate } from "react-router-dom";
import FobjIcon from "../../icons/fobjIcon";

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
              where("userId", "==", user.email)
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
    (collection) => objects[collection].data.length > 0
  );
  return (
    <div>
      <Header />
      <Layout>
        {authLoading || isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin " style={{ animationDuration: "2s" }}>
              <FobjIcon
                color={"#001F54"}
                size="150"
                height="150"
                disablePointer={true}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mb-36 md:mb-0">
            <p className="font-semibold text-lg mt-12 md:text-[40px] md:text-left md:mb-4 w-full uppercase">
              Mis Objetos
            </p>

            {hasObjects ? (
              Object.keys(objects).map((collection: string) => {
                return objects[collection].data.map((item: any) => {
                  return (
                    <ObjectBar
                      key={item.id}
                      objectTop={translations[collection] || collection}
                      address={item.map || ""}
                      coordinates={item.coordinates}
                      onClick={() => cardDetailsUser(collection, item.id)}
                    />
                  );
                });
              })
            ) : (
              <div className="text-center mt-8">
                <p className="text-gray-600 text-lg">
                  No se encontraron objetos.
                </p>
                <p
                  onClick={() => navigate("/home")}
                  className="text-secondary mt-4 text-xl font-bold cursor-pointer underline"
                >
                  Volver
                </p>
              </div>
            )}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default MyObject;
