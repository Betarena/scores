// ~~~~~~~~~~~~~~~~~~
// firebase/index.ts
// - adapted to GitHub Actions SECRETS
// - adpated to Heroku ENV-VARIABLES
// ~~~~~~~~~~~~~~~~~~

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ... firebase config with non-auth properties skipped;
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_DB_API_KEY.toString(),
	authDomain: import.meta.env.VITE_FIREBASE_DB_AUTH_DOMAIN.toString(),
	projectId: import.meta.env.VITE_FIREBASE_DB_PROJECT_ID.toString(),
	databaseURL: import.meta.env.VITE_FIREBASE_DB_DATABASE_URL.toString()
};

// ... initialize the Firebase APP;
const app = initializeApp(firebaseConfig);

// ... use the Real-Time-DB from FIREBASE;
export const db_real = getDatabase(app);
