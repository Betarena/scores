// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)                                                                │
// │ |: Scores Authenticated User Common Logic
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import purify from 'dompurify';

import { userBalanceListen, userDataFetch } from '$lib/firebase/common.js';
import { delCookie, setCookie } from '$lib/store/cookie.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings, { type IDataProp } from '$lib/store/user-settings.js';
import { dlog, log_v3 } from '$lib/utils/debug.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import { dlogv2 } from './debug.js';
import { selectLanguage } from './navigation.js';
import { gotoSW } from './sveltekitWrapper.js';

import { auth, db_firestore, storage } from '$lib/firebase/init.js';
import { storePageProfileSettings } from '$lib/store/page.profile.settings.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import { doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref as refStorage } from 'firebase/storage';

import type { BetarenaUser } from '$lib/types/types.user-settings.js';

// #endregion ➤ 📦 Package Imports

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ USER AUTHENTICATION LIFECYCLE                                               │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @mbacharo
 * @summary
 *  📝 Authentication Helper Logic
 * @summary_tags
 *  - ♦️ IMPORTANT CRITICAL
 *  - 🔷 HELPER
 * @state_side_effect
 *  🔥 Triggered by 'side-effect' of `userBetarenaSettings`.
 * @error_handle_notice
 *  🔰 HANDLED
 *    │: Error is caught & handled.
 * @description
 *  📝 Login workflow for user:
 *  - [1] Initialize an **authenticated** `user`.
 *  - [2] Sets `user` privilige cookie.
 *  - [3] Sets `user` data listeners.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ initUser();
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Initialize an **authenticated** `user`.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : void
 *  [X]──────────────────────────────────────────────────────────────────
 * @return { Promise < void > }
 */
export async function helperUserInitialize
(
): Promise < void >
{
  const
    // ╭─────
    // │ NOTE: |:| 📝 Destruct Data (localStorage)
    // ╰─────
    {
      user:
      {
        firebase_user_data:
        {
          uid
        } = {},
        scores_user_data:
        {
          lang
        } = {}
      } = {}
    } = userBetarenaSettings.extractAll()
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ user.initUser(..) // START',
    [
      `🔹 [var] ➤ uid :: ${uid}`,
      `🔹 [var] ➤ lang :: ${lang}`
    ]
  );

  if (!uid) return;

  sessionStore.updateData
  (
    [
      ['globalStateAdd', 'Authenticated'],
      ['globalStateAdd', 'AuthenticatedAndInitialized']
    ]
  );

  setCookie
  (
    'betarenaCookieLoggedIn',
    'true',
    30
  );

  // ╭─────
  // │ TODO:
  // │ │: can be promoted to 'userDataFetch(..)' logic
  // ╰─────
  userBalanceListen
  (
    uid
  );

  await userDataFetch
  (
    uid
  );

  // ╭─────
  // │ TODO:
  // │ |: Needs to be uopdated to used the latest 'userDataFetch(..)' retrieved data, not doing this at the moment.
  // ╰─────
  selectLanguage
  (
    lang
  );

  return;
}

/**
 * @description
 * @param type
 * @returns
 */
export async function herlperUserAnonymousInitialize
(
  type: 'initialize' = 'initialize'
): Promise < void >
{
  const
    // ╭─────
    // │ NOTE: |:| 📝 Destruct Data (localStorage)
    // ╰─────
    {
      lang
    } = userBetarenaSettings.extractAll(),
    // ╭─────
    // │ NOTE: |:| 📝 Destruct Data (localStorage)
    // ╰─────
    {
      currentPageRouteId
    } = sessionStore.extractAll(),
    /**
     * @description
     *  📝 Redirect `link` to navigate to as a consequence of _logout_
     */
    redirectLink = `/${lang == 'en' || lang == undefined ? '' : lang}`
  ;

  // [🐞]
  log_v3
  (
    {
      strGroupName: '🚏 checkpoint ➤ userAnonymous(..) // START',
      msgs:
      [
        `🔹 [var] ➤ lang :: ${lang}`,
        `🔹 [var] ➤ currentPageRouteId :: ${currentPageRouteId}`,
        `🔹 [var] ➤ redirectLink :: ${redirectLink}`,
      ]
    }
  );

  async function _initializeAnonymous
  (
  ): Promise < void >
  {
    // [🐞]
    dlog('_initializeAnonymous(..) // START');

    await selectLanguage(lang);

    return;
  }

  await _initializeAnonymous();

  return;
}

