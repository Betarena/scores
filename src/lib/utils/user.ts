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

import { post } from '$lib/api/utils.js';
import { userBalanceListen, userDataFetch } from '$lib/firebase/common.js';
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
     * 📝 Data point
     */
    uid = userBetarenaSettings.extract<string>('uid')
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

  if (!uid) return;

  setCookie
  (
    'betarenaCookieLoggedIn',
    'true',
    30
  );

  await userDataFetch
  (
    uid
  );

  // ╭─────
  // │ TODO: :|: can be promoted to 'userDataFetch(..)' logic
  // ╰─────
  userBalanceListen
  (
    uid
  );

  // ╭─────
  // │ NOTE:
  // │ > pesists latest user data to `CRISP`
  // ╰─────
  await post
  (
    `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}${import.meta.env.VITE_FIREBASE_FUNCTIONS_F_1}`,
    {
      user_uids: [uid]
    }
  );

  sessionStore.updateData
  (
    [
      ['globalStateAdd', 'Authenticated'],
      ['globalStateAdd', 'AuthenticatedAndInitialized']
    ]
  );

  selectLanguage
  (
    userBetarenaSettings.extract<string>('lang-user')
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  - [1] 📣 **Logs-out** `user` from platform.
 *  - [2] ⚡️ Toggles respective `UI` changes.
 *  - [3] ⚡️ Deletes `cookies` for `user` privilidges.
 * @returns { Promise < void > }
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

  const
    /**
     * @description
     *  📣 **Authenticated User** `language` preference
     */
    userLang = userBetarenaSettings.extract<string>('lang-user')
  ;

  // ╭─────
  // │ CHECK :|: for 'user' already being non-authenticated.
  // ╰─────
  // if (checkNull(userLang)) return;

  // eslint-disable-next-line one-var
  const
    /**
     * @description
     *  📣 Current page `routeId`
     */
    currentRouteId = sessionStore.extract<IPageRouteId>('routeId'),
    /**
     * @description
     *  📣 Redirect `link` to navigate to as a consequence of _logout_
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
    [
      // ╭─────
      // │ NOTE: IMPORTANT
      // │ > 'user-object' must be first, otherwise, 'language' will
      // │ > trigger cascading 'user' logic, which should no longer exist.
      // ╰─────
      ['user-object', undefined],
      ['lang', sessionStore.extract('lang')]
    ]
  );

  delCookie
  (
    'betarenaCookieLoggedIn'
  );

  return;
}
