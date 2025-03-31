require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Allow frontend origins
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));
app.use(bodyParser.json());

// Firebase Admin Initialization
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Google Gemini AI Initialization
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in your .env file.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", apiVersion: "v1" });

// Google Books API Route
const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;
if (!googleBooksApiKey) {
  console.error("GOOGLE_BOOKS_API_KEY is not set in your .env file.");
  process.exit(1);
}

app.get("/api/books/search", async (req, res) => {
  try {
    const query = req.query.q || req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}`;
    const response = await fetch(googleBooksUrl);
    const data = await response.json();

    if (!data.items) {
      return res.status(404).json({ error: "No books found" });
    }

    res.json(data.items);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Chatbot API
app.post("/chatbot", async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Message cannot be empty!" });
    }

    console.log("Received chatbot request:", userMessage);
    const result = await model.generateContent(userMessage);
    console.log("Gemini API result:", result);

    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini API.");
    }

    const responseText = result.response.text();
    res.json({ response: responseText });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chatbot request!" });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
