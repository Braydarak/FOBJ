import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Layout from "../../components/layout";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHasUnread } from "../../reducers/notifications/notificationsSlice";
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
  collectionGroup,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import FobjIcon from "../../icons/fobjIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Restored function to get username by email
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
    let activeChats = 0;
    let completedChats = 0;

    const chatsRef = collection(firestore, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", user.email)
    );

    const unsubscribeDisplay = onSnapshot(q, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const chatId = chatDoc.id;
        const participants = chatDoc.data().participants as string[];
        const otherUserEmail = participants.find(
          (email) => email !== user.email
        );
        const otherUsername = otherUserEmail
          ? await getUsernameByEmail(otherUserEmail)
          : "Usuario";

        const messagesRef = collection(firestore, "chats", chatId, "messages");
        const msgQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1)
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
            }
          );
          return unsubscribeMessages;
        });
      });

      const allNotifications = (await Promise.all(chatPromises)).filter(
        Boolean
      ) as NotificationProps[];
      const sortedChats = allNotifications.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setNotifications(sortedChats);
      setLoading(false);
    });

    return () => {
      unsubscribeDisplay();
    };
  }, [user]);

  // Restored markAsRead function
  const markAsRead = async (chatId: string, messageId: string) => {
    try {
      const messageRef = doc(firestore, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, { read: true });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.chatId === chatId
            ? { ...notif, isUnread: false, read: true }
            : notif
        )
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

  // Restored handleDeleteNotification function
  const handleDeleteNotification = async (
    chatId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    try {
      await deleteDoc(
        doc(firestore, "users", user.uid, "notifications", chatId)
      );
      setNotifications((prev) =>
        prev.filter((notif) => notif.chatId !== chatId)
      );
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-start bg-gray-100">
      <Header />
      {loading ? (
        <Layout>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin" style={{ animationDuration: "2s" }}>
              <FobjIcon
                color={"#001F54"}
                size="150"
                height="150"
                disablePointer={true}
              />
            </div>
          </div>
        </Layout>
      ) : (
        <Layout>
          <div className="flex flex-col items-center w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-3 flex items-center">Chats</h2>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.chatId}
                  onClick={() => handleNotificationClick(notif)}
                  className={`relative p-3 mb-2 rounded cursor-pointer w-full text-center transition-all ${
                    notif.isUnread
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <DeleteIcon
                      width={16}
                      height={16}
                      color={notif.isUnread ? "#e42b2b" : "#000000"}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteNotification(notif.chatId!, e);
                      }}
                    />
                  </div>
                  <div className="font-bold text-lg">{notif.otherUserName}</div>
                  <div className="text-sm italic">
                    {notif.map || "Ubicación no disponible"}
                  </div>
                  <div className="mt-2">
                    {notif.message && notif.message.length > 20
                      ? `${notif.message.slice(0, 20)}...`
                      : notif.message || "Mensaje no disponible"}
                  </div>
                  {notif.isUnread && (
                    <div className="text-xs mt-1">Nuevo mensaje</div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tienes chats activos.</p>
            )}
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Notifications;
