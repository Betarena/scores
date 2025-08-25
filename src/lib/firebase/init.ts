// #region ➤ 📦 Package Imports

import { deleteApp, getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { Database, enableLogging, getDatabase } from 'firebase/database';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getFunctions } from "firebase/functions";
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

/**
 * @author
 *  @migbash
 * @description
 *  📌 Firebase Config Object
 */
const firebaseConfig: FirebaseOptions =
{
	apiKey:	import.meta.env?.VITE_FIREBASE_DB_API_KEY as string,
	authDomain:	import.meta.env?.VITE_FIREBASE_DB_AUTH_DOMAIN as string,
	projectId: import.meta.env?.VITE_FIREBASE_DB_PROJECT_ID as string,
	databaseURL: import.meta.env?.VITE_FIREBASE_DB_DATABASE_URL as string,
	storageBucket: import.meta.env?.VITE_FIREBASE_DB_STORAGE_BUCKET as string
};

// #region version-1 (init)

/**
 * @author
 *  @migbash
 * @description
 *  📌 Initialize Firebase App.
 * @see https://stackoverflow.com/questions/37652328/how-to-check-if-a-firebase-app-is-already-initialized-on-android/41005100#41005100
 */
export const app: FirebaseApp =
	getApps().length === 0
		? initializeApp(firebaseConfig)
		: getApp()
;

/**
 * @author
 *  @migbash
 * @description
 *  📌 Initialize RealTime DB Service.
 */
export const db_real: Database = getDatabase(app);
/**
 * @author
 *  @migbash
 * @description
 *  📌 Initialize Firebase Authentication.
 */
export const auth: Auth = getAuth(app);
/**
 * @author
 *  @migbash
 * @description
 *  📌 Initialize Firebase Cloud Storage.
 */
export const storage: FirebaseStorage = getStorage(app);
/**
 * @author
 *  @migbash
 * @description
 *  📌 Initialize Firebase Cloud Firestore.
 */
export const db_firestore: Firestore = getFirestore(app);
/**
 * @author
 *  @migbash
 * @description
 *  📌 Initialize Firebase Cloud Functions.
 */
export const instanceFirebaseFunctions = getFunctions(app);

// #endregion version-1 (init)

// #endregion ➤ 📌 VARIABLES

// #region version-2 (init)

export async function firebaseAppDelete
(
)
{
  await deleteApp
  (
    app
  );
}

export async function firebaseAppInit
(
)
{
  if (getApps().length === 0)
  {
    initializeApp(firebaseConfig)
  }
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