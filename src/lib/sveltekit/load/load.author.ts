// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @izobov                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader ('Client-Side')                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import type { ServerLoadEvent } from '@sveltejs/kit';

import { promiseUrlsPreload } from '$lib/utils/navigation.js';

import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import { normalizeSeo } from '$lib/utils/seo';
// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Logic for `[[lang=lang]]` route data preload.
 * @return { Promise < {} > }
 *  📤 Respective `data` for _this_ route.
 */
export function main
  (
    event: ServerLoadEvent,
  ): Promise<{
    data: any
  }>
{
  const
    // ╭─────
    // │ NOTE:
    // │ > 📣 Destruct `object`.
    // ╰─────
    {
      username
    } = event.params
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    // isUrlValid
    //   = await promiseValidUrlCheck
    //     (
    //       event.fetch,
    //       {
    //         authorUrl: username
    //       }
    //     )
    ;

  // if (!isUrlValid)
  //   preloadExitLogic
  //     (
  //       0,
  //       '(authors)/a/user/[username]',
  //       ERROR_CODE_INVALID
  //     );
  // ;

  return fetchData
    (
      event.fetch,
      username || "",
      event.url.origin,
    )
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  💠 **[required]** Target instance of `fetch` object.
 * @param { string } _name
 *  💠 **[required]** Target `tag username`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
  (
    fetch: any,
    _name: string,
    url,
  )
{
  const bu = new Betarena_User_Class();
  const { success } = await bu.obtainPublicInformationTargetUsers({ query: {}, body: { user_uids: [_name.toLowerCase()], isSearchByUsername: true } });

  const [user] = success.data;
  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/author/profile?uid=${user.uid}`,
      ];
  if (user.highlights?.sportstack)
  {
    urls0.push(`/api/data/author/sportstack?id=${user.highlights.sportstack}`);
  }

  return {
    author: user,
    articles: promiseUrlsPreload([`/api/data/author/profile?uid=${user.uid}`], fetch, "single"),
    highlited_sportstack: user.highlights?.sportstack ? promiseUrlsPreload([`/api/data/author/sportstack?id=${user.highlights.sportstack}`], fetch, "single") : undefined
  }
}
