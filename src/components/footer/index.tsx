import React from "react";
import FobjIcon from "../../icons/fobjIcon";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-auto pb-24 md:pb-6 pt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo y Descripción */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="cursor-pointer" onClick={() => navigate("/home")}>
              <FobjIcon color="#001F54" height="40" />
            </div>
            <p className="text-gray-500 text-sm text-center md:text-left max-w-xs">
              Tu plataforma de confianza para reportar y encontrar objetos
              perdidos en la comunidad.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-12">
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-semibold text-primary mb-1">Navegación</h3>
              <span
                className="text-sm text-gray-600 hover:text-secondary cursor-pointer transition-colors"
                onClick={() => navigate("/home")}
              >
                Inicio
              </span>
              <span
                className="text-sm text-gray-600 hover:text-secondary cursor-pointer transition-colors"
                onClick={() => navigate("/search")}
              >
                Buscar Objeto
              </span>
              <span
                className="text-sm text-gray-600 hover:text-secondary cursor-pointer transition-colors"
                onClick={() => navigate("/report")}
              >
                Reportar Objeto
              </span>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-semibold text-primary mb-1">Legal</h3>
              <span className="text-sm text-gray-600 hover:text-secondary cursor-pointer transition-colors">
                Términos y Condiciones
              </span>
              <span className="text-sm text-gray-600 hover:text-secondary cursor-pointer transition-colors">
                Política de Privacidad
              </span>
              <span className="text-sm text-gray-600 hover:text-secondary cursor-pointer transition-colors">
                Ayuda
              </span>
            </div>
          </div>
        </div>

        {/* Línea Divisoria y Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} FOBJ. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
