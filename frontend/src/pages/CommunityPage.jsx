import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

export default function CommunityPage() {
  const navigate = useNavigate();

  const chats = [
    {
      name: "Doubts",
      path: "/community/doubts",
      image: "https://plus.unsplash.com/premium_vector-1729139375723-58e85b697b26?q=80&w=2196&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL or import
      description: "Have academic doubts? Get them cleared by peers and mentors!",
    },
    {
      name: "Stressed?",
      path: "/community/stress-relief",
      image: "https://plus.unsplash.com/premium_vector-1682306564247-a8c1a2ecf2d4?q=80&w=2258&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL or import
      description: "Feeling overwhelmed? Join stress-relief discussions and relax.",
    },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow p-10">
        <h1 className="text-3xl font-extrabold mb-6 text-center">Community</h1>

        {/* Chat Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {chats.map((chat, index) => (
            <div key={index} className="flex flex-col items-center space-y-5">
              {/* Enlarged Image */}
              <img
                src={chat.image}
                alt={chat.name}
                className="w-full h-100 object-cover rounded-lg shadow-lg"
              />

              {/* Description */}
              <p className="text-lg text-center px-4">{chat.description}</p>
              
              <button
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
                onClick={() => navigate(chat.path)}
              >
                {chat.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Chatbot />
    </div>
     
  );
}
