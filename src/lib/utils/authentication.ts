// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-07-01                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena // TS.Module // Authentication
// │ :| Main Scores Platform Authentication Logic
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { browser } from '$app/environment';
import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth';
import { doc, getDoc } from 'firebase/firestore';

import { app, auth, db_firestore } from '$lib/firebase/init.js';
import { getCookie } from '$lib/store/cookie.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import { AU_W_TAG, dlog, log_v3 } from './debug.js';

import type { BetarenaUser, IScoreUser } from '$lib/types/types.user-settings.js';
import type { IAuthType } from '@betarena/scores-lib/types/firebase/firestore.js';
import type { User } from 'firebase/auth';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  📝 Authentication General :: Helper
 * @summary_tags
 *  - ♦️ IMPORTANT
 *  - 🔷 HELPER
 * @error_handle_notice
 *  🔰 HANDLED
 *    │: Error is caught & handled.
 * @description
 *  📝 Final authentication step. Updates (1) `stores`, (2) `localStoreage` and (3) `UI`.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ successAuthComplete
 *  │ (
 *  │   'login',
 *  │   firebaseUser,
 *  │   '0x1234567890abcdef',
 *  │   'email'
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Final authentication step.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : boolean
 *  [X]──────────────────────────────────────────────────────────────────
 * @param { User } firebaseUser
 *  ❗️ **REQUIRED** User `data`.
 * @param { string } web3WalletAddress
 *  💠 [optional] User web3 wallet address.
 * @param { IAuthType } authProviderType
 *  ❗️ **REQUIRED** User authetication option used.
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
  // ╭─────
  // │ NOTE: IMPORTANT |:| Check for browser environment.
  // ╰─────
  if (!browser) return false;

  return await tryCatchAsync
  (
    async (
    ): Promise < boolean > =>
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ successAuthComplete(..) // START',
          msgs:
          [
            `🔹 [var] authType :: ${authType}`,
            `🔹 [var] firebaseUser :: ${firebaseUser}`,
            `🔹 [var] web3WalletAddress :: ${web3WalletAddress}`,
            `🔹 [var] authProviderType :: ${authProviderType}`
          ]
        }
      );

      const
        /**
         * @description
         * 📝 Retrieve (or, create) BetarenaUser.
         */
        betarenaUser
          = await getFirestoreBetarenaUser
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
          [ 'user-object', userObject ]
        ]
      );

      sessionStore.updateData
      (
        [
          [ 'currentToast', (authType == 'login' ? 'Auth_Success_L_Toast' : 'Auth_Success_R_Toast') ],
          [ 'currentModal', null ]
        ]
      );

      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ successAuthComplete(..) // END',
          msgs: []
        }
      );

      return true;
    }
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📝 Authenticate user with `Moralis Auth`.
 * @return { Promise < void > }
 */
