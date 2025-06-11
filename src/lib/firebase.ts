
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; // Uncomment if you need Firebase Storage

// Log attempts to read environment variables
console.log("Firebase Init: Attempting to load Firebase config from environment variables...");
console.log("Firebase Init: NEXT_PUBLIC_FIREBASE_API_KEY is", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "LOADED" : "NOT LOADED or EMPTY");
console.log("Firebase Init: NEXT_PUBLIC_FIREBASE_PROJECT_ID is", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "LOADED" : "NOT LOADED or EMPTY");

// Your web app's Firebase configuration
// These variables should be set in your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all essential config values are present before attempting to initialize
if (!firebaseConfig.apiKey) {
  console.error("Firebase Config Error: API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or empty.");
  console.error("Please ensure your .env.local file is correctly set up in the project root and that you have restarted the development server.");
}
if (!firebaseConfig.projectId) {
  console.error("Firebase Config Error: Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or empty.");
}


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  try {
    if (!firebaseConfig.apiKey) {
      // Prevent initialization if API key is definitely missing to avoid vague Firebase errors
      throw new Error("Firebase initialization aborted due to missing API Key. Check .env.local and server restart.");
    }
    app = initializeApp(firebaseConfig);
    console.log("Firebase Init: New Firebase app initialized successfully.");
  } catch (error) {
    console.error("Firebase Init: Error initializing Firebase app:", error);
    // Depending on your error handling strategy, you might rethrow or handle differently
    // For now, this will make the app fail clearly if init fails.
    throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApp();
  console.log("Firebase Init: Existing Firebase app retrieved.");
}

const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // Uncomment if you need Firebase Storage

export { app, auth, db /*, storage */ };
