// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Main Scores Platform Authentication Logic                                      │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { browser } from '$app/environment';
import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateUsername } from 'unique-username-generator';

import { post } from '$lib/api/utils.js';
import { app, db_firestore } from '$lib/firebase/init.js';
import { getCookie } from '$lib/store/cookie.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';
import { AU_W_TAG, dlog, dlogv2, errlog } from './debug.js';
import { initUser } from './user.js';

import type { BetarenaUser, IScoreUser } from '$lib/types/types.user-settings.js';
import type { IAuthType } from '@betarena/scores-lib/types/_FIREBASE_.js';
import type { User } from 'firebase/auth';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  - 📣 Final `authentication` step.
 *  - 📣 Updates `stores`, `localStoreage` and `UI`.
 * @param { User } firebaseUser
 *  💠 **[required]** User `data`.
 * @param { string } web3WalletAddress
 *  💠 [optional] User web3 wallet address.
 * @param { IAuthType } authProviderType
 *  💠 **[required]** User authetication option used.
 * @return { Promise < boolean > }
 *  📤 Authentication terminal `state`.
 */
export async function successAuthComplete
(
  authType: 'login' | 'register',
  firebaseUser?: User,
  web3WalletAddress?: string,
  authProviderType?: IAuthType
): Promise < boolean >
{
  if (!browser) return false;

  return await tryCatchAsync
  (
    async (
    ): Promise < boolean > =>
    {
      // [🐞]
      dlogv2
      (
        `${AU_W_TAG[0]} successAuthComplete(..)`,
        [
          `🔹 [var] ➤ firebaseUser :|: ${JSON.stringify(firebaseUser, null, 4)}`,
          `🔹 [var] ➤ web3WalletAddress :|: ${JSON.stringify(web3WalletAddress, null, 4)}`,
          `🔹 [var] ➤ authProviderType :|: ${JSON.stringify(authProviderType, null, 4)}`,
        ]
      );

      const
        /**
         * @description
         * 📝 Retrieve (or, create) BetarenaUser.
         */
        betarenaUser
          = await userFirestore
          (
            firebaseUser?.uid!,
            firebaseUser!,
            web3WalletAddress!,
            authProviderType!
          ),
        /**
         * @description
         * 📝 Target user `data`.
         */
        userObject: IScoreUser
          = {
            firebase_user_data: firebaseUser,
            scores_user_data: betarenaUser
          }
      ;

      userBetarenaSettings.updateData
      (
        [
          ['user-object', userObject]
        ]
      );

      sessionStore.updateData
      (
        [
          ['currentToast', (authType == 'login' ? 'Auth_Success_L_Toast' : 'Auth_Success_R_Toast')],
          ['currentModal', null]
        ]
      );

      initUser();

      return true;
    }
  ) as boolean;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Authenticates user with `Moralis Auth`.
 * @return { Promise < void > }
 */
export async function authWithMoralis
(
): Promise < void >
{
  if (!browser) return;

  await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      const
        moralisAuth = getMoralisAuth(app),
        moralisAuthInstance = await signInWithMoralis(moralisAuth)
      ;

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🟢 Moralis Auth`
      );

      await successAuthComplete
      (
        moralisAuthInstance.credentials.user,
        moralisAuthInstance.credentials.user.displayName!,
        'wallet'
      );

      // ▓ CHECK
      // > for 'deep link' of invest box.
      // if (investDepositIntent == 'true')
      // {
      //   // ▓ [🐞]
      //   // alert('mavigating to invest-box');

      //   const targetUrl = `/u/investor/${$userBetarenaSettings.lang}`;

      //   // ▓ [🐞]
      //   console.log('targetUrl', targetUrl);

      //   await goto
      //   (
      //     targetUrl,
      //     {
      //       replaceState: true
      //     }
      //   );
      // }

      return;
    },
    (
      ex: unknown
    ): void =>
    {
      // [🐞]
      if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
        console.info('❗️', '');
      else
        console.error('💀 Unhandled :: ex');
      ;
      return;
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @CUSTOM_TRY_CATCH
 * @description
 *  - 📣 Retrieve target user info from `Firebase/Firestore`.
 *  - 📣 _if `user` exists_, return user `data`.
 *  - 📣 _else_ create a new instance of user for Firestore.
 * @param { string } uid
 *  💠 **[required]** User uid.
 * @param { User } firebaseUser
 *  💠 **[required]** User `data`.
 * @param { string } web3WalletAddress
 *  💠 **[required]** User `web3` address.
 * @param { IAuthType } authProviderType
 *  💠 **[required]** User authentication `provider` used.
 * @return { Promise < BetarenaUser | null > }
 *  📤 Target `user` (or, **new**) data.
 */
async function userFirestore
(
  uid: string,
  firebaseUser: User,
  web3WalletAddress: string,
  authProviderType: IAuthType,
): Promise < BetarenaUser | null >
{
  if (!browser) return null;

  return await tryCatchAsync
  (
    async (
    ): Promise < BetarenaUser > =>
    {
      const
        docRef = doc
        (
          db_firestore,
          'betarena_users',
          uid!
        ),
        docSnap = await getDoc(docRef),
        lang = sessionStore.extract<string>('lang')
      ;

      // ╭─────
      // │ CHECK
      // │ > for existing document (user).
      // ╰─────
      if (docSnap.exists())
      {
        // [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            '🟢 Target UID exists',
            `🟦 var: docSnap ${docSnap.data()}`
          ]
        );

        return docSnap.data() as BetarenaUser;
      }

      // [🐞]
      dlogv2
      (
        AU_W_TAG[0],
        [
          '🔴 Target UID does not exists',
          '🔵 Creating new BetarenaUser instance'
        ]
      );

      const
        /**
         * @description
         * 📝 **NEW** user instance.
         */
        scoresUserData: BetarenaUser
          = {
            lang,
            registration_type: [authProviderType],
            username: generateUsername('', 0, 10),
            register_date: firebaseUser.metadata.creationTime,
            profile_photo: firebaseUser.photoURL,
            web3_wallet_addr: web3WalletAddress || undefined
          },
        /**
         * @description
         * 📝 **NEW** user instance.
         */
        userObject: IScoreUser
          = {
            firebase_user_data: firebaseUser,
            scores_user_data: scoresUserData
          }
      ;

      // ╭─────
      // │ NOTE:
      // │ > populate user data to firestore (DB)
      // ╰─────
      await createFirestoreUser(userObject);

      return scoresUserData;
    },
    (
      ex: unknown
    ): null =>
    {
      // [🐞]
      errlog(`❌ Error adding document: ${ex}`)

      // [🐞]
      if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
        console.info('❗️', '');
      else
        console.error('💀 Unhandled :: ex');
      ;

      return null;
    }
  ) as BetarenaUser | null;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Persist target **NEW** `user` to Firebase Firestore.
 * @param { IScoreUser } user
 *  💠 **[required]** Target **NEW** user `data` instance.
 * @return { Promise < void > }
 */
async function createFirestoreUser
(
  user: IScoreUser
): Promise < void >
{
  if (!browser) return;

  return await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 Persisting New User ${user.firebase_user_data?.uid} to Firestore`
      );

      const
        cookie = getCookie
        (
          document.cookie
        ),
        cookieValue = cookie.betarenaScoresCookieReferralCode
      ;

      // ╭─────
      // │ CHECK
      // │ > for referral cookie presence on new users.
      // ╰─────
      if (cookieValue)
      {
        user!.scores_user_data!.referredBy = cookieValue;

        // [🐞]
        console.log('📣', user!.scores_user_data!.referredBy);

        // ╭─────
        // │ NOTE:
        // │ > update referral creator with generated referral via firebase/functions.
        // ╰─────
        await post
        (
          `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}/users/data/update/referral-success`,
          // 'http://127.0.0.1:5001/betarena-ios/us-central1/api/users/data/update/referral-success'
          {
            referralId: cookieValue,
            referredNewUserUid: user.firebase_user_data?.uid
          }
        );
      }

      user!.scores_user_data!.referralID = `REF${Math.random().toString().slice(2, 7)}`;

      await setDoc
      (
        doc
        (
          db_firestore,
          'betarena_users',
          user.firebase_user_data?.uid!,
        ),
        JSON.parse(JSON.stringify(user.scores_user_data))
      );

      return;
    },
    (
      ex: unknown
    ): void =>
    {
      // [🐞]
      errlog(`❌ Error adding document: ${ex}`)
      return;
    }
  ) as void;
}
