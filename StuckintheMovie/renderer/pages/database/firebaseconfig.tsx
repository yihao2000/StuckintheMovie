// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCimUyejd57Q6gmfA-PayI8iFZ5F_xM_p4",
  authDomain: "stuckinthemovie-92038.firebaseapp.com",
  projectId: "stuckinthemovie-92038",
  storageBucket: "stuckinthemovie-92038.appspot.com",
  messagingSenderId: "221983168260",
  appId: "1:221983168260:web:1a072d6475958541fe2251",
  measurementId: "G-JBQX5FFKV3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);