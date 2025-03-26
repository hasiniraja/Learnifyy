import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // React Router's navigation

  const handleLogout = async () => {
    const auth = getAuth(); // Get Firebase Auth instance
    try {
      await signOut(auth); // Sign out the user
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="relative">
      {/* Hamburger Button - Hidden when sidebar is open */}
      {!isOpen && (
        <button
          className="p-2 text-black fixed top-4 left-4 z-50"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={28} />
        </button>
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Sidebar Header with Close Button */}
        <div className="p-5 flex items-center justify-between border-b">
          <span className="text-lg font-bold">Learnify</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* Sidebar Links */}
        <ul className="p-5 space-y-4 text-lg">
          <li><Link to="/" className="hover:text-blue-500">🏠 Dashboard</Link></li>
          <li><Link to="/grades" className="hover:text-blue-500">📊 Grades</Link></li>
          <li><Link to="/courses" className="hover:text-blue-500">📚 Courses</Link></li>
          <li><Link to="/assignments" className="hover:text-blue-500">📝 Assignments</Link></li>
          <li><Link to="/schedule" className="hover:text-blue-500">📅 Schedule</Link></li>
          <li><Link to="/resources" className="hover:text-blue-500">📂 Resources</Link></li>
          <li><Link to="/messages" className="hover:text-blue-500">💬 Messages</Link></li>
          <li><Link to="/profile" className="hover:text-blue-500">👤 Profile</Link></li>
          <li><Link to="/settings" className="hover:text-blue-500">⚙️ Settings</Link></li>
        </ul>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-5 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800 text-lg"
          >
            <LogOut size={22} className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
