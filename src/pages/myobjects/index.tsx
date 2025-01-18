import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import ObjectBar from "../../components/objectBar";
import { useAuth } from "../../context/authContext";
import { firestore } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getObjectCardTitles } from "../../utils/objectCardTitles";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";

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

  // Comprobar si aún estamos cargando
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader height="h-[70px]" width="w-[70px]" />
      </div>
    );
  }
  const translations: Record<string, string> = {
    Cash: "Dinero",
    Clothing: "Ropa",
    Phone: "Teléfono",
    Dni: "Dni",
    Other: "Otros",
  };
  return (
    <div>
      <Header />
      <Layout>
        <div className="flex flex-col items-center w-full mb-36 md:mb-0">
          <p className="font-semibold text-lg mt-12 md:text-[40px] md:text-left md:mb-4 w-full uppercase">
            Mis Objetos
          </p>
          {Object.keys(objects).map((collection: string) => {
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
          })}
        </div>
      </Layout>
    </div>
  );
};

export default MyObject;
