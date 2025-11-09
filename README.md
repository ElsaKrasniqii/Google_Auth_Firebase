# Firebase Google Authentication (Expo Web)

 - This project demonstrates a simple yet functional authentication system built with React Native (Expo Router) and Firebase Authentication Firestore. It supports both Email/Password login and Google Sign-In (for Web).

## Demo
 -  Google Sign-In Flow
 - Users can log in via their Google account using Firebase authentication.
 -  Firebase Users Console
  - All users (email or Google) are automatically saved in the Firestore database.

## Features

 -  User registration with input validation
 -  Login with email & password
 -  Google Sign-In (works perfectly on Web using signInWithPopup)
 -  User data stored in Firestore (users collection)
 -  Firebase session persistence
 -  Logout and redirect to login
 -  Welcome screen showing user’s email or display name
 -  Clean, minimal UI built with React Native components

## Tech Stack
1. Technology	Purpose
2. Expo (React Native)	Frontend & UI framework
3. Expo Router	Routing and screen navigation
4. Firebase Authentication	User authentication and session handling
5. Firebase Firestore	Storing user profiles
6. Expo Auth Session / Google Auth Provider	Google OAuth login (Web)
7. JavaScript (ES6)	App logic
8. Ionicons	UI icons (optional)

## ⚙️ Setup Instructions
1.  Clone the repository :
git clone https://github.com/yourusername/firebase-google-auth.git
cd firebase-google-auth
2. Install dependencies
npm install
3. Create and configure Firebase project
- Go to Firebase Console
- Create a new project
- Enable Email/Password and Google under Authentication → Sign-in Method
- Copy your Firebase config and paste it into firebase.js

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

4. Set up Google Cloud OAuth Client
   Go to Google Cloud Console
   Create a Web Client ID
   Add these URIs under Authorized JavaScript Origins:

    1. http://localhost     
    2. http://localhost:8081
    3. http://localhost:8089
    4. https://fir-auth-acaae.firebaseapp.com
    5. https://fir-auth-acaae.web.app

 - Copy your webClientId and paste it inside login.jsx in the Google Auth config.

5️⃣ Run the app in web mode
npx expo start --web

## 📂 Folder Structure
firebase-google-auth/
│
├── app/
│   ├── (auth)/
│   │   ├── login.jsx        # Email + Google login screen
│   │   ├── register.jsx     # User registration form
│   ├── index.jsx            # Welcome screen (after login)
│   └── _layout.jsx          # Navigation setup
│
├── firebase.js              # Firebase config (Auth + Firestore)
├── package.json
└── README.md

## Example Screens
### 🔸 Login
Email/password input
Google Sign-In button
Redirects to Welcome screen on success

### 🔸 Register
Input validation (email & password)
Creates new Firebase Auth user

### 🔸 Welcome
Displays logged-in user’s name/email
Logout button (returns to login screen)

## 💖 Author
 - Elsa Krasniqi
 - Built for learning purposes — combining Firebase + Expo + React Native Auth flow.