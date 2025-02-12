import React, { useState } from "react";
import CustomInput from "../../../components/customInput";
import Button from "../../../components/customButton";
import LogoCircle from "../../../components/logoCircle";
import GoogleIcon from "../../../icons/googleIcon/googleIcon";
import FacebookIcon from "../../../icons/facebookIcon/facebookIcon";
import LoginImg from "../../../assets/webp/login-img.webp";
import ErrorComponent from "../../../components/error";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import FobjIcon from "../../../icons/fobjIcon";

const SignIn: React.FC = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { login, loginWhitGoogle, loginWithFacebook ,resetPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<string | null>(null);
  const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);
  const [isLoggingInWithFacebook, setIsLoggingInWithFacebook] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoggingInWithGoogle|| isLoggingInWithFacebook) return;

    setError("");
    try {
      await login(user.email, user.password);
      navigate("/home");
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
              "La contraseña debe tener un mínimo de 6 caracteres.";
            break;
          default:
            errorMessage = "El correo o contraseña ingresada no existe.";
        }

        setError(errorMessage);
      } else {
        setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingInWithGoogle(true);
      await loginWhitGoogle();
      setIsLoggingInWithGoogle(false);
      navigate("/home");
    } catch (error) {
      setError("No se pudo iniciar sesión con Google");
      setIsLoggingInWithGoogle(false);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      setIsLoggingInWithFacebook(true);
      await loginWithFacebook();
      setIsLoggingInWithFacebook(false);
      navigate("/home");
    } catch (error: any) {
      console.error("Error during Facebook login:", error);
      setError(error.message); // Muestra el mensaje de error al usuario
      setIsLoggingInWithFacebook(false);
    }
  };
  

  const handleRegister = () => {
    navigate("/register");
  };

  const handleUnderlabelClick = async () => {
    if (!user.email) return setError("Por favor ingresa tu email");

    try {
      const resetResult = await resetPassword(user.email);

      if (resetResult.success) {
        setVerified("Te hemos enviado un email de confirmación");
      } else {
        if (resetResult.error.code === "auth/user-not-found") {
          setError("No hay ninguna cuenta registrada con este correo electrónico.");
        } else {
          setError("Error al enviar el email de restablecimiento de contraseña.");
        }
      }
    } catch (error) {
      setError("Error al restablecer la contraseña.");
    }
  };

  return (
    <div className="login-desktop overflow-y-hidden h-screen w-full drop-shadow-sm">
      <div className="hidden md:flex relative">
        <img alt="login-img" src={LoginImg} className=" bg-cover w-full" />
      </div>

      <div className="flex flex-col h-screen px-7 py-7 md:px-14 justify-between items-center">
        <header className="flex justify-center items-center w-full flex-col">
          <h2 className="uppercase text-[32px] md:text-[54px] font-semibold text-primary">
            Bienvenido
          </h2>
          <span className="text-[14px] md:text-[20px] text-whiteBG">
            ¡Hola! Bienvenido, te hemos echado de menos.
          </span>
        </header>

        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center items-center flex-col h-screen gap-6 relative md:mt-10 md:gap-8"
        >
          {verified && <ErrorComponent textColor="text-successGreen" message={verified} />}
          {error && <ErrorComponent message={error} />}
          <CustomInput
            placeholder="Email"
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <CustomInput
            placeholder="Contraseña"
            type="password"
            label="Contraseña"
            name="password"
            value={user.password}
            onChange={handleChange}
            underlabel="Olvidaste la contraseña?"
            onUnderlabelClick={handleUnderlabelClick}
          />

          <Button
            text={"Iniciar sesión"}
            textColor={"text-backgroundcolor"}
            bgColor={"bg-secondary"}
            disabled={false}
          />

          <div className="flex justify-around items-center w-full">
            <div className="bg-inputBorder border border-inputs w-[25%] md:w-[30%] h-[1px]"></div>
            <span className="text-[15px] text-center font-normal text-inputs md:text-xl">
              O conéctese con
            </span>
            <div className="bg-inputBorder border border-inputs w-[25%] md:w-[30%] h-[1px]"></div>
          </div>
          <div className="w-full flex justify-center">
            <LogoCircle
              logoComponent={<GoogleIcon />}
              onClick={handleGoogleSignIn}
            />
            <LogoCircle logoComponent={<FacebookIcon />} onClick={handleFacebookLogin} />
          </div>
          <div className="w-full flex justify-center items-center text-base md:text-xl">
            <span className="text-inputs mr-2">No tenes cuenta?</span>
            <span
              className="text-secondary cursor-pointer hover:underline"
              onClick={handleRegister}
            >
              Crear Cuenta
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

export default SignIn;
