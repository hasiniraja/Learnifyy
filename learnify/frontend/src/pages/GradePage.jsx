import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";

const GradePage = () => {
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
        {/* Grade Info */}
        <div className="bg-blue-100 p-8 rounded-2xl shadow-md text-center ml-10">
          <h1 className="text-4xl font-bold text-blue-700">
            🎓 Grade {userData?.grade || "8"}
          </h1>
          <p className="text-lg text-gray-700 mt-3">
            You have completed <strong>{userData?.progress || "0%"}</strong> of this grade!
          </p>
        </div>

        {/* Subject Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {userData?.subjects?.map((subject, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-xl">
              <h2 className="text-xl font-bold">📘 {subject.name}</h2>
              <p className="mt-2">Progress: {subject.progress || "0%"}</p>
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="bg-blue-600 h-2 rounded"
                  style={{ width: subject.progress }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Lessons */}
        <div className="p-4 bg-white shadow-md rounded-xl mt-6">
          <h2 className="text-xl font-bold">📚 Recommended Learning</h2>
          <p className="mt-2">Next: {userData?.nextLesson || "No upcoming lesson"}</p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
            Continue Learning
          </button>
        </div>

        {/* Assignments */}
        <div className="p-4 bg-white shadow-md rounded-xl mt-6">
          <h2 className="text-xl font-bold">📝 Upcoming Assignments</h2>
          <ul className="mt-2">
            {userData?.assignments?.length > 0 ? (
              userData.assignments.map((assignment, index) => (
                <li key={index} className="text-gray-700">
                  {assignment.title} - Due {assignment.dueDate}
                </li>
              ))
            ) : (
              <p>No upcoming assignments.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GradePage;
