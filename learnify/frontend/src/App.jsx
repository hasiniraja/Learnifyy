import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage"; // Import Main Page
import Login from "./pages/Login"; // Import Login Page
import SignUp from "./pages/SignUp";
import Donate from "./pages/Donate";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/donate" element={<Donate />} /> 
      </Routes>
    </Router>
  );
}























