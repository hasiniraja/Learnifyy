import React, { useState } from "react";

export default function DonatePage() {
  const [donation, setDonation] = useState(10);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cause, setCause] = useState("Scholarships");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your donation! Your support means the world.");
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100">
      {/* Motivational Section with Rounded Bottom */}
      <div className="relative bg-black text-white text-center py-40 px-4 rounded-b-[50%] md:rounded-b-[50%] lg:rounded-b-[30%]">
        <h1 className="text-4xl font-extrabold">Make an Impact Today</h1>
        <p className="text-lg mt-3 max-w-3xl mx-auto">
          Your generosity fuels education, empowers young minds, and changes
          lives forever. Every donation counts—be the reason someone smiles today.
        </p>
      </div>

      {/* Donation Form */}
      <div className="max-w-3xl mx-auto bg-white p-10 mt-10 shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Donate Now
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Choose an amount and a cause you care about.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Donation Amount ($)</label>
            <input
              type="number"
              value={donation}
              onChange={(e) => setDonation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Choose a Cause</label>
            <select
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-balack outline-none"
            >
              <option value="Scholarships">Scholarships</option>
              <option value="Learning Materials">Learning Materials</option>
              <option value="Tech Development">Tech Development</option>
              <option value="General Support">General Support</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition transform hover:scale-105"
          >
            Donate Now 💚
          </button>
        </form>

        {/* Thank You Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-semibold">"Every act of kindness creates a ripple of change. Thank you!"</p>
        </div>
      </div>
    </div>
  );
}







