const admin = require("firebase-admin");
const serviceAccount = require("./path-to-your-service-account.json"); // Update path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com" // Replace with your project URL
});

const db = admin.firestore();
const auth = admin.auth(); // Add Firebase Auth

module.exports = { db, auth };
