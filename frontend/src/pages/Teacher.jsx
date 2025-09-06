import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Chatbot from "../components/Chatbot";

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    subject: "",
    file: null
  });

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
  }, [db, auth]);

  const getStudents = async () => {
    const studentsRef = collection(db, "Users");
    const q = query(studentsRef, where("role", "==", "learner"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.id);
  };

  const addAssignmentNotification = async (assignmentId, title) => {
    try {
      const students = await getStudents();

      const notificationPromises = students.map(async (studentId) => {
        await addDoc(collection(db, "users", studentId, "notifications"), {
          message: `New assignment: ${title}`,
          type: "assignment",
          assignmentId: assignmentId,
          read: false,
          createdAt: serverTimestamp()
        });
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return "";

    const storage = getStorage();
    const fileRef = ref(storage, `assignments/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const createAssignment = async () => {
    try {
      const fileUrl = await uploadFile(assignmentData.file);
      // assignment document
      const assignmentRef = await addDoc(collection(db, "assignments"), {
        title: assignmentData.title,
        description: assignmentData.description,
        subject: assignmentData.subject,
        fileUrl: fileUrl,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: "active"
      });

      // notifications
      await addAssignmentNotification(assignmentRef.id, assignmentData.title);

      // Reset form and close modal
      setShowAssignmentModal(false);
      setAssignmentData({
        title: "",
        description: "",
        subject: "",
        file: null
      });

      alert("Assignment created successfully!");

    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setAssignmentData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  if (loading) return <h1 className="text-center text-xl">Loading...</h1>;

  return (
    <div className="flex">
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
          <div className="p-4 bg-white shadow-md rounded-xl min-h-[200px] flex flex-col ml-10">
            <h2 className="text-xl font-bold">👩‍🏫 Total Students</h2>
            <p className="text-3xl font-bold text-blue-600">{userData?.studentsCount || 0}</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">❓ Pending Queries</h2>
            <p className="text-3xl font-bold text-red-600">{userData?.pendingQueries || 0}</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">📝 Assignments Overview</h2>
            <p className="text-3xl font-bold text-green-600">{userData?.assignmentsCount || 0} assignments</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">📊 Class Progress</h2>
            <p className="text-3xl font-bold text-purple-600">{userData?.classProgress || "0%"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
            Manage Queries
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
            Upload Resources
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
            View Assignments
          </button>

          {/* Create Assignment Button */}
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
          >
            + Create Assignment
          </button>
        </div>

        {/* Assignment Creation Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black text-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Create Assignment</h2>

              <input
                type="text"
                name="title"
                placeholder="Assignment Title"
                className="w-full p-2 border rounded mb-3"
                value={assignmentData.title}
                onChange={handleInputChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                className="w-full p-2 border rounded mb-3"
                rows="3"
                value={assignmentData.description}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full p-2 border rounded mb-3"
                value={assignmentData.subject}
                onChange={handleInputChange}
              />

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Upload PDF (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="w-full p-2 border rounded"
                  onChange={handleFileChange}
                />
                {assignmentData.file && (
                  <p className="text-sm text-green-600 mt-1">
                    File selected: {assignmentData.file.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={createAssignment}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default TeacherDashboard;