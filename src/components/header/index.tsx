import React from "react";
import HomeIcon from "../../icons/homeIcon";
import ConfigIcon from "../../icons/configIcon";
import FobjIcon from "../../icons/fobjIcon";
import NotificationIcon from "../../icons/notificationIcon";
import { useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigator = useNavigate();
  const location = useLocation();

  const logoNav = () => navigator("/home");
  const ConfigPage = () => navigator("/config");
  const NotificationPage = () => navigator("/Notifications");

  const getHomeColor = () => {
    if (location.pathname === "/home") {
      return "#477CCF";
    } else {
      return "#666464";
    }
  };
  return (
    <header className="fixed md:sticky md:w-[100vw] z-50 bottom-0 md:top-0 drop-shadow left-0 bg-backgroundcolor rounded-[20px] md:rounded-none h-[65px] w-full text-white py-4">
      <div className="container mx-auto px-4 grid grid-cols-5 md:grid-cols-3 md:gap-4 items-center">
        <div className="flex justify-center">
          <HomeIcon
            color={getHomeColor()}
            onClick={logoNav}
            className="md:hidden"
          />
          <FobjIcon
            color="#001F54"
            height="30"
            onClick={logoNav}
            className="hidden md:block"
          />
        </div>

        {/* Espacio vacío */}
        <div></div>

        <div className="flex justify-center md:hidden">
          <FobjIcon color="#001F54" height="30" onClick={logoNav} />
        </div>

        <div className="flex justify-center  md:hidden">
          <NotificationIcon color="#666464" onClick={NotificationPage}/>
        </div>

        <div className="flex justify-center  md:hidden">
          <ConfigIcon color="#666464" onClick={ConfigPage} />
        </div>

        <div className="hidden md:flex md:items-center md:justify-center md:gap-12 md:w-full ">
          <NotificationIcon color="#666464" onClick={NotificationPage} />
          <ConfigIcon color="#666464" onClick={ConfigPage} />
          <HomeIcon color={getHomeColor()} onClick={logoNav} />
          
        </div>
      </div>
    </header>
  );
};

export default Header;
