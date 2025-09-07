import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import { GoogleAuth } from 'google-auth-library';

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
};
app.use(cors(corsOptions)); 
app.options('*', cors(corsOptions));
app.use(express.json()); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in your .env file.");
  process.exit(1);
}

const API_KEY = process.env.NEWS_API_KEY;
const CX_CODE = process.env.GOOGLE_CX_CODE;
app.get("/search", async (req, res) => {
    try {
        const query = req.query.q; 
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
        const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX_CODE}&key=${API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Quiz route

app.post("/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const effectiveDifficulty = difficulty || "medium";

    const prompt = `
    Generate 5 quiz questions on the topic "${topic}" at "${effectiveDifficulty}" level.

    Return ONLY valid JSON (no explanations, no code fences) in this format:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "answer": "string"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // --- Step 1: Clean code fences if Gemini wrapped it ---
    responseText = responseText.replace(/```json|```/g, "").trim();

    let quizQuestions = [];
    try {
      quizQuestions = JSON.parse(responseText);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message);
      return res.status(500).json({ error: "Invalid quiz format from AI", raw: responseText });
    }

    res.json({ questions: quizQuestions });
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

// Motivation route
app.post("/motivate", async (req, res) => {
  try {
    const { mood } = req.body; 
    
    const prompt = `
    Persona: Act as an empathetic and highly supportive mentor. Your tone should be warm, gentle, and non-judgmental. Avoid "fix-it" commands.

    Context: The user is a student feeling overwhelmed. They need comfort and a simple, low-effort coping mechanism. The student's message is: "${mood}".

    Task: Generate a response with two components:
    1. Validation and Encouragement: Start by acknowledging their feelings and offer a brief message of reassurance (1-2 sentences).
    2. Actionable Micro-Tip: Provide one simple action the student can perform in under 60 seconds for immediate relief (e.g., a grounding technique, a quick stretch, progressive muscle relaxation).

    Constraint: Keep the entire response concise (under 100 words) so it's easy to absorb.
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ message: responseText });
  } catch (error) {
    console.error("Motivation Error:", error);
    res.status(500).json({ error: "Failed to fetch motivation." });
  }
});



// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_no, role, dob, education_lvl, subject } = req.body;

    // Check if email already exists
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered!" });
    }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${first_name} ${last_name}`,
    });

    // Prepare user data for Firestore
    const userData = {
      uid: userRecord.uid,
      first_name,
      last_name,
      phone_no,
      role,
      createdAt: admin.firestore.Timestamp.now(),
    };

    // Add fields based on user type
    if (role === 'learner') {
      // Convert dob to Firestore Timestamp for learners
      let dobTimestamp = null;
      if (dob) {
        dobTimestamp = admin.firestore.Timestamp.fromDate(new Date(dob));
      }
      
      userData.dob = dobTimestamp;
      userData.education_lvl = education_lvl;
      
    } else if (role === 'teacher') {
      userData.subject = subject;
    }

    // Store user details in Firestore
    await db.collection("Users").doc(userRecord.uid).set(userData);

    res.status(202).json({ message: "User signed up successfully!", user: userRecord });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Chatbot route
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); 
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/chatbot", async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Message cannot be empty!" });
    }
    const result = await model.generateContent(userMessage);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process chatbot request!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));