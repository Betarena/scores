import { deleteApp, getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { enableLogging, getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// NOTE: firebase config with non-auth properties skipped;
const firebaseConfig: FirebaseOptions = 
{
	apiKey:	import.meta.env?.VITE_FIREBASE_DB_API_KEY as string,
	authDomain:	import.meta.env?.VITE_FIREBASE_DB_AUTH_DOMAIN as string,
	projectId: import.meta.env?.VITE_FIREBASE_DB_PROJECT_ID as string,
	databaseURL: import.meta.env?.VITE_FIREBASE_DB_DATABASE_URL as string,
	storageBucket: import.meta.env?.VITE_FIREBASE_DB_STORAGE_BUCKET as string
};

// #region version-1 (init)

// DOC: https://stackoverflow.com/questions/37652328/how-to-check-if-a-firebase-app-is-already-initialized-on-android/41005100#41005100
// NOTE: initialize the Firebase APP;
export const app = 
	getApps().length === 0
		? initializeApp(firebaseConfig)
		: getApp()
;

// NOTE: Initialize Real-Time-DB and get a reference to the service;
export const db_real = getDatabase(app);
// NOTE: Initialize Firebase Authentication and get a reference to the service;
export const auth = getAuth(app);
// NOTE: Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
// NOTE: Initialize Cloud Firestore and get a reference to the service
export const db_firestore = getFirestore(app);

// #endregion version-1 (init)

// #region version-2 (init)

export async function firebaseAppDelete
(
)
{
  console.log("🔥 APP DELETED")
  await deleteApp
  (
    app
  );
}

export async function firebaseAppInit
(
)
{
  console.log('(check) initialized Apps', getApps())
  if (getApps().length === 0)
  {
    console.log("🔥 INITIALIZING APP")
    initializeApp(firebaseConfig)
  }
  console.log('(post) initialized Apps', getApps())
}

// => REAL-TIME DB
export function realDb
(
)
{
  enableLogging(true)
  // forceLongPolling()
  return getDatabase
  (
    getApp()
  );
}

// #endregion version-2 (init)