import { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: input }),
      });

      const data = await response.json();
      setMessages([...messages, { text: input, sender: "user" }, { text: data.response, sender: "bot" }]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

return (
    <div>
      {/* Floating Text Above Button */}
      {!isOpen && (
        <p style={{
          position: "fixed", bottom: "75px", right: "25px", backgroundColor: "#000",
          color: "white", padding: "5px 10px", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(255,255,255,0.2)"
        }}>
          Have any doubts?
        </p>
      )}

      {/* Chatbot Button */}
      <button 
        onClick={toggleChatbot} 
        style={{
          position: "fixed", bottom: "20px", right: "20px", backgroundColor: "#000",
          color: "white", border: "2px solid white", borderRadius: "50%", width: "50px", height: "50px",
          fontSize: "20px", cursor: "pointer"
        }}
      >
        💬
      </button>

      {/* Chatbox UI */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "80px", right: "20px", width: "400px", backgroundColor: "#000",
          boxShadow: "0px 0px 10px rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px",
          display: "flex", flexDirection: "column", color: "white"
        }}>
          <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: "10px" }}>Chatbot</div>

          <div style={{ flex: "1", overflowY: "auto", maxHeight: "250px", display: "flex", flexDirection: "column" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#333" : "#555",
                color: "white",
                padding: "8px 12px", borderRadius: "15px", margin: "5px 0", maxWidth: "70%"
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: "10px" }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: "1", padding: "5px", border: "1px solid #555", borderRadius: "5px", backgroundColor: "#222", color: "white" }} 
              placeholder="Type a message..."
            />
            <button 
              onClick={handleSend} 
              style={{ marginLeft: "5px", backgroundColor: "#222", color: "white", border: "1px solid white", padding: "5px 10px", borderRadius: "5px" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );


};

export default Chatbot;





