import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async (uid) => {
      if (!uid) return;
      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db]);

  if (loading) return <h1 className="text-center text-xl">Loading...</h1>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Teacher Dashboard Banner */}
        <div className="bg-blue-100 ml-10 p-8 min-h-100 rounded-2xl flex items-center gap-6 shadow-md">
          <img 
            src="https://cdn.dribbble.com/userupload/28472650/file/original-e1cac84e6e35172828981cd18f09e253.gif" 
            alt="Teacher" 
            className="w-70 h-70 ml-10 rounded-full" 
          />
          <div>
            <h1 className="text-6xl font-bold text-blue-700">
              Welcome back, {userData?.first_name || "Teacher"}!
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              You're managing <strong>{userData?.studentsCount || 0}</strong> students today. Keep up the great work! 📚
            </p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Total Students */}
          <div className="p-4 bg-white shadow-md rounded-xl min-h-[200px] flex flex-col ml-10">
            <h2 className="text-xl font-bold">👩‍🏫 Total Students</h2>
            <p className="text-3xl font-bold text-blue-600">{userData?.studentsCount || 0}</p>
          </div>

          {/* Pending Queries */}
          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">❓ Pending Queries</h2>
            <p className="text-3xl font-bold text-red-600">{userData?.pendingQueries || 0}</p>
          </div>

          {/* Assignments Overview */}
          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">📝 Assignments Overview</h2>
            <p className="text-3xl font-bold text-green-600">{userData?.assignmentsCount || 0} assignments</p>
          </div>

          {/* Class Progress */}
          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">📊 Class Progress</h2>
            <p className="text-3xl font-bold text-purple-600">{userData?.classProgress || "0%"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Manage Queries
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
            Upload Resources
          </button>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            View Assignments
          </button>
        </div>
      </div>
      <Chatbot /> 
    </div>
  );
};

export default TeacherDashboard;
