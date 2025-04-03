import React from "react";
import Sidebar from "../components/Sidebar";

const VideoResources = () => {
  const videos = [
    {
      title: "Introduction to Algebra",
      url: "https://www.youtube.com/embed/K8zC3bXIlEw",
    },
    {
      title: "Physics - Laws of Motion",
      url: "https://www.youtube.com/embed/DzE3B2zI-eE",
    },
    {
      title: "The Solar System",
      url: "https://www.youtube.com/embed/libKVRa01L8",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 ml-10">📚 Video Resources</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <div className="mt-3">
                <iframe
                  className="w-full h-48 rounded-lg"
                  src={video.url}
                  title={video.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoResources;
