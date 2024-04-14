import React from "react";
import HomeIcon from "../../icons/homeIcon";
import ConfigIcon from "../../icons/configIcon";
import FobjIcon from "../../icons/fobjIcon";

const Header: React.FC = () => {
  return (
    <header className="fixed md:sticky md:w-[100vw] z-50 bottom-0 md:rounded-none md:top-0 drop-shadow left-0 bg-backgroundcolor rounded-[20px] rounded-b-none h-[65px] w-full text-white py-4">
      <div className="container mx-auto px-4 custom-header">
        <HomeIcon color="#666464" className="md:order-2" />
        <FobjIcon color="#001F54"className="md:order-1" height="30"/>
        <ConfigIcon color="#666464" className="md:order-3" />
      </div>
    </header>
  );
};

export default Header;
