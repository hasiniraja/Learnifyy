import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Ensure Firebase is configured
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function CommunityChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, "communityMessages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;
    await addDoc(collection(db, "communityMessages"), {
      text: input,
      sender: user ? user.displayName || "Anonymous" : "Guest",
      uid: user ? user.uid : "guest",
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">
      <h2 className="text-center text-lg font-bold">Community Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.uid === user?.uid ? "items-end" : "items-start"}`}>
            <span className="text-gray-400 text-sm">{msg.sender}</span>
            <div className="p-2 rounded-lg max-w-[70%] text-white" style={{
              backgroundColor: "transparent",
              border: "1px solid #555"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex p-2 border-t border-gray-700">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="flex-1 p-2" 
          style={{ border: "1px solid #555", borderRadius: "5px", backgroundColor: "#222", color: "white" }}
          placeholder="Type a message..." 
        />
        <button 
          onClick={handleSend} 
          className="ml-2" 
          style={{ backgroundColor: "#222", color: "white", border: "1px solid white", padding: "5px 10px", borderRadius: "5px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}



