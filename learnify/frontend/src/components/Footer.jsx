import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#cecdcd] text-black py-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="md:flex md:justify-between md:items-start border-b border-gray-600 pb-6">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-lg font-semibold">
              Our mission is to provide everyone in the world with access to free, quality education.
            </h2>
            <p className="mt-4 text-black">
              We are a non-profit organization. <span className="font-semibold text-black">Donate</span> or{" "}
              <span className="font-semibold text-black">volunteer today</span>!
            </p>
          </div>

          {/* Links Section */}
          <div className="md:flex md:gap-12">
            <div>
              <h3 className="text-black font-semibold">About</h3>
              <ul className="mt-2 text-black space-y-2">
                <li>News</li>
                <li>Our Team</li>
                <li>Our Employees</li>
                <li>Supporters</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold">Contact</h3>
              <ul className="mt-2 text-black space-y-2">
                <li>Help Center</li>
                <li>Support Community</li>
                <li>Press</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold">Courses</h3>
              <ul className="mt-2 text-black space-y-2">
                <li>Mathematics</li>
                <li>Computer Science</li>
                <li>Economy & Finance</li>
                <li>Arts & Humanities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="md:flex md:justify-between md:items-center mt-6">
          {/* Language Selector */}
          <div className="mt-4 md:mt-0">
            <label className="text-black">Language:</label>
            <select className="ml-2 p-1 bg-gray-300 text-black rounded">
              <option>English</option>
              <option>German</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          {/* Social Media */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <i className="fab fa-facebook text-2xl"></i>
            <i className="fab fa-twitter text-2xl"></i>
            <i className="fab fa-instagram text-2xl"></i>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-black text-sm mt-6">
          © {new Date().getFullYear()} Your Education Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
