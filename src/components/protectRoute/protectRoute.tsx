import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext"; 
import Loader from "../loader";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader 
          width="w-[60px]"   
          height="h-[60px]" 
          logoSize="40" 
        />
      </div>
    ); 
  }
  // Si terminó de cargar y no hay usuario, lo mandamos al SignIn
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, le permitimos ver la ruta que solicitó
  return <Outlet />;
};

export default ProtectedRoute;