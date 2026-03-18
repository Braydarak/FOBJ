import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import store from "./reducers/store";
import { AuthProvider } from "./context/authContext";

import Home from "./pages/Home";
import SignIn from "./pages/login/signIn";
import AppInstall from "./pages/appInstall";
import Search from "./pages/search";
import ObjectInfo from "./pages/objectInfo";
import ConfigPage from "./pages/config";
import ReportPage from "./pages/report";
import Register from "./pages/login/register";
import CardDetailsView from "./pages/search/cardDetailsView";
import MyObjects from "./pages/myobjects";
import CardDetailsUser from "./pages/myobjects/cardDetailsUser";
import Chat from "./pages/chat";
import NotificationsPage from "./pages/notification";
import ProtectedRoute from "./components/protectRoute/protectRoute";
import Header from "./components/header";
import Footer from "./components/footer";
import ScrollToTop from "./components/scrollToTop";

const RootEntry: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [skipInstall, setSkipInstall] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const displayModeMedia = window.matchMedia("(display-mode: standalone)");
    const sync = () => {
      const iosStandalone = Boolean((window.navigator as any).standalone);
      setIsStandalone(displayModeMedia.matches || iosStandalone);
    };

    sync();
    displayModeMedia.addEventListener("change", sync);
    return () => displayModeMedia.removeEventListener("change", sync);
  }, []);

  if (isMobile && !isStandalone && !skipInstall) {
    return <AppInstall onContinue={() => setSkipInstall(true)} />;
  }

  return <SignIn />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname.toLowerCase() === "/register";
  const isChatPage = location.pathname.toLowerCase().startsWith("/chat");
  const hideHeader = isAuthPage || (isMobile && isChatPage);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-backgroundcolor">
      {!hideHeader && <Header />}

      <main className="flex-grow w-full flex flex-col">
        <Routes>
          <Route path="/" element={<RootEntry />} />
          <Route path="/Register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/info" element={<ObjectInfo />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/cardDetailsView/:id" element={<CardDetailsView />} />
            <Route path="/myObjects" element={<MyObjects />} />
            <Route
              path="/cardDetailsUser/:collectionName/:itemid"
              element={<CardDetailsUser />}
            />
            <Route path="/chat" element={<Chat />} />
            <Route path="/Notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </main>

      {!isAuthPage && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Provider store={store}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Provider>
    </Router>
  );
};

export default App;
