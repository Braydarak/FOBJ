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
import Map from "../../../components/map/index";
import { renderDetails } from "./renderDetails";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";

const UserIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const CardDetailsView: React.FC = () => {
  const location = useLocation();
  const { cardId, collectionName } = location.state || {};
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCardAndUserDetails = async () => {
      if (cardId && collectionName) {
        try {
          const docRef = doc(firestore, collectionName, cardId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const cardData = docSnap.data();
            setCardDetails(cardData);

            if (cardData.userId) {
              const userRef = query(
                collection(firestore, "users"),
                where("email", "==", cardData.userId),
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

    // Generar chatId único
    const sortedEmails = [currentUserEmail, reportedUserEmail].sort();
    const chatId = `${sortedEmails.join()}_${cardId}`;

    try {
      const chatRef = doc(firestore, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: sortedEmails,
          createdAt: serverTimestamp(),
          objectId: cardId,
          title: `${chatTitle} - ${cardDetails?.title}`,
          lastMessage: "Mensaje de bienvenida",
          lastMessageTime: serverTimestamp(),
          isAboutObject: true,
          map: cardDetails?.map
            ?.replace(/^-|\d+/g, "")
            .replace(/\s{2,}/g, " ")
            .trim(),
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
          objectTitle: cardDetails?.title,
        },
      });
    } catch (error) {
      console.error("Error al crear el chat:", error);
    }
  };

  const coordinates = cardDetails?.coordinates;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-full flex-grow">
          <Loader />
        </div>
      ) : cardDetails ? (
        <div className="w-full flex flex-col items-center">
          {/* Details & Map Grid */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Object Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wide border-b pb-4">
                Detalles del Objeto
              </h4>
              <div className="space-y-4">{renderDetails(cardDetails)}</div>
            </div>

            {/* Map Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <h4 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wide border-b pb-4">
                Ubicación
              </h4>

              <div className="flex-grow flex flex-col">
                <div className="flex items-start gap-3 mb-6 bg-gray-50 p-4 rounded-xl">
                  <svg
                    className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {cardDetails.map || "Ubicación no especificada"}
                  </p>
                </div>

                <div className="w-full h-[250px] md:h-full min-h-[250px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                  {coordinates && coordinates.length === 2 ? (
                    <Map
                      widthClass="w-full"
                      heightClass="h-full"
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center">
                      <svg
                        className="w-12 h-12 mb-3 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p className="font-medium">
                        Mapa no disponible para esta ubicación
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Header/User Section (Now at bottom) */}
          <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                {userDetails?.photoURL ? (
                  <img
                    src={userDetails.photoURL}
                    alt={userDetails.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 text-gray-400">
                    <UserIcon />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                  Reportado por
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {userDetails?.username || "Usuario Anónimo"}
                </h3>
              </div>
            </div>

            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <button
                onClick={handleContactClick}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Contactar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-2xl text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
            <div className="text-gray-300 mb-6">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No se encontró información
            </h3>
            <p className="text-gray-500">
              No pudimos cargar los detalles de este objeto. Es posible que haya
              sido eliminado o ya no esté disponible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetailsView;
