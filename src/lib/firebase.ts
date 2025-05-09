import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDD13kQsaZiMk81lvCtIR2XI0ggTQOom18",
  authDomain: "recipesage-3b74c.firebaseapp.com",
  projectId: "recipesage-3b74c",
  storageBucket: "recipesage-3b74c.firebasestorage.app",
  messagingSenderId: "360961063736",
  appId: "1:360961063736:web:bf6870d2b3c66b3d349fcd",
  measurementId: "G-RNQ79S90JF"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use existing app if already initialized
}

const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db }; // Export db