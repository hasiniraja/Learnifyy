import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar"; // Adjust path if needed

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
        console.log("Fetched User Data:", userDoc.data());
        setUserData(userDoc.data());
      } else {
        console.log("No user document found in Firestore.");
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

  if (loading) return <h1>Loading...</h1>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px" }}>
        <h1>Welcome, {userData ? `${userData.first_name.trim()} ${userData.last_name}` : "User"}!</h1>
      </div>
    </div>
  );
};

export default Profile;
