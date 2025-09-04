// utils/notificationUtils.js
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addAssignmentNotification = async (studentId, assignmentId, title) => {
  const db = getFirestore();
  await addDoc(collection(db, "users", studentId, "notifications"), {
    message: `New assignment: ${title}`,
    type: "assignment",
    assignmentId: assignmentId,
    read: false,
    createdAt: serverTimestamp()
  });
};