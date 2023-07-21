import { goto } from "$app/navigation";
import { userBalanceListen } from "$lib/firebase/common.js";
import { setCookie } from "$lib/store/cookie.js";
import { userBetarenaSettings } from "$lib/store/user-settings.js";

export const ROUTE_ID_PROFILE = '/u/[view]/[lang=lang]';

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 * TODO: DOC:
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
  document.cookie = 'betarenaCookieLoggedIn' + '=; Max-Age=0';
  document.cookie = "betarenaCookieLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  await goto
  (
    `/${$userBetarenaSettings.lang == 'en' ? '' : $userBetarenaSettings.lang}`,
    {
      replaceState: true
    }
  );

  userBetarenaSettings.signOutUser();
}