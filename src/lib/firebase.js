import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcLq-g_6vGolY6UhpzMLPNzZvQgeLA8qM",
  authDomain: "evara-store-1.firebaseapp.com",
  projectId: "evara-store-1",
  storageBucket: "evara-store-1.firebasestorage.app",
  messagingSenderId: "237114074791",
  appId: "1:237114074791:web:41175550c4f26fdd12dd82",
  measurementId: "G-4S4NKTNV87"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);