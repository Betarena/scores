// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Visitor/User Common Logic                                               │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { goto } from '$app/navigation';

import { post } from '$lib/api/utils.js';
import { userBalanceListen, userDataFetch } from '$lib/firebase/common.js';
import { db_firestore } from '$lib/firebase/init.js';
import { delCookie, setCookie } from '$lib/store/cookie.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { doc, updateDoc } from 'firebase/firestore';
import { dlog } from './debug.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Initialize an **authenticated** `user`.
 *  - ⚡️ Sets `user` privilige cookie.
 *  - ⚡️ Sets `user` data listeners.
 * @param { string } uid
 *  💠 **[required]** Target user `uid`.
 * @return { Promise < void > }
 */
export async function initUser
(
  uid: string
): Promise<  void >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ initUser(..)',
    true
  );

  const username = 'true';

  setCookie
  (
    'betarenaCookieLoggedIn',
    username,
    30
  );

  userDataFetch
  (
    uid
  );

  userBalanceListen
  (
    uid
  );

  await post
  (
    `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}${import.meta.env.VITE_FIREBASE_FUNCTIONS_F_1}`,
    {
      user_uids: [uid]
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 **Logs-out** `user` from platform.
 *  - ⚡️ Toggles respective `UI` changes.
 *  - ⚡️ Deletes `cookies` for `user` privilidges.
 * @return { Promise < void > }
 */
export async function logoutUser
(
): Promise < void >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ logoutUser(..)',
    true
  );

  delCookie
  (
    'betarenaCookieLoggedIn'
  );

  const
    userLang: string = userBetarenaSettings.extract('lang-user'),
    redirectLink = `/${userLang == 'en' ? '' : userLang}`
  ;

  await goto
  (
    redirectLink,
    {
      replaceState: true
    }
  );

  userBetarenaSettings.updateData
  (
    'user-object',
    undefined
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user` platform language preference.
 * @param { Object } opts
 *   💠 **[required]** Target method `arguments`.
 * @param { boolean } opts.isPageError
 *  💠 **[required]** Wether current page is of type `Error`.
 * @param { string | undefined | null } opts.routeId
 *  💠 **[required]** Current page `route.id`.
 * @returns { Promise < void > }
 */
export async function updateSelectLang
(
  opts:
  {
    isPageError: boolean,
    routeId: string | undefined | null,
  }
): Promise < void >
{
  const
    lang = userBetarenaSettings.extract('lang') as string | undefined | null,
    uid = userBetarenaSettings.extract('uid') as string | undefined | null
  ;

  if
  (
    !lang
    || opts.isPageError
    || !opts.routeId
    || !uid
  )
    return;
  ;

  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ updateSelectLang(..)',
    true
  );

  userBetarenaSettings.updateData
  (
    'lang-user',
    lang
  );

  const
    userRef = doc
    (
      db_firestore,
      'betarena_users',
      uid,
    )
  ;

  await updateDoc
  (
    userRef,
    {
      lang
    }
  );

  return;
}
