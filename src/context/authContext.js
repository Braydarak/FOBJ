import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
 } from "firebase/auth";
import { auth } from "../firebase";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext)
  return context;
}

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const loginWhitGoogle = () =>{
    const GoogleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, GoogleProvider);
  }

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    })
  }, []);

  return <authContext.Provider value={{ signUp, login, user, logout, loading, loginWhitGoogle }}>{children}</authContext.Provider>;
}
