import React from "react";
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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname.toLowerCase() === "/register";

  return (
    <div className="flex flex-col min-h-screen w-full bg-backgroundcolor">
      {!isAuthPage && <Header />}

      <main className="flex-grow w-full flex flex-col">
        <Routes>
          <Route path="/" element={<SignIn />} />
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
