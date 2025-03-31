import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function CommunityPage() {
  const navigate = useNavigate();

  const chats = [
    { name: "Doubts", path: "/community/doubts" },
    { name: "Stressed?", path: "/community/stress-relief" },
  ];

  return (
    
    <div className="p-5">
      
      <h1 className="text-2xl font-bold mb-4 ml-10">Community</h1>
      <Sidebar />
      <div className="space-y-4">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="p-4 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-700"
            onClick={() => navigate(chat.path)}
          >
            {chat.name}
          </div>
        ))}
      </div>
    </div>
  );
}



