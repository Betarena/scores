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

import { ERROR_CODE_INVALID, dlogv2 } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';

import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { B_SAP_D2 } from '@betarena/scores-lib/types/v8/preload.scores.js';
import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type PreloadPromise0 =
  [
    IPageAuthorTagDataFinal | undefined,
    IPageAuthorTranslationDataFinal | undefined,
    B_SAP_D2 | undefined
  ];

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
export async function main
  (
    event: ServerLoadEvent,
    parentData:
      {
        langParam: string
      }
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
      parentData.langParam
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
 * @param { string } _lang
 *  💠 **[required]** Target `lang`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
  (
    fetch: any,
    _name: string,
    _lang: string
  )
{
  const bu = new Betarena_User_Class();
  const users = await bu.obtainPublicInformationTargetUsers([_name], true);
  const [user] = users;
  // const
  //   /**
  //    * @description
  //    *  📣 Target `urls` to be `fetched`.
  //    */
  //   urls0
  //     = [
  //       // `/api/data/author/profile?uid=${user.uid}`,


  //     ]

  //     /**
  //      * @description
  //      *  📣 Target `data` returned.
  //     */
  //    return {
  //      author: user,
  //      articles: promiseUrlsPreload
  //      (
  //        urls0
  //        , fetch
  //       )
  //    }

  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/author/content?lang=${_lang}`,
        `/api/data/author/tags?translation=${_lang}`,
        `/api/data/author/article?lang=${_lang}`,
      ];
  const d = await promiseUrlsPreload(urls0, fetch)
  return {
    author: user,
    articles: d
  }
}
