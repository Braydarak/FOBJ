import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../../firebase";
import Header from "../../../components/header";
import Layout from "../../../components/layout";
import Map from "../../../components/map/index";
import Button from "../../../components/customButton";
import FobjIcon from "../../../icons/fobjIcon";
import { renderDetails } from "./renderDetails";

const CardDetailsView: React.FC = () => {
  const location = useLocation();
  const { cardId, collectionName } = location.state || {};
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardAndUserDetails = async () => {
      if (cardId && collectionName) {
        try {
          // Obtener los detalles de la tarjeta
          const docRef = doc(firestore, collectionName, cardId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const cardData = docSnap.data();
            setCardDetails(cardData);

            if (cardData.userId) {
              // En lugar de usar userId como ID de documento, lo tratamos como un correo
              const userRef = query(
                collection(firestore, "users"),
                where("email", "==", cardData.userId) // Buscamos por el correo
              );
              const userSnap = await getDocs(userRef);

              if (!userSnap.empty) {
                const userDoc = userSnap.docs[0];
                setUserDetails(userDoc.data());
              } else {
                console.log("No se encontraron datos del usuario.");
              }
            }
          } else {
            console.log("No se encontraron datos de la tarjeta.");
          }
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCardAndUserDetails();
  }, [cardId, collectionName]);

  const coordinates = cardDetails?.coordinates;

  return (
    <>
      <Header />
      <Layout>
        {loading ? (
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
        ) : cardDetails ? (
          <>
            <h3 className="text-2xl w-full font-semibold my-8 uppercase">
              Reportado por {userDetails?.username || "N/A"}
            </h3>
            <div className="w-full md:grid md:grid-cols-2">
              <div className="grid grid-cols-1 grid-rows-5 gap-4 w-full space-y-2 md:w-full">
                {renderDetails(cardDetails)}
              </div>

              <div className="md:w-1/2 mx-auto">
                <div className="font-semibold text-2xl text-center mt-5 md:mt-0 uppercase">
                  Encontrado en
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="w-full text-center">
                    {cardDetails.map || "Mapa no disponible"}
                  </div>

                  <div className="grid place-items-center w-full h-full">
                    {coordinates && coordinates.length === 2 ? (
                      <Map
                        widthClass="w-[300px] md:w-[450px]"
                        heightClass="h-[150px] md:h-[250px]"
                        showSearchControl={false}
                        zoom={14}
                        zoomControl={false}
                        coordinates={coordinates}
                        disableDragging={true}
                        disableZoom={true}
                        disableScrollWheelZoom={true}
                        disableDoubleClickZoom={true}
                        disableBoxZoom={true}
                        onAddressSelect={() => {}}
                      />
                    ) : (
                      <p>Coordenadas no disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-80 w-full mt-10 md:mt-14">
              <Button
                text="Contactar"
                textTransform="uppercase"
                textSize="text-[25px]"
                textColor="text-backgroundcolor"
                bgColor="bg-secondary"
                roundedSize="rounded-[30px]"
                
                disabled={false}
              />
            </div>
          </>
        ) : (
          <div>No se encontraron detalles para esta tarjeta.</div>
        )}
      </Layout>
    </>
  );
};

export default CardDetailsView;
