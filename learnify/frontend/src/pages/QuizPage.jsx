import { useState } from "react";
import axios from "axios";

const QuizPage = () => {
    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchQuiz = async () => {
        if (!topic) return alert("Please enter a topic!");

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5001/generate-quiz", { topic });
            setQuestions(response.data.questions || []);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            alert("Failed to fetch quiz. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">AI-Generated Quiz</h1>
            <input
                type="text"
                placeholder="Enter a topic (e.g., Physics, History)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full max-w-md mb-4"
            />
            <button
                onClick={fetchQuiz}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Quiz"}
            </button>

            {questions.length > 0 && (
                <div className="mt-6 w-full max-w-lg bg-white shadow-md p-4 rounded">
                    <h2 className="text-xl font-semibold mb-3">Quiz Questions</h2>
                    <ul className="list-disc pl-5">
                        {questions.map((q, index) => (
                            <li key={index} className="mb-2">{q}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
