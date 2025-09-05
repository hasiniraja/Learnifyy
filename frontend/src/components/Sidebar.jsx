
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    const auth = getAuth(); 
    try {
      await signOut(auth); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="relative">
      {/* Hamburger Button */}
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
          <div className="flex items-center space-x-1">
            <img src="/learnify1.png" alt="Logo" className="h-7 w-auto -mt-1" />
            <span className="text-2xl font-bold tracking-wide">earnify</span>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>


        {/* Sidebar Links */}
        <ul className="p-5 space-y-4 text-lg">
          <li><Link to="/profile" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>👤 Profile</Link></li>
          <li><Link to="/gradepage" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>📊 Grades</Link></li>
          <li><Link to="/courses" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>📚 Courses</Link></li>
          <li><Link to="/assignments" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>📝 Assignments</Link></li>
          <li><Link to="/resources" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>📂 Resources</Link></li>
          <li><Link to="/community" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>💬 Community</Link></li>
          <li><Link to="/quiz" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>❔ Quizzes</Link></li>
          <li><Link to="/video-resources" className="hover:text-blue-500" onClick={() => setIsOpen(false)} >  🎥 Video Resources</Link></li>
          <li><Link to="/news" className="hover:text-blue-500" onClick={() => setIsOpen(false)} >  📰 News</Link></li>

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
