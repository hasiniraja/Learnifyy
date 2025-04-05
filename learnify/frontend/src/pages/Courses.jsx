import React from "react";

const courses = [
  {
    id: 1,
    title: "Mathematics",
    description: "Algebra, Geometry & Problem Solving",
    icon: "📘",
    progress: 60,
  },
  {
    id: 2,
    title: "Science",
    description: "Physics, Chemistry & Biology",
    icon: "🔬",
    progress: 40,
  },
  {
    id: 3,
    title: "English",
    description: "Grammar, Literature & Composition",
    icon: "📖",
    progress: 70,
  },
  {
    id: 4,
    title: "Social Studies",
    description: "History, Civics & Geography",
    icon: "🌍",
    progress: 30,
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📚 8th Grade Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-xl shadow-lg flex items-center">
            <span className="text-4xl">{course.icon}</span>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md">
                {course.progress > 0 ? "Resume Course" : "Start Course"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold">💬 Student Community</h2>
        <p className="text-gray-600">Join discussions & solve doubts together!</p>
        <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md">
          Join Forum
        </button>
      </div>
    </div>
  );
};

export default Courses;
