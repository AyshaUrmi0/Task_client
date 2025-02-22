// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbSdVRmbUhLzQVVwqYQx00j9XvchmDieo",
  authDomain: "jobtask-20589.firebaseapp.com",
  projectId: "jobtask-20589",
  storageBucket: "jobtask-20589.firebasestorage.app",
  messagingSenderId: "176610471921",
  appId: "1:176610471921:web:72553ca429d0e86dfdde50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
