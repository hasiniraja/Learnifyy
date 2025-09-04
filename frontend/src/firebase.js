// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBnLKxNDdRTl7FQCuHZ87-rh9K_SHBFwLg",
  authDomain: "learnify-a7d07.firebaseapp.com",
  projectId: "learnify-a7d07",
  storageBucket: "learnify-a7d07.firebasestorage.app",
  messagingSenderId: "452008228072",
  appId: "1:452008228072:web:8c9b2af4f0c983d85a455d",
  measurementId: "G-7BYJE2M708"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { analytics };


const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log(result.user);
    } catch (error) {
        console.error(error);
    }
};