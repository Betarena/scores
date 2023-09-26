import { goto } from "$app/navigation";
import { post } from "$lib/api/utils.js";
import { userBalanceListen, userDataFetch } from "$lib/firebase/common.js";
import { delCookie, setCookie } from "$lib/store/cookie.js";
import userBetarenaSettings from '$lib/store/user-settings.js';

export const ROUTE_ID_PROFILE = '/u/[view]/[lang=lang]';

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 *
 * 📌 Initializes `user`.
 *
 * ⚡️ Sets `user` privilige cookie.
 *
 * ⚡️ Sets `user` data listeners.
 */
export async function initUser
(
  uid: string
): Promise<void>
{

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

}

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 *
 * 📌 Logs out `user` from platform.
 *
 * ⚡️ Toggles respective `UI` changes.
 *
 * ⚡️ Deletes `cookies` needed for `user` privilidges.
 */
export async function logoutUser
(
): Promise < void >
{
  delCookie
  (
    'betarenaCookieLoggedIn'
  );

  const userLang: string = userBetarenaSettings.getUserLang();
  const redirectLink = `/${userLang == 'en' ? '' : userLang}`

  await goto
  (
    redirectLink,
    {
      replaceState: true
    }
  );

  userBetarenaSettings.signOutUser();
}