import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";

export default function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  // Load JSON file from public folder
  useEffect(() => {
    fetch("/video.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full min-h-screen text-black">
      {/* Hero Section */}
      <motion.div
        className="relative w-full h-screen flex flex-col items-start justify-center px-10 text-left"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* 3D Animation in Right Corner */}
        <div className="absolute top-10 right-10 w-200">
          {animationData ? <Lottie animationData={animationData} loop={true} /> : <p>Loading...</p>}
        </div>

        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-4 bg-transparent text-black">
          <h1 className="text-2xl font-bold">Learnify</h1>
          <ul className="hidden md:flex space-x-6">
            {/* Courses Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:text-gray-700"
              >
                Courses ▼
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#ebebeb] text-black rounded-lg shadow-lg z-50">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {[...Array(12).keys()].map((i) => (
                      <button key={i} className="px-4 py-2 hover:bg-gray-200 text-left">
                        Grade {i + 1}
                      </button>
                    ))}
                    <button className="px-4 py-2 hover:bg-gray-200 text-left">JEE Mains</button>
                    <button className="px-4 py-2 hover:bg-gray-200 text-left">JEE Advanced</button>
                    <button className="px-4 py-2 hover:bg-gray-200 text-left">UPSC</button>
                  </div>
                </div>
              )}
            </li>
            <li><a href="#" className="hover:text-gray-700">Explore</a></li>
            <li><a href="#" className="hover:text-gray-700">Contact Us</a></li>
            <li><a href="#" className="hover:text-gray-700">Donate</a></li>
          </ul>
        </nav>

        {/* Hero Content */}
        <motion.div className="max-w-3xl" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1 }}>
          <h1 className="text-6xl font-bold drop-shadow-lg">Empower Learning with AI</h1>
          <p className="text-lg mt-4 drop-shadow-md">
            Personalized education for every student, powered by cutting-edge AI technology.
          </p>
          <motion.button
            className="mt-6 bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-800"
            whileHover={{ scale: 1.1 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
       {/* Explore Section with 3D Tilt Cards */}
      <div className="max-w-6xl mx-auto my-10 px-6 text-left">
        <h2 className="text-3xl font-bold mb-4">Explore Trending Topics</h2>
        <div className="flex space-x-4 overflow-x-auto whitespace-nowrap py-4 no-scrollbar">
          {[
            { title: "AI in Education", image: "https://source.unsplash.com/300x200/?ai,education" },
            { title: "Mathematics for Beginners", image: "https://source.unsplash.com/300x200/?math" },
            { title: "Physics Masterclass", image: "https://source.unsplash.com/300x200/?physics" },
            { title: "Web Development Basics", image: "https://source.unsplash.com/300x200/?coding" },
            { title: "JEE Mains Preparation", image: "https://source.unsplash.com/300x200/?students,study" },
          ].map((topic, index) => (
            <Tilt key={index} options={{ max: 15, scale: 1.05, speed: 500 }}>
              <div className="min-w-[300px] bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-200">
                <img src={topic.image} alt={topic.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{topic.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">Explore courses and resources</p>
                  <button className="mt-3 text-black hover:text-gray-700">Learn More →</button>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-200 text-black py-6 text-left px-10">
        <p>© 2025 Learnify. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-gray-700 hover:text-black mx-2">Privacy Policy</a> |
          <a href="#" className="text-gray-700 hover:text-black mx-2">Terms of Service</a> |
          <a href="#" className="text-gray-700 hover:text-black mx-2">Contact</a>
        </div>
      </footer>
    </div>
  );
}






















