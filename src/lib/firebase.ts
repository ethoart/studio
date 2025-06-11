
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; // Uncomment if you need Firebase Storage

// Log attempts to read environment variables
console.log("Firebase Init: Attempting to load Firebase config from environment variables...");
console.log(">>> IMPORTANT: Check THIS TERMINAL for the 'Firebase Env Check' logs below to see what values are being loaded. <<<");

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// More explicit logging for the critical API key and other values
console.log("---------------------------------------------------------------------");
console.log("Firebase Env Check: Value of process.env.NEXT_PUBLIC_FIREBASE_API_KEY is: '", apiKey, "'");
if (typeof apiKey === 'undefined') {
  console.warn("Firebase Env Check Warning: NEXT_PUBLIC_FIREBASE_API_KEY is UNDEFINED at the point of reading process.env.");
} else if (apiKey === '') {
  console.warn("Firebase Env Check Warning: NEXT_PUBLIC_FIREBASE_API_KEY is an EMPTY STRING at the point of reading process.env.");
}
console.log("Firebase Env Check: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID is: '", projectId, "'");
console.log("---------------------------------------------------------------------");


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// Initialize Firebase
let app: FirebaseApp;

if (!firebaseConfig.apiKey) { // This check is critical
  const errorMessage = "CRITICAL Firebase Error: API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or EMPTY. " +
                       "Firebase SDK cannot initialize without it. " +
                       "Please VERY CAREFULLY check the following: " +
                       "1. Is there a file named EXACTLY '.env.local' (with the leading dot) in the ROOT of your project (same level as package.json)? " +
                       "2. Does '.env.local' contain the line: NEXT_PUBLIC_FIREBASE_API_KEY='YOUR_ACTUAL_API_KEY_HERE' (replace with your real key)? Make sure there are no extra quotes or spaces. " +
                       "3. Have you COMPLETELY STOPPED and then RESTARTED your Next.js development server (e.g., 'npm run dev' or equivalent) AFTER creating or editing the '.env.local' file? A simple refresh or hot-reload is NOT enough. " +
                       "4. Check the TERMINAL OUTPUT of your Next.js development server (where you run 'npm run dev'). It includes 'Firebase Env Check' logs showing the value it's reading for NEXT_PUBLIC_FIREBASE_API_KEY. If it's 'undefined' or an empty string in the terminal logs, your .env.local setup or server restart is the issue. " +
                       "The API key is not being correctly exposed to your application's client-side environment.";
  console.error(errorMessage);
  // This error is thrown because the API key is essential for Firebase to function.
  throw new Error(errorMessage);
}

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase Init: New Firebase app initialized successfully.");
  } catch (error) {
    const initError = error instanceof Error ? error.message : String(error);
    console.error("Firebase Init: Error initializing Firebase app:", initError);
    // This error (e.g., auth/invalid-api-key if the key is present but malformed, or project not found for projectId)
    // would occur if apiKey was present but other config values were problematic or a Firebase project issue.
    const detailedErrorMessage = `Firebase initialization failed AFTER API key check. Original error: [${initError}]. This often indicates an issue with the Firebase config values themselves (e.g., malformed API key, incorrect Project ID for the API key) or Firebase project-level configuration (e.g., Auth not enabled, Firestore rules). Double-check ALL your NEXT_PUBLIC_FIREBASE_ environment variables in .env.local against your Firebase project settings.`;
    console.error(detailedErrorMessage);
    throw new Error(detailedErrorMessage);
  }
} else {
  app = getApp();
  console.log("Firebase Init: Existing Firebase app retrieved.");
}

const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // Uncomment if you need Firebase Storage

export { app, auth, db /*, storage */ };