/**
 * @author
 *  @mbacharo
 * @summary
 *  📝 Authentication Helper Logic
 * @summary_tags
 *  - ♦️ IMPORTANT
 *  - 🔷 HELPER
 * @state_side_effect
 *  🔥 Triggered by 'side-effect' of `userBetarenaSettings`.
 * @error_handle_notice
 *  🔰 HANDLED
 *    │: Error is caught & handled.
 * @description
 *  📝 Logout workflow for user.
 *  - [1] 📣 **Logs-out** `user` from platform.
 *  - [2] ⚡️ Toggles respective `UI` changes.
 *  - [3] ⚡️ Deletes `cookies` for `user` privilidges.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ logoutUser();
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Logout workflow for user.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : void
 *  [X]──────────────────────────────────────────────────────────────────
 * @return { Promise < void > }
 */
export async function logoutUser
(
): Promise < void >
{
  const
    // ╭─────
    // │ NOTE: |:| 📝 Destruct Data (localStorage)
    // ╰─────
    {
      user:
      {
        scores_user_data:
        {
          lang
        } = {}
      } = {}
    } = userBetarenaSettings.extractAll(),
    // ╭─────
    // │ NOTE: |:| 📝 Destruct Data (localStorage)
    // ╰─────
    {
      currentPageRouteId,
      serverLang
    } = sessionStore.extractAll()
  ;

  // [🐞]
  log_v3
  (
    {
      strGroupName: '🚏 checkpoint ➤ logoutUser(..) // START',
      msgs:
      [
        `🔹 [var] ➤ lang :: ${lang}`,
        `🔹 [var] ➤ serverLang :: ${serverLang}`,
        `🔹 [var] ➤ currentPageRouteId :: ${currentPageRouteId}`
      ]
    }
  );

  // ╭─────
  // │ CHECK:
  // │ │: for 'user' already being 'non-authenticated'.
  // ╰─────
  // if (checkNull(lang)) return;

  // eslint-disable-next-line one-var
  const
    /**
     * @description
     *  📝 Redirect `link` to navigate to as a consequence of _logout_
     */
    redirectLink = `/${lang == 'en' || lang == undefined ? '' : lang}`
  ;

  if (['Standard', 'ProfilePage'].includes(currentPageRouteId ?? ''))
    await gotoSW
    (
      redirectLink,
      true
    );
  ;

  userBetarenaSettings.updateData
  (
    [
      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: 'user-object' must be first, otherwise, 'language' will
      // │ |: trigger cascading 'user' logic, which should no longer exist.
      // ╰─────
      ['user-object', undefined],
      ['lang', serverLang]
    ]
  );

  sessionStore.updateData
  (
    [
      ['globalStateAdd', 'NotAuthenticated']
    ]
  );

  delCookie
  (
    'betarenaCookieLoggedIn'
  );

  return;
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 │ USER HELPER LOGIC                                                           │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @mbacharo
 * @summary
 *  📝 Authentication Helper Logic
 * @summary_tags
 *  - ♦️ IMPORTANT
 *  - 🔷 HELPER
 * @error_handle_notice
 *  🔰 HANDLED
 *    │: Error is caught & handled.
 * @description
 *  📝 Update user profile data.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ updateUserProfileData
 *  │ (
 *  │   {
 *  │     ...
 *  │   } as BetarenaUser
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Update user profile data.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : void
 *  [X]──────────────────────────────────────────────────────────────────
 * @param { BetarenaUser } objUserNewData
 *  ❗️ **REQUIRED** Object containing new user data.
 * @return { Promise < void > }
 */
export async function updateUserProfileData
(
  objUserNewData: BetarenaUser
): Promise < void >
{
  return await tryCatchAsync
  (
    async (
    ) =>
    {
      const
        /**
         * @description
         * 📝 User `object` instance (snapshot)
         */
        objUser = userBetarenaSettings.extractAll(),
        /**
         * @description
         * 📝 User `object` for data properties to be updated.
         */
        objDataToUpdate: BetarenaUser = {}
      ;

      // [🐞]
      log_v3
      (
        {
          strGroupName: 'updateUserProfileData(..) // START',
          msgs:
          [
            `🔹 [var] ➤ objUserNewData :|: ${JSON.stringify(objUserNewData)}`,
            `🔹 [var] ➤ objUser :|: ${JSON.stringify(objUser)}`
          ]
        }
      );

      if (!objUser)
        throw new Error('🔴 User not found...');
      ;

      // ╭─────
      // │ NOTE:
      // │ |: Check for changes in `user` data, to avoid unnecessary updates when no changes are detected.
      // ╰─────

        Object.keys(objUserNewData).forEach(key => {
          if (![objUser.user?.scores_user_data?.[key], '', undefined].includes(objUserNewData[key])) {
            objDataToUpdate[key] = objUserNewData[key];
          }
        });

        if (Object.keys(objDataToUpdate).length == 0) {
          // [🐞]
          dlog('🔴 No changes detected...');
          return;
        }

      // ╭─────
      // │ NOTE:
      // │ |: Complenentary functions to handle updates to:
      // │ |: - [1] username
      // │ |: - [2] profile_picture
      // ╰─────

      async function _upsertProfileUsername
      (
      ): Promise < void >
      {
        // [🐞]
        dlog('_upsertProfileUsername(..) // START');

        const
          /**
           * @description
           * 📝 Data Response (0)
           */
          dataRes0
            = await new Betarena_User_Class().upsertUsername
            (
              {
                query: {},
                body:
                {
                  uid: objUser!.user?.firebase_user_data?.uid,
                  newUsername: objDataToUpdate.username,
                  isGenerateNew: false
                }
              }
            )
        ;

        if (dataRes0.error)
        {
          // [🐞]
          dlog('🔴 Username is invalid...');

          storePageProfileSettings.updateData
          (
            [
              [ 'globalSateErrorAdd', 'ErrorUsername' ],
              [ 'globalStateErrorUsername', dataRes0.error.cause.validation ]
            ]
          );

          throw new Error('🔴 Username is invalid...');
        }
      }

      function _deleteProfilePicture
      (
      ): void
      {
        // [🐞]
        dlog('_deleteProfilePicture(..) // START');

        deleteObject
        (
          refStorage
          (
            storage,
            `Users_data/${objUser.user?.firebase_user_data?.uid}/profile-pic.png`
          )
        ).catch
        (
          (error) =>
          {
            dlog('🔴 Error deleting profile picture...', error);
          }
        );

        return;
      }

      if (objDataToUpdate.username)
        await _upsertProfileUsername();
      ;
      if (objDataToUpdate.profile_photo === null)
        _deleteProfilePicture();
      ;

      const
        /**
         * @description
         * 📝 List of data properties to update
         */
        listDataToUpdate: [IDataProp, any][] = []
      ;

        // ╭─────
        // │ NOTE:
        // │ |: Loop through the (1) `object` containing 'NEW' data and (2) update the `data` accordingly.
        // ╰─────
        const keyMap = {
          "username": "user-name",
          'name': "user-name2",
          'about': 'user-about',
          'wallet_id': 'user-wallet',
          'profile_photo': 'user-avatar'
        }
        for (const key in objDataToUpdate) {
          const val = !['user-wallet', 'user-avatar'].includes(key) ?
            purify.sanitize(objDataToUpdate[key]) : objDataToUpdate[key];
          listDataToUpdate.push([keyMap[key] || key, val]);
          // [🐞]
          // dlog(`🔹 [var] ➤ key :|: ${key}`);
          // if (key === 'username')
          //   listDataToUpdate.push(['user-name', purify.sanitize(objDataToUpdate[key])]);
          // else if (key === 'name')
          //   listDataToUpdate.push(['user-name2', purify.sanitize(objDataToUpdate[key])]);
          // else if (key === 'about')
          //   listDataToUpdate.push(['user-about', purify.sanitize(objDataToUpdate[key])]);
          // else if (key === 'wallet_id')
          //   listDataToUpdate.push(['user-wallet', objDataToUpdate[key]]);
          // else if (key === 'profile_photo')
          //   listDataToUpdate.push(['user-avatar', objDataToUpdate[key]]);
          // ;
        }

      userBetarenaSettings.updateData(listDataToUpdate);

      storePageProfileSettings.updateData
      (
        [
          [ 'globalStateErrorUsername', null ],
          [ 'globalStateErrorRemove', 'ErrorUsername' ],
          [ 'globalStateAdd', 'ProfileUpdated' ]
        ]
      );

      await updateDoc
      (
        doc
        (
          db_firestore,
          'betarena_users',
          objUser.user?.firebase_user_data?.uid!
        ),
        {
          ...objDataToUpdate
        }
      );

      // [🐞]
      log_v3
      (
        {
          strGroupName: 'updateUserProfileData(..) // END',
          msgs:
          [
            `🔹 [var] ➤ listDataToUpdate :|: ${JSON.stringify(listDataToUpdate)}`,
            `🔹 [var] ➤ objDataToUpdate :|: ${JSON.stringify(objDataToUpdate)}`
          ]
        }
      );

      return;
    }
  );
}

/**
 * @author
 *  @mbacharo
 * @summary
 *  📝 Authentication Helper Logic
 * @summary_tags
 *  - ♦️ IMPORTANT
 *  - 🔷 HELPER
 * @error_handle_notice
 *  🔰 HANDLED
 *    │: Error is caught & handled.
 * @description
 *  📝 Delete user profile data
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ deleteUserProfile();
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Delete user profile data.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : void
 *  [X]──────────────────────────────────────────────────────────────────
 * @return { Promise < void > }
 */
export async function deleteUserProfile
(
): Promise < void >
{
  return await tryCatchAsync
  (
    async (
    ) =>
    {
      const
        /**
         * @description
         * 📝 User `object` instance (snapshot)
         */
        objUser = userBetarenaSettings.extractAll()
      ;

      // [🐞]
      log_v3
      (
        {
          strGroupName: 'deleteUserProfile(..) // START',
          msgs:
          [
            `🔹 [var] ➤ objUser :|: ${JSON.stringify(objUser)}`
          ]
        }
      );

      if (!objUser)
        throw new Error('🔴 User not found...');
      ;

      const
        /**
         * @description
         * 📝 Data Response (0)
         */
        dataRes0
          = await new Betarena_User_Class().deleteUser
          (
            {
              query:
              {
                firebaseAuthToken: (await auth.currentUser?.getIdToken()),
                uid: objUser!.user?.firebase_user_data?.uid
              },
              body: {}
            }
          )
      ;

      if (dataRes0.error)
        throw new Error(JSON.stringify(dataRes0.error));
      ;

      await logoutUser();

      return;
    },
    (
      error: Error
    ) =>
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: 'deleteUserProfile(..) // ERROR',
          msgs:
          [
            '🔴 Error deleting user profile...',
            error.message
          ]
        }
      );

      return;
    }
  );
}
