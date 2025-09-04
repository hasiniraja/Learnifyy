// utils/assignmentUtils.js
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createAssignment = async (assignmentData, teacherId) => {
  const db = getFirestore();
  const assignmentRef = await addDoc(collection(db, "assignments"), {
    ...assignmentData,
    dueDate: new Date(assignmentData.dueDate),
    createdBy: teacherId,
    createdAt: serverTimestamp(),
    status: "active"
  });
  return assignmentRef.id;
};

export const getAssignments = async () => {
  const db = getFirestore();
  const assignmentsQuery = query(collection(db, "assignments"));
  const snapshot = await getDocs(assignmentsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};