export async function authWithMoralis
(
): Promise < void >
{
  // ╭─────
  // │ NOTE: IMPORTANT |:| Check for browser environment.
  // ╰─────
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

      // ╭─────
      // │ NOTE: STASHED |:| Redirect to invest box if user has intent.
      // ╰─────
      /*
        CHECK
        > for 'deep link' of invest box.
        if (investDepositIntent == 'true')
        {
          // [🐞]
          // alert('mavigating to invest-box');

          const targetUrl = `/u/investor/${$userBetarenaSettings.lang}`;

          // [🐞]
          console.log('targetUrl', targetUrl);

          await goto
          (
            targetUrl,
            {
              replaceState: true
            }
          );
        }
      */

      return;
    }
  );

  return;
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ HELPER                                                                      │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  📝 Firebase Firestore :: Helper
 * @summary_tags
 *  - ♦️ IMPORTANT
 *  - 🔷 HELPER
 * @error_handle_notice
 *  🔰 HANDLED
 *    │: Error is caught & handled.
 * @description
 *  📝 Retrieve **TARGET** `user` from Firebase Firestore.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ getFirestoreBetarenaUser
 *  │ (
 *  │   'uid-sample-1',
 *  │   firebaseUser,
 *  │   '0x1234567890abcdef',
 *  │   'email'
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Retrieve target user info from Firestore.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : BetarenaUser | null
 *  [X]──────────────────────────────────────────────────────────────────
 * @param { string } uid
 *  ❗️ **REQUIRED** User uid.
 * @param { User } firebaseUser
 *  ❗️ **REQUIRED** `Firebase/Authentication` data for respective `user`.
 * @param { string | undefined } web3WalletAddress
 *  ❗️ **REQUIRED** User `web3` address.
 * @param { IAuthType } authProviderType
 *  ❗️ **REQUIRED** User authentication `provider` used.
 * @return { Promise < BetarenaUser | null > }
 *  📤 Target (or, **NEWLY CREATED**) `user` data.
 */
async function getFirestoreBetarenaUser
(
  uid: string,
  firebaseUser: User,
  web3WalletAddress: string | undefined,
  authProviderType: IAuthType,
): Promise < BetarenaUser | null >
{
  // ╭─────
  // │ NOTE: IMPORTANT |:| Check for browser environment.
  // ╰─────
  if (!browser) return null;

  return await tryCatchAsync
  (
    async (
    ): Promise < BetarenaUser > =>
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ getFirestoreBetarenaUser(..) // START',
          msgs:
          [
            `🔹 [var] user :: ${uid}`,
            `🔹 [var] firebaseUser :: ${firebaseUser}`,
            `🔹 [var] web3WalletAddress :: ${web3WalletAddress}`,
            `🔹 [var] authProviderType :: ${authProviderType}`
          ]
        }
      );

      const
        /**
         * @description
         * 📝 Target user document snapshot.
         */
        documentSnapshot
          = await getDoc
          (
            doc
            (
              db_firestore,
              'betarena_users',
              uid!
            )
          )
      ;

      // ╭─────
      // │ CHECK:
      // │ |: for existing user & return respective user.
      // ╰─────
      if (documentSnapshot.exists())
      {
        // [🐞]
        log_v3
        (
          {
            strGroupName: '🚏 checkpoint ➤ getFirestoreBetarenaUser(..) // END',
            msgs:
            [
              '🚏 checkpoint ➤ user exists',
              `🔹 [var] documentSnapshot :: ${JSON.stringify(documentSnapshot.data(), null, 4)}`
            ]
          }
        );

        return documentSnapshot.data() as BetarenaUser;
      }

      // ╭─────
      // │ NOTE:
      // │ |: [else] create **NEW** user.
      // ╰─────

      const
        /**
         * @description
         * 📝 Obejct **NEW** user instance.
         */
        objUser: IScoreUser
          = {
            firebase_user_data: firebaseUser,
            scores_user_data: {
              lang: sessionStore.extract<string>('lang'),
              registration_type: [authProviderType],
              register_date: firebaseUser.metadata.creationTime,
              profile_photo: firebaseUser.photoURL,
              web3_wallet_addr: web3WalletAddress
            }
          },
        /**
         * @description
         * 📝 Data Response (0)
         * WARNING: Does not return `user` data, only `response`.
         *  - Use `dataRes1` for `user` data, defined below.
         */
        dataRes0
          = await new Betarena_User_Class().createUser
          (
            {
              query:
              {
                firebaseAuthToken: (await auth.currentUser?.getIdToken())
              },
              body:
              {
                uid: objUser.firebase_user_data!.uid,
                lang: objUser.scores_user_data!.lang,
                registration_type: objUser.scores_user_data!.registration_type,
                register_date: objUser.scores_user_data!.register_date,
                profile_photo: objUser.scores_user_data!.profile_photo,
                web3_wallet_addr: objUser.scores_user_data!.web3_wallet_addr,
                referredBy:
                  getCookie
                  (
                    document.cookie
                  ).betarenaScoresCookieReferralCode
              }
            }
          )
      ;

      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ getFirestoreBetarenaUser(..) // END',
          msgs:
          [
            `🔹 [var] dataRes0 :: ${JSON.stringify(dataRes0, null, 4)}`
          ]
        }
      );

      if (dataRes0.error)
        throw new Error(JSON.stringify(dataRes0.error));
      ;

      const
        /**
         * @description
         * 📝 Target user document snapshot.
         */
        dataRes1
          = await getDoc
          (
            doc
            (
              db_firestore,
              'betarena_users',
              uid!
            )
          )
      ;

      window?.fbq('track', 'CompleteRegistration');

      return dataRes1.data() as BetarenaUser;
    }
  );
}
