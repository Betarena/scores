import { goto } from "$app/navigation";
import { userBalanceListen } from "$lib/firebase/common.js";
import { delCookie, setCookie } from "$lib/store/cookie.js";
import { userBetarenaSettings } from "$lib/store/user-settings.js";

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
export function initUser
(
  uid: string
): void
{

  const username = 'true';

  setCookie
  (
    'betarenaCookieLoggedIn',
    username,
    30
  );

  userBalanceListen
  (
    uid
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