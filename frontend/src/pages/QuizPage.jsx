import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot"; // Make sure this is imported

const QuizPage = () => {
    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchQuiz = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.post(
                "http://localhost:5000/generate-quiz", 
                { topic },
                // { withCredentials: true } // Include this if using credentials
            );
            
            if (response.data.questions && response.data.questions.length > 0) {
                setQuestions(response.data.questions);
            } else {
                setError("No questions generated. Please try a different topic.");
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            setError(error.response?.data?.error || "Failed to fetch quiz. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ml-64"> {/* Adjust margin for sidebar */}
                <h1 className="text-3xl font-bold mb-6">AI-Generated Quiz</h1>
                
                <div className="w-full max-w-md mb-4">
                    <input
                        type="text"
                        placeholder="Enter a topic (e.g., Physics, History)"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="p-3 border border-gray-300 rounded w-full mb-2"
                        onKeyPress={(e) => e.key === 'Enter' && fetchQuiz()}
                    />
                    <button
                        onClick={fetchQuiz}
                        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                        disabled={loading}
                    >
                        {loading ? "Generating Quiz..." : "Generate Quiz"}
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 mb-4 p-3 bg-red-50 rounded w-full max-w-md">
                        {error}
                    </div>
                )}

                {questions.length > 0 && (
                    <div className="mt-6 w-full max-w-2xl bg-white shadow-md p-6 rounded">
                        <h2 className="text-2xl font-semibold mb-4">Quiz Questions on {topic}</h2>
                        <ul className="space-y-3">
                            {questions.map((q, index) => (
                                <li key={index} className="p-3 bg-gray-50 rounded border">
                                    <strong>Q{index + 1}:</strong> {q}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <Chatbot />
            </div>
        </div>
    );
};

export default QuizPage;