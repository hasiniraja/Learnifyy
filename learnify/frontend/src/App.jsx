import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage"; // Import Main Page
import Login from "./pages/Login"; // Import Login Page
import SignUp from "./pages/SignUp";
import Header from "./components/Header"; 
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";
import CommunityPage from "./pages/CommunityPage";
import Assignment from "./pages/Assignment";
import ChatRoom from "./pages/ChatRoom";
import Resources from "./pages/Resources";
import QuizPage from "./pages/QuizPage";




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
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:chatId" element={<ChatRoom />} />
        <Route path="/assignments" element={<Assignment />} />
        <Route path="/resources" element={<Resources />} />
         <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}
























