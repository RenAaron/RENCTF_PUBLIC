// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

    apiKey: "YOUR FIREBASE CREDS",
  
    authDomain: "YOUR FIREBASE CREDS",
  
    projectId: "YOUR FIREBASE CREDS",
  
    storageBucket: "YOUR FIREBASE CREDS",
  
    messagingSenderId: "YOUR FIREBASE CREDS",
  
    appId: "YOUR FIREBASE CREDS",
  
    measurementId: "YOUR FIREBASE CREDS"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
