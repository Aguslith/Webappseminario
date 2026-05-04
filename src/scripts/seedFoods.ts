import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLmjdiB9zYG53DXFYq6fiKGw9Ynk0cHXU",
  authDomain: "appalimenticia-4888b.firebaseapp.com",
  projectId: "appalimenticia-4888b",
  storageBucket: "appalimenticia-4888b.firebasestorage.app",
  messagingSenderId: "76275768878",
  appId: "1:76275768878:web:f1f52524111eca9ca3c9bf",
  measurementId: "G-WDY6W7T6WF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ARGENTINIAN_FOODS = [
  { name: "Asado de Tira", calories: 250, protein: 25, carbs: 0, fats: 18, category: "Carnes" },
  { name: "Empanada de Carne", calories: 280, protein: 8, carbs: 30, fats: 14, category: "Masas" },
  { name: "Choripán", calories: 450, protein: 15, carbs: 35, fats: 28, category: "Sándwiches" },
  { name: "Milanesa de Ternera", calories: 320, protein: 22, carbs: 15, fats: 18, category: "Carnes" },
  { name: "Milanesa a la Napolitana", calories: 480, protein: 30, carbs: 18, fats: 32, category: "Carnes" },
  { name: "Locro", calories: 350, protein: 15, carbs: 45, fats: 12, category: "Guisos" },
  { name: "Humita en Chala", calories: 220, protein: 5, carbs: 38, fats: 6, category: "Tradicional" },
  { name: "Pastel de Papa", calories: 400, protein: 18, carbs: 42, fats: 18, category: "Platillos" },
  { name: "Alfajor de Maicena", calories: 310, protein: 4, carbs: 45, fats: 12, category: "Dulces" },
  { name: "Dulce de Leche (cucharada)", calories: 60, protein: 1, carbs: 10, fats: 2, category: "Dulces" },
  { name: "Mate (cebado)", calories: 5, protein: 0.5, carbs: 1, fats: 0, category: "Bebidas" },
  { name: "Provoleta", calories: 300, protein: 18, carbs: 2, fats: 24, category: "Quesos" }
];

async function seedFoods() {
  const foodsCol = collection(db, "foods");
  const snapshot = await getDocs(query(foodsCol, limit(1)));
  
  if (snapshot.empty) {
    console.log("Seeding Argentinian foods into 'foods' collection...");
    for (const food of ARGENTINIAN_FOODS) {
      await addDoc(foodsCol, food);
      console.log(`Added: ${food.name}`);
    }
    console.log("Seeding complete!");
  } else {
    console.log("Collection 'foods' already contains data. Skipping seed.");
  }
}

seedFoods().catch(console.error);
