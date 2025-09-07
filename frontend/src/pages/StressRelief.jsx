import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const StressRelief = () => {
  const [mood, setMood] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const getMotivation = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/motivate", { mood });
      setResponse(res.data.message);
    } catch (err) {
      setResponse("Sorry, something went wrong. Try again!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <Sidebar />
      <h1 className="text-2xl font-bold mb-4">Feeling Stressed? </h1>

      <textarea
        className="w-full max-w-md p-3 border rounded mb-3"
        rows="3"
        placeholder="Tell me what’s stressing you..."
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />

      <button
        onClick={getMotivation}
        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Motivation"}
      </button>

      {response && (
        <div className="mt-4 p-4 bg-white shadow-md rounded max-w-md text-center">
          <p>{response}</p>
        </div>
      )}
      <Chatbot />
    </div>
  );
};

export default StressRelief;
