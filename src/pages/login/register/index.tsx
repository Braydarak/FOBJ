import React, { useState } from "react";
import FobjIcon from "../../../icons/fobjIcon";
import CustomInput from "../../../components/customInput";
import Button from "../../../components/customButton";
import LoginImg from "../../../assets/webp/login-img.webp";
import ErrorComponent from "../../../components/error";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";


import { useAuth } from "../../../context/authContext";

const Register: React.FC = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    username: "",
    firstName: "",
    lastName: "",
    city: "",
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

 const capitalizedValue = ["username", "firstName", "lastName", "city"].includes(name)
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value;

    setUser((user) => ({
      ...user,
      [name]: capitalizedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validación para campos obligatorios
  for (const key in user) {
    if (user[key as keyof typeof user].trim() === "") {
      setError("Todos los campos son obligatorios.");
      return;
    }
  }

    if (user.password !== user.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {

       // Verifica si el nombre de usuario ya existe en Firestore
       const usernameQuery = query(
        collection(firestore, "users"),
        where("username", "==", user.username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        setError("El nombre de usuario ya está en uso.");
        return; // Detener el flujo si el nombre de usuario está en uso
      }


      await signUp(user.email, user.password, {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        phoneNumber: user.phoneNumber,
      });
      setVerified("Te registraste correctamente. Redirigiendo...");
      setTimeout(() => {
        setError(null);
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        const errorCode = (err as any).code;
        let errorMessage = err.message;

        switch (errorCode) {
          case "auth/invalid-email":
            errorMessage = "El correo electrónico es inválido.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "El correo electrónico ya está en uso.";
            break;
          case "auth/weak-password":
            errorMessage =
              "La contraseña debe tener un minimo de 6 caracteres.";
            break;
          default:
            errorMessage = "Debes ingresar mail y contraseña.";
        }

        setError(errorMessage);
      } else {
        setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    }
  };
  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="login-desktop overflow-y-hidden h-screen w-full drop-shadow-sm">
      <div className="hidden md:flex relative">
        <img alt="login-img" src={LoginImg} className=" bg-cover w-full" />
      </div>

      <div className="flex flex-col h-screen overflow-y-auto px-7 py-7 md:px-14 justify-between items-center">
        <header className="flex justify-center items-center w-full flex-col">
          <h2 className="uppercase text-[32px] md:text-[54px] font-semibold text-primary">
            Registrate
          </h2>
          <span className="text-[14px] md:text-[20px] text-whiteBG text-center">
            ¡Inscríbete para encontrar lo que buscas!
          </span>
        </header>

        <form
          onSubmit={handleSubmit}
          className="w-full flex mt-10 mb-10 items-center flex-col h-screen gap-0 relative md:gap-0"
        >
          {verified  && <ErrorComponent textColor="text-successGreen" message={verified} />}
          {error && <ErrorComponent  message={error} />}
          <CustomInput
            placeholder="Nombre de Usuario"
            label="Nombre de Usuario"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Nombre"
            label="Nombre"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Apellido"
            label="Apellido"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Ciudad"
            label="Ciudad"
            name="city"
            value={user.city}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Email"
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
           <CustomInput
            placeholder="Teléfono"
            label="Teléfono"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Contraseña"
            type="password"
            label="Contraseña"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Confirmar Contraseña"
            type="password"
            label="Confirmar Contraseña"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
          />
          

          <Button
            text={"Registrarme"}
            textColor={"text-backgroundcolor"}
            bgColor={"bg-secondary"}
            disabled={false}
          />
          <div className="w-full flex justify-center items-center text-base md:text-xl">
            <span className="text-inputs mr-2">Ya tienes una cuenta?</span>
            <span
              className="text-secondary cursor-pointer hover:underline"
              onClick={handleLogin}
            >
              Iniciar sesión
            </span>
          </div>
        </form>

        <footer className="justify-center flex bottom-0 left-0 w-full md:hidden mt-3">
          <FobjIcon color={"#001F54"} />
        </footer>
      </div>
    </div>
  );
};

export default Register;
