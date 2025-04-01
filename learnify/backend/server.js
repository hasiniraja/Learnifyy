require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PredictionServiceClient } = require("@google-cloud/aiplatform");


const app = express();

// Update CORS to allow your frontend's origin (adjust as needed)
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Securely load your Gemini API key from the environment variables
const apiKey = process.env.GEMINI_API_KEY;
const vertexApiEndpoint = process.env.VERTEX_AI_ENDPOINT;
const projectId = process.env.GCP_PROJECT_ID;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in your .env file.");
  process.exit(1);
}
if (!projectId || !vertexApiEndpoint) {
  console.error("GCP_PROJECT_ID or VERTEX_AI_ENDPOINT is missing in your .env file.");
  process.exit(1);
}

const apiKey1 = process.env.VERTEX_AI_KEY;
if (!apiKey1) {
  console.error("Missing Vertex AI API Key");
  process.exit(1);
}

// Correctly initialize the Vertex AI client
const vertexClient = new PredictionServiceClient({
  apiEndpoint: vertexApiEndpoint,
  keyFilename: "./serviceAccountKey.json", // Ensure this file exists
});

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(apiKey1);

// Initialize Vertex AI Client
const client = new PredictionServiceClient({
  apiEndpoint: vertexApiEndpoint,
  keyFilename: "./serviceAccountKey.json",
});

const modelEndpoint = `projects/${projectId}/locations/us-central1/models/text-bison@001`;


// IMPORTANT: Set the model and API version. Adjust if necessary.
// Here, we use "v1" for the API version. If that fails, try "v1beta" after verifying which version is supported.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", apiVersion: "v1" });

/* Default route for testing */
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/generate-quiz", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      console.error("❌ Error: No topic provided in request body");
      return res.status(400).json({ error: "Please provide a topic for the quiz." });
    }

    console.log(`📝 Generating quiz for topic: ${topic}`);

    // Print environment variables
    console.log("🔧 ENV CONFIG:");
    console.log("VERTEX_AI_ENDPOINT:", vertexApiEndpoint);
    console.log("GCP_PROJECT_ID:", process.env.GCP_PROJECT_ID);
    console.log("Model Endpoint:", modelEndpoint);

    // Prepare input prompt
    const prompt = `Generate a multiple-choice quiz on "${topic}" with 5 questions.
      Each question should have 4 options and one correct answer.
      Provide explanations for correct answers.
      Return JSON format:
      { "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "...", "explanation": "..." } ] }`;

    const request = {
      endpoint: modelEndpoint,
      instances: [{ content: prompt }],  // FIXED: 'prompt' should be 'content'
      parameters: { temperature: 0.7, maxOutputTokens: 1024, topK: 40, topP: 0.8 },
    };

    console.log("📡 Sending request to Vertex AI:", JSON.stringify(request, null, 2));

    // Call Vertex AI
    const [response] = await vertexClient.predict(request);

    console.log("🔍 Vertex AI Response:", JSON.stringify(response, null, 2));

    // Extract response
    const quizData = response?.predictions?.[0]?.content;
    if (!quizData) {
      console.error("❌ Error: Vertex AI returned no content");
      throw new Error("No content in Vertex AI response.");
    }

    // Parse AI response
    let parsedQuiz;
    try {
      parsedQuiz = JSON.parse(quizData);
    } catch (err) {
      console.error("❌ JSON Parsing Error:", err);
      return res.status(500).json({ error: "Invalid AI response format." });
    }

    console.log("✅ Successfully generated quiz:", parsedQuiz);
    res.json({ quiz: parsedQuiz.questions });
  } catch (error) {
    console.error("❌ Quiz Generation Error:", error.stack || error);
    res.status(500).json({ error: error.message || "Failed to generate quiz!" });
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
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

