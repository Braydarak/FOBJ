import React, { useState } from "react";
import FobjIcon from "../../../icons/fobjIcon";
import CustomInput from "../../../components/customInput";
import Button from "../../../components/customButton";
import LogoCircle from "../../../components/logoCircle";
import GoogleIcon from "../../../icons/googleIcon/googleIcon";
import LoginImg from "../../../assets/webp/login-img.webp";
import AppleIcon from "../../../icons/appleIcon/appleIcon";
import FacebookIcon from "../../../icons/facebookIcon/facebookIcon";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../firebase";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  // const navigator = useNavigate();

  function signInWithGoogle() {
    signInWithRedirect(auth, provider);
    console.log('todo ok')
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignIn = () => {
    console.log("Iniciar sesión con:", email, password);
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

        <form className="w-full flex justify-center items-center flex-col h-screen gap-6 relative md:mt-10 md:gap-8">
          <CustomInput
            placeholder="Email"
            label="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <CustomInput
            placeholder="Contraseña"
            type="password"
            label="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            underlabel="Olvidaste la contraseña?"
          />

          <Button
            text={"Iniciar sesión"}
            textColor={"text-backgroundcolor"}
            bgColor={"bg-secondary"}
            disabled={false}
            onClick={handleSignIn}
          />

          <div className="flex justify-around items-center w-full">
            <div className="bg-inputBorder border border-inputs w-[25%] md:w-[30%] h-[1px]"></div>
            <span className="text-[15px] text-center font-normal text-inputs md:text-xl">
              O conéctese con
            </span>
            <div className="bg-inputBorder border border-inputs w-[25%] md:w-[30%] h-[1px]"></div>
          </div>
          <div className="w-full flex justify-center">
            <LogoCircle logoComponent={<GoogleIcon />} onClick={signInWithGoogle}/>
            <LogoCircle logoComponent={<AppleIcon />} />
            <LogoCircle logoComponent={<FacebookIcon />} />
          </div>
          <div className="w-full flex justify-center items-center text-base md:text-xl">
            <span className="text-inputs mr-2">No tenes cuenta?</span>
            <span className="text-secondary cursor-pointer hover:underline">
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
