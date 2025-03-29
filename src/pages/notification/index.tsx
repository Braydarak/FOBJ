import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Layout from "../../components/layout";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import FobjIcon from "../../icons/fobjIcon";

interface NotificationProps {
  id?: string;
  message: string;
  chatId?: string;
  read?: boolean;
  sender: string;
  senderEmail: string;
  type: "success" | "error" | "info";
  createdAt: number;
  isUnread?: boolean;
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(true);

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
  
    const unsubscribeChats = onSnapshot(q, (snapshot) => {
      const chatsMap = new Map<string, NotificationProps>();
      activeChats = snapshot.docs.length;
      completedChats = 0;
  
      // Si no hay chats, terminar la carga inmediatamente
      if (activeChats === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }
  
      snapshot.docs.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        const messagesRef = collection(firestore, "chats", chatId, "messages");
        const msgQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1)
        );
  
        const unsubscribeMessages = onSnapshot(msgQuery, (messageSnapshot) => {
          completedChats++;
          
          if (!messageSnapshot.empty) {
            const doc = messageSnapshot.docs[0];
            const message = doc.data();
  
            if (message.sender !== "FOBJ" && !message.isSystem && !message.preventNotification) {
              const chatInfo: NotificationProps = {
                id: doc.id,
                chatId,
                message: message.text || "Mensaje no disponible",
                sender: message.sender,
                senderEmail: message.senderEmail,
                type: "info",
                read: message.read,
                createdAt: message.createdAt?.seconds * 1000 || Date.now(),
                isUnread: message.senderEmail !== user.email && !message.read,
              };
              chatsMap.set(chatId, chatInfo);
            }
          }
  
          // Cuando todos los chats han sido procesados
          if (completedChats >= activeChats) {
            const sortedChats = Array.from(chatsMap.values()).sort(
              (a, b) => b.createdAt - a.createdAt
            );
            setNotifications(sortedChats);
            setLoading(false);
          }
        });
  
        return unsubscribeMessages;
      });
    });
  
    return () => unsubscribeChats();
  }, [user]);

  const markAsRead = async (chatId: string, messageId: string) => {
    try {
      // Actualizar en Firebase
      const messageRef = doc(firestore, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, { read: true });

      // Actualizar en el estado local
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
    // Primero navegamos al chat
    navigate("/chat", { state: { chatId: notif.chatId } });

    // Luego marcamos como leído (si es necesario)
    if (notif.isUnread && notif.id) {
      await markAsRead(notif.chatId!, notif.id);
    }
  };
 

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-start bg-gray-100">
      <Header />
      {loading ? (
        <Layout>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin" style={{ animationDuration: "2s" }}>
              <FobjIcon color={"#001F54"} size="150" height="150" disablePointer={true} />
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
                key={notif.chatId} // Usamos chatId como key única
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 mb-2 rounded cursor-pointer w-full text-center transition-all ${
                  notif.isUnread
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200"
                }`}
              >
                <div className="font-bold text-lg">
                  {notif.senderEmail === user.email ? "Tú" : notif.sender}
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
