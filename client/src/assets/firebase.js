// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhe47ucemtjLq4zlQO38E35d7j2ley_zg",
  authDomain: "chatnova-c7afc.firebaseapp.com",
  projectId: "chatnova-c7afc",
  storageBucket: "chatnova-c7afc.firebasestorage.app",
  messagingSenderId: "506879858204",
  appId: "1:506879858204:web:f32f993cd78e003d0231d9",
  measurementId: "G-SRTRC8SW94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();