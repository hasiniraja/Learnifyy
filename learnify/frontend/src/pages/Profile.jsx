import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login"); // Redirect to login if not logged in
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-lg mt-10 bg-white">
      <h2 className="text-xl font-bold">User Profile</h2>
      <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
      <p><strong>Email:</strong> {auth.currentUser.email}</p>
      <p><strong>Role:</strong> {userData.role}</p>
      <p><strong>Phone:</strong> {userData.phone_no}</p>
      <p><strong>DOB:</strong> {userData.dob.toDate().toLocaleDateString()}</p>
      <p><strong>Education Level:</strong> {userData.education_lvl}</p>
      <button onClick={() => auth.signOut().then(() => navigate("/login"))} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}

