import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import SignIn from "./pages/login/signIn";
import DefaultBrowser from "./pages/defaultBrowser";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/defaultBrowser" element={<DefaultBrowser />} />
      </Routes>
    </Router>
  );
};

export default App;
