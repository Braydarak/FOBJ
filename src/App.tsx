import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import SignIn from "./pages/login/signIn";
import Search from "./pages/search";
import ObjectInfo from "./pages/objectInfo";
import ConfigPage from "./pages/config";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info" element={<ObjectInfo />} />
        <Route path="/config" element={<ConfigPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
