// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores SvelteKit Logic Wrapper                                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { goto } from '$app/navigation';

import { dlogv2 } from './debug.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 WRAPPER
 * @description
 *  📣 SvelteKit wrapper for `goto`.
 * @param { string } url
 *  💠 **[required]** Target `url` to navigate to.
 * @param { boolean } [replaceState=false]
 *  💠 [optional] Target `url` to navigate to.
 * @returns { Promise < void > }
 */
export async function gotoSW
(
  url: string,
  replaceState: boolean = false
): Promise < void >
{
  // [🐞]
  dlogv2
  (
    'gotoSW(..)',
    [
      `🔹 [var] ➤ url :|: ${url}`,
      `🔹 [var] ➤ replaceState :|: ${replaceState}`,
    ],
    false
  );
  await goto
  (
    url,
    {
      replaceState
    }
  );
  return;
}
