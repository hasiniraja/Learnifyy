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
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
app.get("/", (req, res) => {
  res.send("Server is running!");
});

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
    const { topic } = req.body;
    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    const accessToken = accessTokenResponse.token; // ✅ Extract the token string
    const API_URL = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-pro:predict`;
    const response = await axios.post(
      API_URL,
      {
        instances: [
          { 
            prompt: `Generate 5 quiz questions on ${topic}. Return each question on a new line. Example: What is the capital of France?` 
          }
        ],
        parameters: { 
          temperature: 0.7, 
          maxOutputTokens: 1024 
        },
      },
      {
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${accessToken}` 
        },
      }
    );
    if (!response.data.predictions || response.data.predictions.length === 0) {
      throw new Error("No predictions returned from Vertex AI");
    }

    const generatedText = response.data.predictions[0].content;
    const quizQuestions = generatedText.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim());
    res.json({ questions: quizQuestions });

  } catch (error) {
    console.error("Error generating quiz:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: "Failed to generate quiz.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Books route
const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;
app.get("/api/books/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}`;
    const response = await fetch(googleBooksUrl);
    const data = await response.json();
    res.json(data.items || []);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_no, role, dob, education_lvl } = req.body;
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered!" });
    }
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${first_name} ${last_name}`,
    });
    await db.collection("Users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      first_name,
      last_name,
      phone_no,
      role, 
      dob: admin.firestore.Timestamp.fromDate(new Date(dob)),
      education_lvl,
      createdAt: admin.firestore.Timestamp.now(),
    });
    res.status(202).json({ message: "User signed up successfully!", user: userRecord });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Chatbot route
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