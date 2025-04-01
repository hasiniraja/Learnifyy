import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert("Please enter a topic!");

    try {
      const response = await axios.post("http://localhost:5001/generate-quiz", { topic });
      setQuiz(response.data.quiz);
      setUserAnswers({});
      setSubmitted(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Try again!");
    }
  };

  const handleSelectAnswer = (questionIndex, option) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: option });
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">AI-Generated Quiz</h1>
        
        {/* Input for Topic */}
        <div className="mb-4">
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Enter topic (e.g., Physics, JavaScript, History)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
            onClick={handleGenerateQuiz}
          >
            Generate Quiz
          </button>
        </div>

        {/* Quiz Questions */}
        {quiz.length > 0 && (
          <div>
            {quiz.map((q, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="font-semibold">{index + 1}. {q.question}</h2>
                <div className="mt-2">
                  {q.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      className={`block w-full p-2 mt-1 border rounded 
                        ${submitted
                          ? option === q.correctAnswer
                            ? "bg-green-300"
                            : userAnswers[index] === option
                            ? "bg-red-300"
                            : "bg-white"
                          : userAnswers[index] === option
                          ? "bg-blue-200"
                          : "bg-white"}`}
                      onClick={() => handleSelectAnswer(index, option)}
                      disabled={submitted}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Show Explanation After Submitting */}
                {submitted && (
                  <p className="mt-2 text-sm text-gray-700">
                    <strong>Correct Answer:</strong> {q.correctAnswer}
                    <br />
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            {!submitted && (
              <button
                className="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-700"
                onClick={handleSubmitQuiz}
              >
                Submit Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
