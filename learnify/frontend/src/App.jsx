import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage"; // Import Main Page
import Login from "./pages/Login"; // Import Login Page
import SignUp from "./pages/SignUp";
import Header from "./components/Header"; 
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/header" element={<Header />} /> 
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}























