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
    (state) => (state as any).notifications.hasUnread
  );

  useEffect(() => {
    if (!user) {
      dispatch(setHasUnread(false));
      return;
    }

    const messagesQuery = query(
      collectionGroup(firestore, "messages"),
      where("recipientEmail", "==", user.email),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const unreadFound = !snapshot.empty;
      dispatch(setHasUnread(unreadFound));
    });

    return () => unsubscribe();
  }, [user, dispatch]);

  const getHomeColor = () => {
    if (location.pathname === "/home") {
      return "#477CCF";
    } else {
      return "#666464";
    }
  };

  const notificationColor = hasUnreadNotifications ? "#FF0000" : "#666464";

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
          <NotificationIcon
            color={notificationColor}
            onClick={NotificationPage}
          />
        </div>

        <div className="flex justify-center  md:hidden">
          <ConfigIcon color="#666464" onClick={ConfigPage} />
        </div>

        <div className="hidden md:flex md:items-center md:justify-center md:gap-12 md:w-full ">
          <NotificationIcon
            color={notificationColor}
            onClick={NotificationPage}
          />
          <ConfigIcon color="#666464" onClick={ConfigPage} />
          <HomeIcon color={getHomeColor()} onClick={logoNav} />
        </div>
      </div>
    </header>
  );
};

export default Header;
