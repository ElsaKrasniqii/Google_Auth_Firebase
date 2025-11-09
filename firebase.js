// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBx3Kw3eUQ9-j3yEYnk7TIvp0xY83iu3-w",
  authDomain: "fir-auth-acaae.firebaseapp.com",
  projectId: "fir-auth-acaae",
  storageBucket: "fir-auth-acaae.appspot.com",
  messagingSenderId: "859199550263",
  appId: "1:859199550263:web:a08766b6c3901493fb20b2",
  measurementId: "G-MND9F95JL6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
