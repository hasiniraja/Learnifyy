import React from "react";
import Sidebar from "../components/Sidebar";

const ResourcePage = () => {
  const subjects = [
    { name: "Mathematics", pdf: "/pdfs/math.pdf" },
    { name: "Science", pdf: "/pdfs/science.pdf" },
    { name: "Social Studies", pdf: "/pdfs/social-studies.pdf" },
    { name: "English", pdf: "/pdfs/english.pdf" },
    { name: "Hindi", pdf: "/pdfs/hindi.pdf" },
    { name: "Computer Science", pdf: "/pdfs/computer-science.pdf" },
  ];

  return (
    <div className="p-6 ml-10">
              <Sidebar />
        
      <h1 className="text-2xl font-bold mb-4">8th Grade Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{subject.name}</h2>
            <a
              href={subject.pdf}
              download
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcePage;
