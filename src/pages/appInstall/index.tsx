import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/customButton";
import FobjIcon from "../../icons/fobjIcon";
import { useAuth } from "../../context/authContext";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type AppInstallProps = {
  onContinue?: () => void;
};

const AppInstall: React.FC<AppInstallProps> = ({ onContinue }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const isIos = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (onContinue) onContinue();
    };
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, [onContinue]);

  const handleInstall = async () => {
    if (isIos) {
      setShowIosHelp(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === "accepted" && onContinue) onContinue();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      return;
    }
    if (user) {
      navigate("/home");
      return;
    }
    navigate("/");
  };

  const isInstallAvailable = Boolean(deferredPrompt) || isIos;

  return (
    <div className="md:hidden min-h-screen w-full bg-backgroundcolor flex flex-col items-center justify-center px-7 py-10">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <FobjIcon color={"#001F54"} />
        </div>

        <h1 className="text-primary text-[28px] font-semibold text-center uppercase">
          Instalá la app
        </h1>
        <p className="text-whiteBG text-center mt-3 text-base">
          Para una mejor experiencia, instalá FOBJ en tu teléfono.
        </p>

        <div className="w-full mt-10">
          <Button
            text="Instalar"
            bgColor="bg-secondary"
            textColor="text-backgroundcolor"
            onClick={handleInstall}
            loading={isInstalling}
            disabled={!isInstallAvailable || isInstalling}
          />
        </div>

        {showIosHelp && (
          <div className="w-full mt-5 text-center text-inputText text-sm">
            Abrí el menú de compartir y elegí “Agregar a pantalla de inicio”.
          </div>
        )}

        <div
          className="mt-10 text-secondary cursor-pointer hover:underline text-base"
          onClick={handleContinue}
        >
          Continuar desde el navegador
        </div>
      </div>
    </div>
  );
};

export default AppInstall;
