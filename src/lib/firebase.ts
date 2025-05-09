import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

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
} 

const auth = getAuth(app);

export { app, auth };