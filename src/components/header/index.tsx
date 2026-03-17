import React, { useEffect } from "react";
import HomeIcon from "../../icons/homeIcon";
import ConfigIcon from "../../icons/configIcon";
import FobjIcon from "../../icons/fobjIcon";
import NotificationIcon from "../../icons/notificationIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import { setHasUnread } from "../../reducers/notifications/notificationsSlice";

const Header: React.FC = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const logoNav = () => navigator("/home");
  const ConfigPage = () => navigator("/config");
  const NotificationPage = () => navigator("/Notifications");
  const hasUnreadNotifications = useSelector(
    (state: any) => state.notifications.hasUnread,
  );

  useEffect(() => {
    if (!user) {
      dispatch(setHasUnread(false));
      return;
    }

    const messagesQuery = query(
      collectionGroup(firestore, "messages"),
      where("recipientEmail", "==", user.email),
      where("read", "==", false),
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const unreadFound = !snapshot.empty;
      dispatch(setHasUnread(unreadFound));
    });

    return () => unsubscribe();
  }, [user, dispatch]);

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const getIconColor = (path: string) =>
    isActive(path) ? "#477CCF" : "#666464";

  return (
    <header className="fixed md:sticky z-50 bottom-0 md:top-0 left-0 w-full bg-[#FFFFFF]/90 backdrop-blur-md md:bg-[#FFFFFF] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.08)] md:shadow-sm border-t md:border-b md:border-t-0 border-[#E5E7EB] rounded-t-[24px] md:rounded-none h-[70px] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Lado Izquierdo (Logo) */}
        <div
          className="flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105 h-full"
          onClick={logoNav}
        >
          {/* Logo versión Móvil */}
          <div className="md:hidden flex items-center justify-center">
            <FobjIcon color="#001F54" height="28" />
          </div>
          {/* Logo versión Desktop */}
          <div className="hidden md:flex items-center justify-center">
            <FobjIcon color="#001F54" height="35" />
          </div>
        </div>

        {/* Lado Derecho (Iconos de Navegación) */}
        <div className="flex items-center gap-1 md:gap-6 h-full">
          {/* Icono Home */}
          <div
            className={`relative flex flex-col items-center justify-center w-14 md:w-16 h-full cursor-pointer group transition-all duration-300 ${isActive("/home") ? "-translate-y-1" : "hover:-translate-y-1"}`}
            onClick={logoNav}
          >
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${isActive("/home") ? "bg-[#EBF2FA]" : "group-hover:bg-[#F3F4F6]"}`}
            >
              <HomeIcon color={getIconColor("/home")} />
            </div>
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1 absolute bottom-1.5 transition-all duration-300 ${isActive("/home") ? "bg-secondary scale-100" : "bg-transparent scale-0"}`}
            ></div>
          </div>

          {/* Icono Notificaciones */}
          <div
            className={`relative flex flex-col items-center justify-center w-14 md:w-16 h-full cursor-pointer group transition-all duration-300 ${isActive("/notifications") ? "-translate-y-1" : "hover:-translate-y-1"}`}
            onClick={NotificationPage}
          >
            <div
              className={`relative p-2 rounded-xl transition-all duration-300 ${isActive("/notifications") ? "bg-[#EBF2FA]" : "group-hover:bg-[#F3F4F6]"}`}
            >
              <NotificationIcon color={getIconColor("/notifications")} />
              {hasUnreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF0000] rounded-full border-2 border-[#FFFFFF] animate-pulse"></span>
              )}
            </div>
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1 absolute bottom-1.5 transition-all duration-300 ${isActive("/notifications") ? "bg-secondary scale-100" : "bg-transparent scale-0"}`}
            ></div>
          </div>

          {/* Icono Configuración */}
          <div
            className={`relative flex flex-col items-center justify-center w-14 md:w-16 h-full cursor-pointer group transition-all duration-300 ${isActive("/config") ? "-translate-y-1" : "hover:-translate-y-1"}`}
            onClick={ConfigPage}
          >
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${isActive("/config") ? "bg-[#EBF2FA]" : "group-hover:bg-[#F3F4F6]"}`}
            >
              <ConfigIcon color={getIconColor("/config")} />
            </div>
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1 absolute bottom-1.5 transition-all duration-300 ${isActive("/config") ? "bg-secondary scale-100" : "bg-transparent scale-0"}`}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
