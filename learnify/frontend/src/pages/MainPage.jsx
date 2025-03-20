import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [heroAnimation, setHeroAnimation] = useState(null);
  const [aboutAnimation, setAboutAnimation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/video.json")
      .then((res) => res.json())
      .then((data) => setHeroAnimation(data))
      .catch((err) => console.error("Error loading hero animation:", err));

    fetch("/about.json")
      .then((res) => res.json())
      .then((data) => setAboutAnimation(data))
      .catch((err) => console.error("Error loading about animation:", err));
  }, []);

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
      <motion.div
        className="relative w-full h-screen flex flex-col items-start justify-center px-10 text-left"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="absolute top-10 right-10 w-200">
          {heroAnimation ? <Lottie animationData={heroAnimation} loop={true} /> : <p>Loading...</p>}
        </div>

        <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-4 bg-transparent text-black">
          <h1 className="text-2xl font-bold">Learnify</h1>
          <ul className="hidden md:flex space-x-6">
            <li className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="hover:text-gray-700">
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
           <li><button onClick={() => navigate("/explore")} className="hover:text-gray-700">Explore</button></li>
          <li><button onClick={() => navigate("/contact")} className="hover:text-gray-700">Contact Us</button></li>
          <li><button onClick={() => navigate("/donate")} className="hover:text-gray-700">Donate</button></li>
            </ul>
          <div className="space-x-4">
            <motion.button
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/login")} // Navigate to Login Page
            >
              Log In
            </motion.button>
            <motion.button
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </motion.button>
          </div>
        </nav>

        <motion.div className="max-w-3xl" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1 }}>
          <h1 className="text-6xl font-bold drop-shadow-lg">Empower Learning with AI</h1>
          <p className="text-lg mt-4 drop-shadow-md">Personalized education for every student, powered by cutting-edge AI technology.</p>
          <motion.button className="mt-6 bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-800" whileHover={{ scale: 1.1 }}>
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
      {/* Explore Section with 3D Tilt Cards */}
      <div className="max-w-6xl mx-auto my-10 px-6 text-left">
        <h2 className="text-3xl font-bold mb-4">Explore Trending Topics</h2>
        <div className="flex space-x-4 overflow-x-auto whitespace-nowrap py-4 no-scrollbar">
          {[
            { title: "AI in Education", image: "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWl8ZW58MHx8MHx8fDA%3D" },
            { title: "Mathematics for Beginners", image: "https://media.istockphoto.com/id/1183952376/photo/graph-of-parabola.webp?a=1&b=1&s=612x612&w=0&k=20&c=wjTp2hS-p2VADt_LLs4NHdTWPsouuecBTXM44MwCQH4=" },
            { title: "Physics Masterclass", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGh5c2ljc3xlbnwwfHwwfHx8MA%3D%3D" },
            { title: "Web Development Basics", image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D" },
            { title: "JEE Mains Preparation", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGekaobKGw6pGFjQGYE-wX-5a9L1yuIn-rg&s" },
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
      {/* ABOUT US SECTION */}
      <section id="about" className="relative bg-black text-white py-16 px-6 w-full rounded-l-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>
          <p className="text-lg text-left text-white mt-4 max-w-3xl mx-auto">
          We are dedicated to empowering students through accessible learning
          resources, mentorship, and hands-on projects. Our goal is to make
          education engaging and impactful for everyone.
        </p>
          {/* About Us Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left - Lottie Animation */}
            <div className="flex justify-center items-center">
              {aboutAnimation ? (
                <Lottie animationData={aboutAnimation} className="w-100 h-100" />
              ) : (
                <p className="text-center">Loading animation...</p>
              )}
            </div>

            {/* Right - About Us Text */}
            <div>
              <h3 className="text-2xl font-semibold">Empowering Learners, One Step at a Time</h3>
              <p className="mt-4">
                At Learnify, we believe that education should be engaging, accessible, and innovative. Our mission is to create a learning ecosystem where students, teachers, and professionals can grow together through technology-driven education.
              </p>
              <h3 className="text-2xl font-semibold mt-6">What Sets Us Apart?</h3>
              <ul className="mt-4 space-y-2">
                <li>✅ Interactive and personalized learning experience</li>
                <li>✅ Expert mentors guiding you at every step</li>
                <li>✅ A collaborative and vibrant learning community</li>
                <li>✅ Cutting-edge technology and AI-powered resources</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
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