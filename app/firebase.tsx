// Import the functions you need from the SDKs you need
"use client";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7FArtcOW4Uhv1LQ8ozKDRMygEgZRzgTw",
  authDomain: "sales-transcript-comments.firebaseapp.com",
  projectId: "sales-transcript-comments",
  storageBucket: "sales-transcript-comments.appspot.com",
  messagingSenderId: "840463533429",
  appId: "1:840463533429:web:61fe67bd242ab759507f3c",
  measurementId: "G-5T6P3M9THV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
