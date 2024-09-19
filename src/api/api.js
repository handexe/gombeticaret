// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmprFscisZiXIN39ZWkEHV-BqIY6ZHOgE",
  authDomain: "gombeticaret.firebaseapp.com",
  projectId: "gombeticaret",
  storageBucket: "gombeticaret.appspot.com",
  messagingSenderId: "680700448744",
  appId: "1:680700448744:web:338e123417651ca9eade5d",
  measurementId: "G-DZ7CJ3F10Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);