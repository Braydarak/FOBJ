import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { getDocs, getDoc, query, where, collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  return context;
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signUp = async (email, password, additionalData) => {

      // Verifica si el nombre de usuario ya existe en Firestore
  const usernameQuery = query(
    collection(firestore, "users"),
    where("username", "==", additionalData.username)
  );
  const usernameSnapshot = await getDocs(usernameQuery);

  if (!usernameSnapshot.empty) {
    // Si se encuentra un usuario con el mismo nombre, lanza un error
    throw new Error("El nombre de usuario ya está en uso.");
  }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const createdUser = userCredential.user;

    // Guardar datos adicionales en Firestore
    await setDoc(doc(firestore, "users", createdUser.uid), {
      email,
      ...additionalData,
    });

    return createdUser;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);


  //GoogleAhut
  const checkUserAdditionalData = async (userId) => {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    if (userDoc.exists()) {
      const { firstName, username } = userDoc.data();
      return Boolean(firstName && username);
    }
    return false;
  };

  const loginWhitGoogle = async () => {
    const GoogleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, GoogleProvider);
    const user = result.user;


    const hasAdditionalData = await checkUserAdditionalData(user.uid);
    if (hasAdditionalData) {
      navigate('/home');
    } else {
      navigate('/config');
    }
  };


  //FacebookAhut
  const loginWithFacebook = async () => {
    const FacebookProvider = new FacebookAuthProvider();
    FacebookProvider.addScope('email');
    FacebookProvider.setCustomParameters({
      display: 'popup',
    });
    
    try {
      const result = await signInWithPopup(auth, FacebookProvider);
      const user = result.user;

      const hasAdditionalData = await checkUserAdditionalData(user.uid);
      if (hasAdditionalData) {
        navigate("/home");
      } else {
        navigate("/config");
      }
    } catch (error) {
      console.error("Error during Facebook login:", error);

      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        if (email) {
          const providers = await fetchSignInMethodsForEmail(auth, email);
          if (providers.includes("google.com")) {
            throw new Error(
              "Ya existe una cuenta con esta dirección de correo electrónico. Por favor, inicia sesión con Google."
            );
          } else if (providers.includes("password")) {
            throw new Error(
              "Ya existe una cuenta con esta dirección de correo electrónico. Por favor, inicia sesión con correo electrónico y contraseña."
            );
          }
        }
      } else if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        throw new Error(
          "La ventana emergente de inicio de sesión se cerró antes de completarse."
        );
      } else {
        throw new Error(
          "Ocurrió un error inesperado durante el inicio de sesión con Facebook."
        );
      }
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { displayName, email, photoURL } = currentUser;
        setUser({ displayName, email, photoURL });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <authContext.Provider
      value={{
        signUp,
        login,
        user,
        logout,
        loading,
        loginWhitGoogle,
        loginWithFacebook,
        resetPassword,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
