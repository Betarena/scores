// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Authenticated User Common Logic                                         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { type Page } from '@sveltejs/kit';
import { doc, updateDoc } from 'firebase/firestore';

import { post } from '$lib/api/utils.js';
import { userBalanceListen, userDataFetch } from '$lib/firebase/common.js';
import { db_firestore } from '$lib/firebase/init.js';
import { delCookie, setCookie } from '$lib/store/cookie.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlog, dlogv2 } from './debug.js';
import { selectLanguage } from './navigation.js';
import { gotoSW } from './sveltekitWrapper.js';

import type { IPageRouteId } from '$lib/types/types.session.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  - 📣 [1] Initialize an **authenticated** `user`.
 *  - 📣 [2] Sets `user` privilige cookie.
 *  - 📣 [3] Sets `user` data listeners.
 * @return { Promise < void > }
 */
export async function initUser
(
): Promise < void >
{
  const
    /**
     * @description
     * 📝 Data.
     */
    uid = userBetarenaSettings.extract('uid'),
    /**
     * @description
     * 📝 Data for `page`.
     */
    page = sessionStore.extract<Page>('page')
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ initUser(..)',
    [
      `🔹 [var] ➤ uid :|: ${uid}`,
    ],
    true
  );

  setCookie
  (
    'betarenaCookieLoggedIn',
    'true',
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

  sessionStore.updateData
  (
    'globalStateAdd',
    'Authenticated'
  );

  sessionStore.updateData
  (
    'globalStateAdd',
    'AuthenticatedAndInitialized'
  );

  selectLanguage
  (
    userBetarenaSettings.extract('lang-user'),
    page
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
 * @return { Promise < void > }
 */
export async function updateSelectLang
(
): Promise < void >
{
  const
    lang = userBetarenaSettings.extract('lang') as string | undefined | null,
    uid = userBetarenaSettings.extract('uid') as string | undefined | null,
    page = sessionStore.extract< Page >('page')
  ;

  if
  (
    page?.error
    || !page?.route.id
    || !lang
    || !uid
  )
    return;
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ updateSelectLang(..)',
    [
      `🔹 [var] ➤ opts.isPageError :|: ${page.error}`,
      `🔹 [var] ➤ opts.routeId :|: ${page.route.id}`,
      `🔹 [var] ➤ lang :|: ${lang}`,
      `🔹 [var] ➤ uid :|: ${uid}`,
    ],
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

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
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
    /**
     * @description
     *  📣 `lang` preference
     */
    userLang: string = userBetarenaSettings.extract('lang-user'),
    /**
     * @description
     *  📣 current `routeId`
     */
    currentRouteId: IPageRouteId = sessionStore.extract('routeId'),
    /**
     * @description
     *  📣 Redirect `user` to upon `logout`.
     */
    redirectLink = `/${userLang == 'en' || userLang == undefined ? '' : userLang}`
  ;

  if (currentRouteId != 'AuthorsPage')
    await gotoSW
    (
      redirectLink,
      true
    );
  ;

  userBetarenaSettings.updateData
  (
    'lang',
    sessionStore.extract('lang')
  );

  userBetarenaSettings.updateData
  (
    'user-object',
    undefined
  );

  return;
}
