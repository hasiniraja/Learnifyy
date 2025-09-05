import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; 
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const Courses = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userClass, setUserClass] = useState("class_8"); 
  // fetch class
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const classesData = [];
        querySnapshot.forEach((doc) => {
          classesData.push({ id: doc.id, ...doc.data() });
        });
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch subjects 
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!userClass) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, "subjects"), 
          where("classId", "==", userClass)
        );
        
        const querySnapshot = await getDocs(q);
        const subjectsData = [];
        
        querySnapshot.forEach((doc) => {
          subjectsData.push({ id: doc.id, ...doc.data() });
        });
        
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [userClass]);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubject) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, "chapters"), 
          where("subjectId", "==", selectedSubject.id)
        );
        
        const querySnapshot = await getDocs(q);
        const chaptersData = [];
        
        querySnapshot.forEach((doc) => {
          chaptersData.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort chapters by chapter number or title
        chaptersData.sort((a, b) => a.startPage - b.startPage);
        setChapters(chaptersData);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [selectedSubject]);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setCurrentPage(1);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setCurrentPage(1);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setCurrentPage(1);
  };

  // textbook page content
  const renderChapterContent = () => {
    if (!selectedChapter) return null;

    return (
      <div className="bg-white p-8 rounded-xl shadow-lg min-h-[700px]">
        {/* Chapter Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{selectedSubject.textbook}</h2>
          <h3 className="text-xl text-black mt-2">{selectedChapter.chapterName}</h3>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">📖 Content</h3>
          {selectedChapter.content?.map((point, idx) => (
            <p key={idx} className="text-gray-700 text-lg leading-relaxed mb-3">
              {point}
            </p>
          ))}
        </div>

        {/* Exercises */}
        {selectedChapter.exercises?.length > 0 && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">📝 Exercises</h3>
            <ol className="list-decimal pl-6 space-y-3">
              {selectedChapter.exercises.map((ex, idx) => (
                <li key={idx} className="text-gray-700 text-lg">{ex}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Summary */}
        {selectedChapter.summary && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">📌 Summary</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {selectedChapter.summary}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Textbook view
  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Sidebar />
        <div className="ml-64">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToChapters}
              className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              ← Back to Chapters
            </button>
            <div>
              <h1 className="text-2xl font-bold">{selectedSubject.subjectName}</h1>
              <p className="text-gray-600">{selectedChapter.chapterName}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-black text-white flex justify-between items-center">
              <span className="font-semibold">{selectedSubject.textbook}</span>
              <span className="text-sm">Page {currentPage} of {selectedChapter.endPage}</span>
            </div>
            
            <div className="p-8 min-h-[700px]">
              {renderChapterContent()}
            </div>
          </div>
        </div>
        <Chatbot />
      </div>
    );
  }

  // Chapters view
  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Sidebar />
        <div className="ml-64">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToSubjects}
              className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              ← Back to Subjects
            </button>
            <div>
              <h1 className="text-3xl font-bold">{selectedSubject.subjectName}</h1>
              <p className="text-gray-600">{selectedSubject.textbook}</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-10">Loading chapters...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 max-w-4xl">
              {chapters.map((chapter) => (
                <div 
                  key={chapter.id} 
                  className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">📖</span>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{chapter.chapterName}</h2>
                      {chapter.summary && (
                        <div className="mt-4 text-sm text-gray-500">
                          {chapter.summary.substring(0, 100)}...
                        </div>
                      )}
                      <button className="mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md">
                        Read Chapter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Chatbot />
      </div>
    );
  }

  // Main courses view 
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Sidebar />
      <div className="ml-64">
        <h1 className="text-3xl font-bold text-center mb-6">📚 {userClass.replace('_', ' ')} Courses</h1>

        {loading ? (
          <div className="text-center py-10">Loading subjects...</div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {subjects.map((subject) => (
              <div 
                key={subject.id} 
                className="bg-white p-6 rounded-xl shadow-lg flex items-center cursor-pointer hover:shadow-xl transition-shadow w-3/4" // Added w-3/4 for 75% width
                onClick={() => handleSubjectSelect(subject)}
              >
                <span className="text-4xl">{subject.icon || "📚"}</span>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{subject.subjectName}</h2>
                  <p className="text-gray-600">{subject.textbook}</p>
                  <button className="mt-3 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                    View Chapters
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default Courses;