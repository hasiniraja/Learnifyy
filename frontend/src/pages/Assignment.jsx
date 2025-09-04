import React, { useState, useEffect } from "react";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const Assignments = () => {
  const [userData, setUserData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async (uid) => {
      if (!uid) return;

      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      
      const assignmentsQuery = query(
        collection(db, "assignments"),
        where("status", "==", "active")
      );
      
      const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
        const assignmentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAssignments(assignmentsData);
      });

      // notifications
      const notificationsQuery = query(
        collection(db, "users", uid, "notifications"),
        where("read", "==", false)
      );
      
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notificationsData);
      });

      setLoading(false);
      return () => {
        unsubscribeAssignments();
        unsubscribeNotifications();
      };
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, auth]);

  const markAsRead = async (notificationId) => {
    await updateDoc(doc(db, "users", auth.currentUser.uid, "notifications", notificationId), {
      read: true
    });
  };

  if (loading) return <h1 className="text-center text-xl">Loading...</h1>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Upcoming Assignments Section*/}
        <div className="p-4 bg-white rounded-xl mt-6">
          <h2 className="text-xl font-bold mb-4 w-4/5 mx-auto">📝 Upcoming Assignments</h2>
          <div className="grid gap-3">
            {assignments.map(assignment => (
              <div key={assignment.id} className="border p-3 rounded-lg w-3/4 mx-auto">
                <h3 className="font-bold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.description}</p>
                <p className="text-sm text-blue-600">Subject: {assignment.subject}</p>
                {assignment.fileUrl && (
                  <a 
                    href={assignment.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 underline block mt-2"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
            
            {assignments.length === 0 && (
              <p className="w-3/4 mx-auto">No upcoming assignments. Enjoy your day! 😊</p>
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Assignments;