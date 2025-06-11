import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0hyCRlEewfXrhlmUKLeo9eOuGSPwP9f0",
  authDomain: "sessoesrpg-2025.firebaseapp.com",
  projectId: "sessoesrpg-2025",
  storageBucket: "sessoesrpg-2025.firebasestorage.app",
  messagingSenderId: "95009760776",
  appId: "1:95009760776:web:cade0a06a157bea431d3bd",
  measurementId: "G-6LPXCCV5MX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
