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
        <p
          style={{
            position: "fixed",
            bottom: "75px",
            right: "30px",
            backgroundColor: "#2C2F33",
            color: "white",
            padding: "6px 12px",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          Need Help? Chat Now!
        </p>
      )}

      {/* Chatbot Button */}
      <button
        onClick={toggleChatbot}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#5865F2",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          transition: "0.3s",
        }}
      >
        💬
      </button>

      {/* Chatbox UI */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "400px",
            backgroundColor: "#2C2F33",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            color: "white",
            transition: "all 0.3s ease",
          }}
        >
          {/* Chatbot Header */}
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid #444",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Chatbot
            <button
              onClick={toggleChatbot}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages Box */}
          <div
            style={{
              flex: "1",
              overflowY: "auto",
              maxHeight: "250px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "5px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#7289DA" : "#444",
                  color: "white",
                  padding: "10px",
                  borderRadius: "15px",
                  margin: "3px 0",
                  maxWidth: "75%",
                  fontSize: "14px",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && <p style={{ textAlign: "center", fontStyle: "italic", color: "#BBB" }}>Bot is typing...</p>}

          {/* Input Field */}
          <div style={{ display: "flex", marginTop: "10px", gap: "6px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: "1",
                padding: "8px",
                border: "1px solid #555",
                borderRadius: "8px",
                backgroundColor: "#23272A",
                color: "white",
                fontSize: "14px",
              }}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#444" : "#7289DA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "0.2s",
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;





