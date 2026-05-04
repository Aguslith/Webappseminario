import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu config (la que ya tenés)
const firebaseConfig = {
  apiKey: "AIzaSyBLmjdiB9zYG53DXFYq6fiKGw9Ynk0cHXU",
  authDomain: "appalimenticia-4888b.firebaseapp.com",
  projectId: "appalimenticia-4888b",
  storageBucket: "appalimenticia-4888b.firebasestorage.app",
  messagingSenderId: "76275768878",
  appId: "1:76275768878:web:f1f52524111eca9ca3c9bf",
  measurementId: "G-WDY6W7T6WF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth (LOGIN / REGISTER)
export const auth = getAuth(app);

// 💾 Firestore (BASE DE DATOS)
export const db = getFirestore(app);