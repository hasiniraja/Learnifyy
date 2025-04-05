import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PredictionServiceClient } from "@google-cloud/aiplatform"; // ✅ FIXED
import axios from "axios";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };


const app = express();

// Update CORS to allow your frontend's origin (adjust as needed)
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const API_KEY = process.env.GOOGLE_API_KEY;
const CX_CODE = process.env.GOOGLE_CX_CODE;

const API_URL = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/${process.env.VERTEX_MODEL_NAME}:predict`;

// Securely load your Gemini API key from the environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in your .env file.");
  process.exit(1);
}

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(apiKey);



// IMPORTANT: Set the model and API version. Adjust if necessary.
// Here, we use "v1" for the API version. If that fails, try "v1beta" after verifying which version is supported.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", apiVersion: "v1" });

/* Default route for testing */
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//news
app.get("/search", async (req, res) => {
    try {
        const query = req.query.q; // Get search term from frontend
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

//quiz
app.post("/generate-quiz", async (req, res) => {
    try {
        const { topic } = req.body;

        const response = await axios.post(
            API_URL,
            {
                instances: [{ prompt: `Generate 5 quiz questions on ${topic}.` }],
                parameters: { temperature: 0.7, maxOutputTokens: 256 },
            },
            { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.VERTEX_AI_KEY}` } }
        );

        const quizQuestions = response.data.predictions;
        res.json({ questions: quizQuestions });
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Failed to generate quiz." });
    }
});


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

/* API to handle user signup (unchanged) */
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_no, role, dob, education_lvl } = req.body;

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

    // Store user details in Firestore inside "Users" collection
    await db.collection("Users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      first_name,
      last_name,
      phone_no,
      role, // Example: "student" or "teacher"
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

/* API to handle chatbot messages using Gemini AI */
app.post("/chatbot", async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Message cannot be empty!" });
    }

    console.log("Received chatbot request:", userMessage);

    // Use the pre-initialized model to generate content
    const result = await model.generateContent(userMessage);
    console.log("Gemini API result:", result);

    // Ensure we have a valid response
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

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

