import React, { useState } from "react";
import FobjIcon from "../../../icons/fobjIcon";
import CustomInput from "../../../components/customInput";
import Button from "../../../components/customButton";
import LogoCircle from "../../../components/logoCircle";
import GoogleIcon from "../../../icons/googleIcon/googleIcon";
import FacebookIcon from "../../../icons/facebookIcon/facebookIcon";
import ErrorComponent from "../../../components/error";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

const Register: React.FC = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp, loginWhitGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!user.email.trim() || !user.password.trim() || !user.confirmPassword.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await signUp(user.email, user.password);
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

  const handleGoogleSignIn = async () => {
    try {
      await loginWhitGoogle();
    } catch (error) {
      setError("No se pudo continuar con Google");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (error: any) {
      setError(error.message || "No se pudo continuar con Facebook");
    }
  };

  return (
    <div className="login-desktop overflow-y-hidden h-screen w-full drop-shadow-sm md:flex">
      <div className="hidden md:flex relative flex-1 h-screen">
        <video
          className="w-full h-full object-cover"
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute bottom-8 left-0 w-full flex justify-center drop-shadow-md">
          <FobjIcon color={"#FFFFFF"} />
        </div>
      </div>

      <div className="w-full md:w-[40%] md:flex-none flex flex-col h-screen px-7 py-7 md:px-14 justify-between items-center">
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
          className="w-full flex justify-center items-center flex-col flex-1 gap-6 relative md:mt-10 md:gap-8"
        >
          {verified && (
            <ErrorComponent textColor="text-successGreen" message={verified} />
          )}
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
            <LogoCircle
              logoComponent={<FacebookIcon />}
              onClick={handleFacebookLogin}
            />
          </div>
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
