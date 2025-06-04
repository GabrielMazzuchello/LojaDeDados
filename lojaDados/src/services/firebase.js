import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtubdq8wj5hWohIkuV6pSf2VQe1D9lZIQ",
  authDomain: "aulasm2025-b892f.firebaseapp.com",
  projectId: "aulasm2025-b892f",
  storageBucket: "aulasm2025-b892f.appspot.com",
  messagingSenderId: "618683157576",
  appId: "1:618683157576:web:1e28c8b0375beaf24cdc7d",
  measurementId: "G-0QP7KLBW2R",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
