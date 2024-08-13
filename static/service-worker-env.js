// Convert environment variables to URL `search` parameters
const firebaseConfig = new URLSearchParams({
  apiKey: process.env.VITE_FIREBASE_DB_API_KEY,
  authDomain: process.env.VITE_FIREBASE_DB_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DB_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_DB_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}).toString();

// Service worker URL w/config variables
const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js?${firebaseConfig}`