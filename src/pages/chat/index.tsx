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
} from "firebase/firestore";
import FobjIcon from "../../icons/fobjIcon";
import { useAuth } from "../../context/authContext";

const Chat = () => {
  const location = useLocation();
  const { chatId, userDetails} = location.state || {};
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string; senderEmail: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  
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

  // Enviar mensaje a Firestore
  const sendMessage = async () => {
    if (message.trim() && chatId && user) {
      try {
        const senderUsername = await getUsernameByEmail(user.email);
        const messagesRef = collection(db, "chats", chatId, "messages");

        // Enviar mensaje
        await addDoc(messagesRef, {
          text: message,
          sender: senderUsername,
          senderEmail: user.email,
          read: false,
          createdAt: serverTimestamp(),
        });

        
        setMessage("");
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-backgroundcolor">
      <div className="md:max-w-[75%] w-full h-full bg-white shadow-lg rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
          <FobjIcon
            color="#001F54"
            height="30"
            onClick={() => navigate("/home")}
          />
          <div className="w-10 h-10 rounded-full flex justify-center items-center bg-secondary text-white">
          {userDetails?.username || "U"}
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderEmail === user.email ? "justify-end" : "justify-start" 
              }`}
            >
              <div
                className="p-2 rounded-lg shadow-md max-w-[80%] bg-secondary text-backgroundcolor" 
              >
                <p className="font-bold">
                  {msg.senderEmail === user.email ? "Tu:" :`${msg.sender}:`}{" "}
                </p>
                <p>{msg.text}</p>
                {msg.senderEmail === user.email && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-xs text-gray-300 hover:text-white mt-1"
                    title="Eliminar mensaje"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        

        {/* Campo de entrada y botón */}
        <div className="p-4 border-t border-gray-300 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Mensaje..."
            className="w-full p-3 bg-backgroundcolor rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-3 bg-secondary text-backgroundcolor rounded-lg hover:bg-primary-dark"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
