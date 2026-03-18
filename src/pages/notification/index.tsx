import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { NotificationProps } from "./types";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import DeleteIcon from "../../icons/DeleteIcon";
import Loader from "../../components/loader";
import NotificationIcon from "../../icons/notificationIcon";

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(true);

  const getUsernameByEmail = async (email: string) => {
    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().username;
      } else {
        return "Usuario";
      }
    } catch (error) {
      console.error("Error al obtener el nombre de usuario:", error);
      return "Usuario";
    }
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const chatsRef = collection(firestore, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", user.email),
    );

    const unsubscribeDisplay = onSnapshot(q, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const chatId = chatDoc.id;
        const participants = chatDoc.data().participants as string[];
        const otherUserEmail = participants.find(
          (email) => email !== user.email,
        );
        const otherUsername = otherUserEmail
          ? await getUsernameByEmail(otherUserEmail)
          : "Usuario";

        const messagesRef = collection(firestore, "chats", chatId, "messages");
        const msgQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1),
        );

        return new Promise<NotificationProps | null>((resolve) => {
          const unsubscribeMessages = onSnapshot(
            msgQuery,
            (messageSnapshot) => {
              if (!messageSnapshot.empty) {
                const doc = messageSnapshot.docs[0];
                const message = doc.data();

                if (
                  message.sender !== "FOBJ" &&
                  !message.isSystem &&
                  !message.preventNotification
                ) {
                  const chatInfo: NotificationProps = {
                    id: doc.id,
                    chatId,
                    message: message.text || "Mensaje no disponible",
                    otherUserName: otherUsername,
                    sender: message.sender,
                    senderEmail: message.senderEmail,
                    type: "info",
                    read: message.read,
                    createdAt: message.createdAt?.seconds * 1000 || Date.now(),
                    isUnread:
                      message.senderEmail !== user.email && !message.read,
                    map: chatDoc.data().map || "Ubicación no disponible",
                  };
                  resolve(chatInfo);
                } else {
                  resolve(null);
                }
              } else {
                resolve(null);
              }
            },
          );
          return unsubscribeMessages;
        });
      });

      const allNotifications = (await Promise.all(chatPromises)).filter(
        Boolean,
      ) as NotificationProps[];
      const sortedChats = allNotifications.sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      setNotifications(sortedChats);
      setLoading(false);
    });

    return () => {
      unsubscribeDisplay();
    };
  }, [user]);

  const markAsRead = async (chatId: string, messageId: string) => {
    try {
      const messageRef = doc(firestore, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, { read: true });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.chatId === chatId
            ? { ...notif, isUnread: false, read: true }
            : notif,
        ),
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  const handleNotificationClick = async (notif: NotificationProps) => {
    const otherUserDetails = {
      username: notif.otherUserName,
      email:
        notif.senderEmail === user.email
          ? "TU_OTRO_CAMPO_DE_EMAIL"
          : notif.senderEmail,
    };

    navigate("/chat", {
      state: {
        chatId: notif.chatId,
        userDetails: otherUserDetails,
      },
    });

    if (notif.isUnread && notif.id) {
      await markAsRead(notif.chatId!, notif.id);
    }
  };

  const handleDeleteNotification = async (
    chatId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    try {
      await deleteDoc(
        doc(firestore, "users", user.uid, "notifications", chatId),
      );
      setNotifications((prev) =>
        prev.filter((notif) => notif.chatId !== chatId),
      );
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Si es hoy, mostrar hora
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Si es ayer
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    }

    // Si es hace menos de una semana
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    // Mostrar fecha completa
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Layout>
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader />
          </div>
        ) : (
          <div className="w-full mt-2 md:mt-8 md:max-w-4xl md:mx-auto px-0 md:px-4">
            <div className="flex items-center gap-3 mb-4 md:mb-6 px-4 md:px-0">
              <div className="p-2 bg-blue-100 rounded-full">
                <NotificationIcon color="#001F54" width={24} height={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                Notificaciones
              </h2>
            </div>

            {notifications.length > 0 ? (
              <div className="grid gap-3 md:gap-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.chatId}
                    onClick={() => handleNotificationClick(notif)}
                    className={`
                      group relative flex flex-col md:flex-row items-start md:items-center justify-between
                      w-full p-4 md:p-5 rounded-none md:rounded-xl border border-x-0 md:border-x transition-all duration-300 cursor-pointer
                      hover:shadow-md hover:border-blue-200
                      ${
                        notif.isUnread
                          ? "bg-white border-blue-100 shadow-sm border-l-4 border-l-blue-500"
                          : "bg-white border-gray-100 opacity-90 hover:opacity-100"
                      }
                    `}
                  >
                    {/* Content Section */}
                    <div className="flex-1 min-w-0 pr-0 md:pr-4 w-full">
                      <div className="flex items-center justify-between md:justify-start gap-2 mb-1">
                        <span
                          className={`text-lg font-bold truncate ${notif.isUnread ? "text-gray-900" : "text-gray-700"}`}
                        >
                          {notif.otherUserName}
                        </span>
                        {notif.isUnread && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 md:ml-2">
                            Nuevo
                          </span>
                        )}
                        <span className="md:hidden text-xs text-gray-400 ml-auto whitespace-nowrap">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>

                      <p
                        className={`text-sm mb-2 truncate ${notif.isUnread ? "text-gray-800 font-medium" : "text-gray-500"}`}
                      >
                        {notif.message}
                      </p>

                      <div className="flex items-center text-xs text-gray-400 gap-2">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        <span className="truncate max-w-[70vw] md:max-w-[200px]">
                          {notif.map || "Ubicación desconocida"}
                        </span>
                      </div>
                    </div>

                    {/* Action & Time Section (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-3 pl-4 border-l border-gray-100 ml-4 min-w-[100px]">
                      <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                        {formatTime(notif.createdAt)}
                      </span>

                      <button
                        onClick={(e) =>
                          handleDeleteNotification(notif.chatId!, e)
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Eliminar notificación"
                      >
                        <DeleteIcon
                          width={18}
                          height={18}
                          color="currentColor"
                        />
                      </button>
                    </div>

                    {/* Mobile Delete Button (Absolute) */}
                    <button
                      onClick={(e) =>
                        handleDeleteNotification(notif.chatId!, e)
                      }
                      className="md:hidden absolute top-10 right-3 p-2 text-gray-400 hover:text-red-500 active:bg-red-50 rounded-full transition-colors"
                    >
                      <DeleteIcon width={16} height={16} color="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <NotificationIcon color="#9CA3AF" width={48} height={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No tienes notificaciones
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Cuando recibas mensajes o actualizaciones sobre tus objetos
                  perdidos, aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Notifications;
