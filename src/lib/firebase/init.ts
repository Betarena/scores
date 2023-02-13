// ~~~~~~~~~~~~~~~~~~
// firebase/index.ts
// - adapted to GitHub Actions SECRETS
// - adpated to Heroku ENV-VARIABLES
// ~~~~~~~~~~~~~~~~~~

import {
	getApp,
	getApps,
	initializeApp
} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// NOTE: firebase config with non-auth properties skipped;
const firebaseConfig = {
	apiKey:
		import.meta.env.VITE_FIREBASE_DB_API_KEY.toString(),
	authDomain:
		import.meta.env.VITE_FIREBASE_DB_AUTH_DOMAIN_MAIN.toString(),
	projectId:
		import.meta.env.VITE_FIREBASE_DB_PROJECT_ID_MAIN.toString(),
	databaseURL:
		import.meta.env.VITE_FIREBASE_DB_DATABASE_URL.toString(),
	storageBucket:
		import.meta.env.VITE_FIREBASE_DB_STORAGE_BUCKET.toString()
};

// DOC: https://stackoverflow.com/questions/37652328/how-to-check-if-a-firebase-app-is-already-initialized-on-android/41005100#41005100
// NOTE: initialize the Firebase APP;
export const app =
	getApps().length === 0
		? initializeApp(firebaseConfig)
		: getApp();

// NOTE: Initialize Real-Time-DB and get a reference to the service;
export const db_real = getDatabase(app);
// NOTE: Initialize Firebase Authentication and get a reference to the service;
export const auth = getAuth(app);
// NOTE: Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
// NOTE: Initialize Cloud Firestore and get a reference to the service
export const db_firestore = getFirestore(app);
