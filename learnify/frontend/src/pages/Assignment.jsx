import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Assignments = () => {
  // Dummy data for assignments
  const submittedAssignments = [
    { id: 1, title: "Math Homework", subject: "Mathematics", date: "March 20, 2025" },
    { id: 2, title: "Science Report", subject: "Science", date: "March 18, 2025" }
  ];

  const upcomingAssignments = [
    { id: 3, title: "History Essay", subject: "History", date: "March 30, 2025" },
    { id: 4, title: "Physics Lab", subject: "Physics", date: "April 2, 2025" }
  ];

  const overdueAssignments = [
    { id: 5, title: "English Composition", subject: "English", date: "March 15, 2025" }
  ];

  // File Upload State
  const [file, setFile] = useState(null);

  // Handle File Upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Calculate Days Left for Upcoming Assignments
  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Due today!";
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
        <Sidebar />
      <h1 className="text-4xl font-bold text-center mb-6">📚 Assignments</h1>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <p className="font-bold">Assignment Progress:</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${(submittedAssignments.length / (submittedAssignments.length + upcomingAssignments.length + overdueAssignments.length)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submitted Assignments */}
        <div className="bg-green-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">✅ Submitted</h2>
          {submittedAssignments.length > 0 ? (
            submittedAssignments.map((assignment) => (
              <div key={assignment.id} className="p-3 bg-white rounded-lg shadow mb-2">
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.subject} | {assignment.date}</p>
              </div>
            ))
          ) : (
            <p>No submitted assignments</p>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-blue-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📅 Upcoming</h2>
          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-3 bg-white rounded-lg shadow mb-2">
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.subject} | {assignment.date}</p>
                <p className="text-sm text-red-500">{getDaysLeft(assignment.date)}</p>
              </div>
            ))
          ) : (
            <p>No upcoming assignments</p>
          )}
        </div>

        {/* Overdue Assignments */}
        <div className="bg-red-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">⚠️ Overdue</h2>
          {overdueAssignments.length > 0 ? (
            overdueAssignments.map((assignment) => (
              <div key={assignment.id} className="p-3 bg-white rounded-lg shadow mb-2">
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.subject} | {assignment.date}</p>
              </div>
            ))
          ) : (
            <p>No overdue assignments</p>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📂 Submit an Assignment</h2>
        <input type="file" onChange={handleFileChange} className="p-2 border rounded-lg" />
        {file && <p className="mt-2 text-sm text-gray-600">File selected: {file.name}</p>}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Upload</button>
      </div>
    </div>
  );
};

export default Assignments;
