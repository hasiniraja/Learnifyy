const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// API to handle user signup
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
      dob: admin.firestore.Timestamp.fromDate(new Date(dob)), // Corrected date handling
      education_lvl,
      createdAt: admin.firestore.Timestamp.now(),
    });

    res.status(201).json({ message: "User signed up successfully!", user: userRecord });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));


