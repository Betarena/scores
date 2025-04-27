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

import { redirect, ServerLoadEvent } from '@sveltejs/kit';

import { dlogv2, ERROR_CODE_INVALID } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';

import type { B_SAP_D2 } from '@betarena/scores-lib/types/seo-pages.js';
import type { IPageAuhtorArticleDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { IPageArticleTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.articles.js';

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
  IPageAuhtorArticleDataFinal | undefined,
  IPageArticleTranslationDataFinal | undefined,
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
): Promise < {} >
{
  const
    // ╭─────
    // │ NOTE:
    // │ |: Destructure `object`.
    // ╰─────
    {
      permalink
    } = event.params,
    // ╭─────
    // │ NOTE:
    // │ |: Destructure `object`.
    // ╰─────
    {
      isValid,
      objRedirect
    } = await promiseValidUrlCheck
    (
      event.fetch,
      {
        authorArticleUrl: permalink
      }
    ),
    /**
     * @description
     *  📝 Initialize page response
     */
    response: any = {}
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📟 │ PERMALINK VALIDATION                                                        │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  if (objRedirect.isRedirect && objRedirect.strRedirectUrl != null)
    throw redirect
    (
      301,
      `/a${objRedirect.strRedirectUrl}`
    );
  else if (!isValid)
    preloadExitLogic
    (
      0,
      '(authors)',
      ERROR_CODE_INVALID
    );
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🏗️ │ PAGE DATA BUNDLING                                                          │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  [
    response.dataArticle,
    response.translationArticle,
    response.monthTranslations,
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
        `/api/data/author/article?permalink=${_permalink}`,
        `/api/data/author/article?lang=${_lang}`,
        `/api/data/main/seo-pages?months=true&lang=${_lang}&decompress`,
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
