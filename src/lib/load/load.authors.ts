// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader ('Client-Side')                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { ServerLoadEvent } from '@sveltejs/kit';

import { promiseUrlsPreload } from '$lib/utils/platform-functions.js';

import { dlogv2 } from '$lib/utils/debug.js';

import type { IArticleData, IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';

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
  IArticleData | undefined,
  IArticleTranslation | undefined
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
): Promise < {} >
{
  const
    // [🐞]
    t0: number = performance.now(),
    // ╭─────
    // │ NOTE:
    // │ > 📣 Destruct `object`.
    // ╰─────
    {
      permalink
    } = event.params,
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any = {}
  ;

  // ╭─────
  // │ TODO:
  // │ > url validation check
  // ╰─────

  [
    response.dataArticle,
    response.translationArticle
  ] = await fetchData
  (
    event.fetch,
    permalink,
    parentData.langParam
  );

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(authors)/a/[...permalink]/+page.server.ts',
    [
      `⏳ [AUTHORS] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
      // `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
    ],
    true
  );

  return response;
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
 * @param { string } _permalink
 *  💠 **[required]** Target `parmalink`.
 * @param { string } _lang
 *  💠 **[required]** Target `lang`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _permalink: string,
  _lang: string
): Promise < PreloadPromise0 >
{
  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/author?permalink=${_permalink}`,
        `/api/data/author?lang=${_lang}`
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data0
      = await promiseUrlsPreload
      (
        urls0
        , fetch
      ) as PreloadPromise0
  ;

  return data0;
}
