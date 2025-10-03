// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-ec4ec.firebaseapp.com",
  projectId: "mern-auth-ec4ec",
  storageBucket: "mern-auth-ec4ec.appspot.com",
  messagingSenderId: "849378432629",
  appId: "1:849378432629:web:1455511966e13bc2e0ca3c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
