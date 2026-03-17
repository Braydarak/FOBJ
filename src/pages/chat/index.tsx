import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { firestore as db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import FobjIcon from "../../icons/fobjIcon";
import { useAuth } from "../../context/authContext";
import { useDispatch } from "react-redux";
import UserIcon from "../../components/userIcon";

const Chat = () => {
  const location = useLocation();
  const { chatId, userDetails } = location.state || {};
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string; senderEmail: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUsernameByEmail = async (email: string) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().username; // Retorna el username
      } else {
        console.error("No se encontró el usuario en Firestore.");
        return email;
      }
    } catch (error) {
      console.error("Error al obtener el username:", error);
      return email;
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!chatId || !messageId) return;

    try {
      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
      alert("No se pudo eliminar el mensaje");
    }
  };

  useEffect(() => {
    if (!chatId) {
      console.error("No se encontró el ID del chat.");
      navigate("/home");
    }
  }, [chatId, navigate]);

  // Escuchar mensajes en Firestore en tiempo real
  useEffect(() => {
    if (chatId && user) {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageFirestore = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as {
          id: string;
          text: string;
          sender: string;
          senderEmail: string;
        }[];
        setMessages(messageFirestore);
      });

      return () => unsubscribe();
    }
  }, [chatId, user]);

  useEffect(() => {
    if (!user || !chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const unreadQuery = query(
      messagesRef,
      where("senderEmail", "!=", user.email),
      where("read", "==", false),
    );

    const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
      if (!snapshot.empty) {
        // Si hay mensajes no leídos, los marca como leídos
        snapshot.docs.forEach(async (messagedoc) => {
          const messageRef = doc(
            db,
            "chats",
            chatId,
            "messages",
            messagedoc.id,
          );
          await updateDoc(messageRef, { read: true });
        });
      }
    });

    return () => unsubscribe();
  }, [chatId, user, dispatch]);

  // Enviar mensaje a Firestore
  const sendMessage = async () => {
    if (message.trim() && chatId && user && userDetails) {
      try {
        const senderUsername = await getUsernameByEmail(user.email);
        const messagesRef = collection(db, "chats", chatId, "messages");
        const otherUserEmail = userDetails.email;

        // Enviar mensaje
        await addDoc(messagesRef, {
          text: message,
          sender: senderUsername,
          senderEmail: user.email,
          recipientEmail: otherUserEmail,
          read: false,
          createdAt: serverTimestamp(),
        });

        setMessage("");
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
      }
    } else {
      console.error(
        "No se pueden enviar mensajes: faltan datos del usuario o del chat.",
      );
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50 p-0 md:p-4">
      <div className="w-full max-w-3xl h-full md:h-[90vh] bg-white md:shadow-2xl md:rounded-2xl flex flex-col overflow-hidden border-x md:border border-gray-200">
        {/* Header del Chat */}
        <div className="flex items-center px-4 md:px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
          <button
            onClick={() => navigate("/home")}
            className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center flex-1 gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
              {userDetails?.photoURL ? (
                <img
                  src={userDetails.photoURL}
                  alt={userDetails.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 text-gray-400">
                  <UserIcon />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg leading-tight">
                {userDetails?.username || "Usuario"}
              </h2>
              <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>{" "}
                En línea
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <FobjIcon color="#001F54" height="24" />
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#f8f9fa] custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm">
                Envía un mensaje para iniciar la conversación
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderEmail === user.email;
              return (
                <div
                  key={msg.id}
                  className={`flex w-full group ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[85%] md:max-w-[70%] flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    {!isMine && (
                      <span className="text-xs text-gray-400 mb-1 ml-1">
                        {msg.sender}
                      </span>
                    )}

                    <div className="flex items-center gap-2 relative">
                      {/* Botón eliminar para mis mensajes (visible en hover en desktop, siempre en móvil si se toca) */}
                      {isMine && (
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all absolute -left-10"
                          title="Eliminar mensaje"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Burbuja de mensaje */}
                      <div
                        className={`px-4 py-2.5 shadow-sm relative ${
                          isMine
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                            : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Campo de entrada y botón */}
        <div className="p-3 md:p-4 bg-white border-t border-gray-200">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-1.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escribe un mensaje..."
              className="w-full bg-transparent p-2.5 max-h-32 min-h-[44px] resize-none focus:outline-none text-gray-700 text-[15px]"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-3 rounded-xl mb-0.5 flex-shrink-0 transition-colors ${
                message.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-5 h-5 translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">
              Presiona Enter para enviar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
