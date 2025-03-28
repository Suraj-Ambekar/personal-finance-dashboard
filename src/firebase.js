// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyDbLP6XLJpstxFbL0yZ3SDtHjWt25GG_pY",
//   authDomain: "personal-finance-dashboa-bf30f.firebaseapp.com",
//   projectId: "personal-finance-dashboa-bf30f",
//   storageBucket: "personal-finance-dashboa-bf30f.firebasestorage.app",
//   messagingSenderId: "757863983361",
//   appId: "1:757863983361:web:11e7ab45cfba0e3502d300",
//   measurementId: "G-NJ28J7S9PS",
// };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // // const analytics = getAnalytics(app);
// // export const auth = getAuth(app);
// // export default app;
// // export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);
