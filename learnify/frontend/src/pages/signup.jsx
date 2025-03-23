import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Lottie from "lottie-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function SignUp() {
  const navigate = useNavigate(); // Initialize navigation
  const [userType, setUserType] = useState("learner");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    educationLevel: "",
    subject: ""
  });
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/signup_video.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful! 🎉 Redirecting to login...");
        navigate("/login"); // Redirect to login page
      } else {
        alert(`Signup Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup Failed: Server error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFC]">
       {/* Header */}
       <Header />
      {/* Left Side - Sign Up Form */}
      <div className="w-full mt-10 md:w-1/2 h-full flex items-center justify-center p-6">
        <div className="w-full max-w-lg p-10 rounded-2xl shadow-lg bg-white">
          <h2 className="text-4xl font-bold mb-6 text-center">Sign Up</h2>
          <div className="flex justify-center mb-6">
            <button 
              className={`px-5 py-2 text-lg font-semibold border-b-2 ${userType === "learner" ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-500"}`} 
              onClick={() => setUserType("learner")}
            >
              Learner
            </button>
            <button 
              className={`px-5 py-2 text-lg font-semibold border-b-2 ${userType === "teacher" ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-500"}`} 
              onClick={() => setUserType("teacher")}
            >
              Teacher
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-3">
              <input type="text" name="firstName" placeholder="First Name" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required />
              <input type="text" name="lastName" placeholder="Last Name" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            {userType === "learner" && (
              <div className="mb-4 flex space-x-3">
                <input type="date" name="dob" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required />
                <select name="educationLevel" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required>
                  <option value="">Education Level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            )}
            {userType === "teacher" && (
              <div className="mb-4">
                <input type="text" name="subject" placeholder="Subject" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
              </div>
            )}
            <button type="submit" className="w-full bg-black text-white py-3 text-lg rounded-lg hover:bg-gray-600 transition">
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-lg text-gray-600">
            Already have an account? <a href="/login" className="text-black font-bold">Login</a>
          </p>
        </div>
      </div>

      {/* Right Side - Animation */}
      <div className="w-full md:w-1/2 h-1/3 md:h-full flex items-center justify-center">
        {animationData ? (
          <Lottie animationData={animationData} className="w-full h-[80%] max-w-2xl" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

