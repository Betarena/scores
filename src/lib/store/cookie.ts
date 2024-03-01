// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Cookies Common Logic                                                    │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import cookie from 'cookie';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Sets target `cookie` on Scores Platform with specified values.
 * @param { string } cName
 *  💠 **[required]** target cookie name.
 * @param { string } cValue
 *  💠 **[required]** target cookie associated value.
 * @param { number } expDays
 *  💠 **[required]** target cookie days active (TTL).
 * @returns { void }
 */
export function setCookie
(
  cName: string,
  cValue: string,
  expDays: number
): void
{
  const currentDate = new Date();
  currentDate.setTime
  (
    currentDate.getTime() + (expDays * 24 * 60 * 60 * 1000)
  );
  const expires = `expires=${currentDate.toUTCString()}`;
  document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Retrives 'all' cookies present in given 'request' Header.
 * @param { string } cookiesInHeader
 *  💠 **[required]** Target `cookie` string.
 * @return { Record < string, string > }
 *  📤 Target `cookie` parsed.
 */
export function getCookie
(
  cookiesInHeader: string
): Record < string, string >
{
  return cookie.parse
  (
    cookiesInHeader ?? ''
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Deletes target `cookie` from `client`.
 * @return { void }
 */
export function delCookie
(
  cName: string
): void
{
  document.cookie = `${cName}=; Max-Age=0`;
  document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  return;
}
