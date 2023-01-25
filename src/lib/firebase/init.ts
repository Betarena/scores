// ~~~~~~~~~~~~~~~~~~
// firebase/index.ts
// - adapted to GitHub Actions SECRETS
// - adpated to Heroku ENV-VARIABLES
// ~~~~~~~~~~~~~~~~~~

import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

// NOTE: firebase config with non-auth properties skipped;
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_DB_API_KEY.toString(), // [ℹ] [MAIN] FIREBASE DB KEY
	authDomain: import.meta.env.VITE_FIREBASE_DB_AUTH_DOMAIN_MAIN.toString(), // [ℹ] [MAIN] AUTH DB URL
	projectId: import.meta.env.VITE_FIREBASE_DB_PROJECT_ID.toString(), // [ℹ] [MAIN] PROJECT ID
	databaseURL: import.meta.env.VITE_FIREBASE_DB_DATABASE_URL.toString() // [ℹ] REALTIME DB
};

// NOTE: firebase config with non-auth properties skipped;
const firebaseConfigMain = {
	apiKey: import.meta.env.VITE_FIREBASE_DB_API_KEY.toString(),
	authDomain: import.meta.env.VITE_FIREBASE_DB_AUTH_DOMAIN_MAIN.toString(),
	projectId: import.meta.env.VITE_FIREBASE_DB_PROJECT_ID_MAIN.toString()
};

// NOTE: initialize the Firebase APP;
export const app = initializeApp(firebaseConfig);
export const app_m = initializeApp(firebaseConfigMain, 'secondary');
// NOTE: Initialize Real-Time-DB and get a reference to the service;
export const db_real = getDatabase(app);
// NOTE: Initialize Firebase Authentication and get a reference to the service;
export const auth = getAuth(app_m);