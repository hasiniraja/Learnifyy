import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";

const Profile = () => {
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
        <div className="bg-pink-100 ml-10 p-6 rounded-2xl flex items-center gap-6 shadow-md">
          <img 
            src="https://cdn.vectorstock.com/i/500p/07/06/cute-little-girl-playing-laptop-cartoon-vector-54570706.avif" 
            alt="User" 
            className="w-20 h-20 rounded-full" 
          />
          <div>
            <h1 className="text-2xl font-bold text-pink-700">Welcome back, {userData?.first_name || "User"}!</h1>
            <p className="text-gray-600 mt-2">
              You've learned <strong>{userData?.progress || "0%"}</strong> of your goal this week! Keep it up and improve your results!
            </p>
          </div>
        </div>

        {/* Earned Badges */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-bold">🏆 Earned Badges</h2>
          <div className="flex gap-4 mt-3">
            {userData?.badges?.length > 0 ? (
              userData.badges.map((badge, index) => (
                <div key={index} className="bg-yellow-200 p-2 rounded-md text-center text-sm">
                  {badge}
                </div>
              ))
            ) : (
              <p>No badges earned yet.</p>
            )}
          </div>
        </div>

        {/* Completed Videos */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-bold">🎥 Completed Videos</h2>
          <p className="mt-2">{userData?.completedVideos || 0} lessons completed</p>
        </div>

        {/* Continue Learning */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-bold">📚 Continue Learning</h2>
          <p className="mt-2">Next Lesson: {userData?.nextLesson || "No upcoming lesson"}</p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Continue</button>
        </div>

        {/* Upcoming Assignments */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-bold">📝 Upcoming Assignments</h2>
          <ul className="mt-2">
            {userData?.assignments?.length > 0 ? (
              userData.assignments.map((assignment, index) => (
                <li key={index} className="text-gray-700">{assignment.title} - Due {assignment.dueDate}</li>
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

export default Profile;