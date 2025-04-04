import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App: React.FC = () => {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/info" element={<ObjectInfo />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/cardDetailsView/:id" element={<CardDetailsView />} />
            <Route path="/myObjects" element={<MyObjects />} />
            <Route path="/cardDetailsUser/:collectionName/:itemid" element={<CardDetailsUser />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/Notifications" element={<NotificationsPage />} />
          </Routes>
        </AuthProvider>
      </Provider>
    </Router>
  );
};

export default App;
