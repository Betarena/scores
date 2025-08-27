import { auth, db_real, storage } from '$lib/firebase/init';
import { log_error_v1, log_v3 } from '$lib/utils/debug';
import { updateUserProfileData } from '$lib/utils/user';
import {
  createUserWithEmailAndPassword,
  linkWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,

  type AuthError,
  type ConfirmationResult,
  type UserCredential
} from 'firebase/auth';
import { child, get, onValue } from 'firebase/database';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

/**
 * @summary
 * [MAIN]
 * @description
 * simple one-off GET query for the target real DB data path retrieval;
 * @param
 * {string} path
 * @returns
 * an unknown object
 */
export async function getTargetRealDbData
(
  path: string
): Promise < unknown >
{
  const connectRef = ref
  (
    db_real
  );

  const snapshot = await get
  (
		child
    (
      connectRef,
      path
    )
	);

  if (snapshot.exists()) return snapshot.val();
  return null;
}

// TEMP
export async function realDbHeartBeat
(
)
{
  const connectedRef = ref
  (
    db_real,
    ".info/connected"
  );
  onValue
  (
    connectedRef,
    (
      snap
    ) =>
    {
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    }
  );
}

/**
 * @summary
 * [AUTH]
 * @description
 * Register a new user with email and password
 * @param
 * {string} email - User's email address
 * {string} password - User's password
 * @returns
 * Promise<UserCredential> on success, throws AuthError on failure
 */
export async function registerUser(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error as AuthError;
  }
}

/**
 * @summary
 * [AUTH]
 * @description
 * Sign in existing user with email and password
 * @param
 * {string} email - User's email address
 * {string} password - User's password
 * @returns
 * Promise<UserCredential> on success, throws AuthError on failure
 */
export async function signInUser(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error as AuthError;
  }
}

/**
 * @summary
 * [PHONE AUTH]
 * @description
 * Initialize reCAPTCHA verifier for phone authentication
 * @param
 * {string} containerId - ID of the container element for reCAPTCHA
 * @returns
 * RecaptchaVerifier instance
 */
export function initializeRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
}

/**
 * @summary
 * [PHONE AUTH]
 * @description
 * Send verification code to phone number
 * @param
 * {string} phoneNumber - Phone number in international format (e.g., +1234567890)
 * @param
 * {RecaptchaVerifier} recaptchaVerifier - reCAPTCHA verifier instance
 * @returns
 * Promise<ConfirmationResult> on success, throws AuthError on failure
 */
export async function sendPhoneVerificationCode(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error) {
    throw error as AuthError;
  }
}

/**
 * @summary
 * [PHONE AUTH]
 * @description
 * Verify phone number with SMS code
 * @param
 * {ConfirmationResult} confirmationResult - Result from sendPhoneVerificationCode
 * {string} code - SMS verification code
 * @returns
 * Promise<UserCredential> on success, throws AuthError on failure
 */
export async function verifyPhoneCode(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<UserCredential> {
  try {
     const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    // Create phone credential
    const credential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      code
    );
    return await linkWithCredential(currentUser, credential);
  } catch (error) {
    
    throw error as AuthError;
  }
}

/**
 * @summary
 * [STORAGE]
 * @description
 * Upload a profile avatar to Firebase Storage
 * @param
 * {string} img - Image data URL
 * @returns
 * Promise<string> on success, throws error on failure
 */
export async function uploadProfileAvatar(img: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {

    const instStorageDocRef = ref(
      storage,
      `Users_data/${user.uid}/profile-pic.png`
    );
    
    const dataRes0 = await uploadString(
      instStorageDocRef,
      img,
      'data_url'
    ); 

    const dataRes1 = await getDownloadURL(instStorageDocRef);

    // [🐞]
    log_v3(
      {
        strGroupName: 'updateUserProfilePicture(..) // END',
        msgs:
        [
          '🟢 Uploaded file!',
          `🔗 ${dataRes0.ref.fullPath}`,
          `🔗 ${dataRes1}`
        ]
      }
    );

    await updateUserProfileData({ profile_photo: dataRes1 });

    return dataRes1;
  } catch (error) {
    log_error_v1({strErrorMsg: "uploadProfileAvatar error: " + error.message, type: "error"});
    throw error;
  }
}