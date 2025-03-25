require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Update CORS to allow your frontend's origin (adjust as needed)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
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



