// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-QCcTS2VX1fPwv6uX06Jnf_vkFjrrIGs",
  authDomain: "uninova-7ca7d.firebaseapp.com",
  databaseURL: "https://uninova-7ca7d-default-rtdb.firebaseio.com",
  projectId: "uninova-7ca7d",
  storageBucket: "uninova-7ca7d.firebasestorage.app",
  messagingSenderId: "575036678017",
  appId: "1:575036678017:web:9bdb8a3f5f94eff8ef9280",
  measurementId: "G-9W6T9XL101"
};
// Verifica si Firebase ya fue inicializado
export const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Analytics solo en el cliente
export const auth = getAuth(app);
export const db = getFirestore(app);