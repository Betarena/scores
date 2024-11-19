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
import { infoMessages } from '$lib/components/ui/infomessages/infomessages.js';

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
): Promise<void>
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


/**
 * @author
 *  @izobov
 * @summary
 *  🟦 submit with custom notifications
 * @description
 *  📣 SvelteKit wrapper for `enchence`.
 * @param { string } url
 *  💠 **[required]** Target `url` to navigate to.
 * @param { boolean } [replaceState=false]
 *  💠 [optional] Target `url` to navigate to.
 * @returns { Promise < void > }
 */
export async function submitWrapper({ successMessage = "Success!", errorMessage = "An error occurred.", reset = false, cbAfter }: { successMessage?: string, errorMessage?: string, reset?: boolean, cbAfter?: ({ update, result }) => void } = {})
{
  const loadingId = infoMessages.add({
    type: "loading",
    text: "",
  });
  return async (e) =>
  {
    infoMessages.remove(loadingId);
    console.log("RESPONSE: ", e)
    if (e.result.type === "success")
    {
      infoMessages.add({
        type: "success",
        text: successMessage,
      });
    } else
    {
      infoMessages.add({
        type: "error",
        text: errorMessage,
      });
    }
    // Set invalidateAll to false if you don't want to reload page data when submitting
    if (cbAfter)
    {
      await cbAfter(e);
    }
    e.update({ invalidateAll: false, reset });
  };
}
