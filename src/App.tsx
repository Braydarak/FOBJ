import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import SignIn from "./pages/login/signIn";
import Search from "./pages/search";
import ObjectInfo from "./pages/objectInfo";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/Info" element={<ObjectInfo/>} />
      </Routes>
    </Router>
  );
};

export default App;
