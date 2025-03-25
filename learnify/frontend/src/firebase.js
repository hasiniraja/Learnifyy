// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHwcA7OhLWkr4lbSA9mf1vMHiBQLCYIsg",
  authDomain: "learnify-a7d07.firebaseapp.com",
  projectId: "learnify-a7d07",
  storageBucket: "learnify-a7d07.appspot.com",
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