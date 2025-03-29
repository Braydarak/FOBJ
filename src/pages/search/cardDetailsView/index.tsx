import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../../firebase";
import { useAuth } from "../../../context/authContext";
import Header from "../../../components/header";
import Layout from "../../../components/layout";
import Map from "../../../components/map/index";
import Button from "../../../components/customButton";
import FobjIcon from "../../../icons/fobjIcon";
import { renderDetails } from "./renderDetails";
import { useNavigate } from "react-router-dom";

const CardDetailsView: React.FC = () => {
  const location = useLocation();
  const { cardId, collectionName, userEmail } = location.state || {};
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleContactClick = async () => {
    const currentUserEmail = user?.email;
    const reportedUserEmail = userDetails?.email;

    if (!currentUserEmail || !reportedUserEmail) {
      console.error("Faltan datos de correo.");
      return;
    }

    if (currentUserEmail === reportedUserEmail) {
      alert("No puedes chatear contigo mismo.");
      return;
    }

    // Mapeo de collectionName a títulos en español
    const collectionToTitle: Record<string, string> = {
      Cash: "Dinero",
      Clothing: "Indumentaria",
      Dni: "DNI",
      Phone: "Telefono",
      Other: "Otros",
    };

    const chatTitle = collectionToTitle[collectionName] || "Objeto";

    // Generar chatId único (sin incluir el cardId si no es necesario)
    const chatId = [currentUserEmail, reportedUserEmail].sort().join("_");

    try {
      const chatRef = doc(firestore, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
       
        await setDoc(chatRef, {
          participants: [currentUserEmail, reportedUserEmail],
          createdAt: serverTimestamp(),
          objectId: cardId,
          title: chatTitle,
          lastMessage: "Mensaje de bienvenida",
          lastMessageTime: serverTimestamp(),
        });

       
        const messagesRef = collection(firestore, "chats", chatId, "messages");
        await setDoc(doc(messagesRef), {
          sender: "FOBJ",
          text: `¡Bienvenido al chat sobre su ${chatTitle}!\n\nRecomendaciones de seguridad:\n• Confirme que el objeto coincide con su pérdida\n• Coordine encuentros en lugares públicos\n• Evite compartir información sensible`,
          createdAt: serverTimestamp(), 
          read: true,
          isSystem: true, 
          type: "system_notice",
          preventNotification: true,
        });
      }

      navigate("/chat", {
        state: {
          chatId,
          userDetails,
        },
      });
    } catch (error) {
      console.error("Error al crear el chat:", error);
    }
  };

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
                text="Chatear"
                textTransform="uppercase"
                textSize="text-[25px]"
                textColor="text-backgroundcolor"
                bgColor="bg-secondary"
                roundedSize="rounded-[30px]"
                onClick={handleContactClick}
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
