import React from "react";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";


const VideoResources = () => {
  const videos = [
    {
      title: "Introduction to Algebra",
      subject: "Mathematics",
      url: "https://www.youtube.com/embed/K8zC3bXIlEw",
    },
    {
      title: "Physics - Laws of Motion",
      subject: "Physics",
      url: "https://www.youtube.com/embed/DzE3B2zI-eE",
    },
    {
      title: "The Solar System",
      subject: "Science",
      url: "https://www.youtube.com/embed/libKVRa01L8",
    },
  ];

  return (
    <div className="flex bg-[#f9f9f9] min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">📚 Educational Video Resources</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {video.subject}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{video.title}</h2>
              <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={video.url}
                  title={video.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default VideoResources;
