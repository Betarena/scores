// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { redirect, ServerLoadEvent } from '@sveltejs/kit';

import { mapLangToLocaleAuthor } from '$lib/constants/instance.js';
import { dlogv2, ERROR_CODE_INVALID } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';
import { parseObject } from '$lib/utils/string.2.js';

import type { IPageAuhtorArticleDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { B_SAP_D2 } from '@betarena/scores-lib/types/v8/preload.scores.js';
import type { IPageArticleTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.articles.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Debugging tag.
   */
  strDebugModule = 'src/routes/(authors)/a/[...permalink]/+page.server.ts'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ ⛩️ TYPES

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📝 Target `types` for `_this_` page required at preload.
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
 *  🔹 INTERFACE
 * @description
 *  📝 Interface for `_this_` page required at preload.
 */
interface IPreloadResponse
{
  dataArticle?: IPageAuhtorArticleDataFinal;
  translationArticle?: IPageArticleTranslationDataFinal;
  monthTranslations?: B_SAP_D2;
}

// #endregion ➤ ⛩️ TYPES

/**
 * @author
 *  @migbash
 * @summary
 *  ♦️ MAIN
 * @description
 *  📝 Logic for 'src/routes/(authors)/a/[...permalink]/+page.server.ts' route data preload.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ main
 *  │ (
 *  │   <-sveltekit-server-preload-event-instance->
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Main logic for route `src/routes/(authors)/a/[...permalink]/+page.server.ts` for respective data preload.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : Returns `data` for `_this_` preload.
 *  [X]──────────────────────────────────────────────────────────────────
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
): Promise < IPreloadResponse >
{
  // [🐞]
  dlogv2
  (
    `🚏 checkpoint ➤ ${strDebugModule} main(..) // START`,
    [
      `🔹 [var] ➤ parentData :|: ${parseObject(parentData)}`,
    ]
  );

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
     *  📝 Initialize page objResponse
     */
    objResponse: IPreloadResponse = {}
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
    objResponse.dataArticle,
    objResponse.translationArticle,
    objResponse.monthTranslations,
  ] = await fetchData
  (
    event.fetch,
    permalink!,
    parentData.langParam
  );

  // ╭─────
  // │ NOTE: IMPORTANT
  // │ |: Necesssary to assign the article 'lang' to the 'html lang' attribute.
  // ╰─────
  event.locals.strLocaleOverride = mapLangToLocaleAuthor.get(objResponse.dataArticle?.article.lang ?? 'en');

  // [🐞]
  dlogv2
  (
    `🚏 checkpoint ➤ ${strDebugModule}`,
    [
      // `🔹 [var] ➤ objResponse :|: ${JSON.stringify(objResponse)}`,
    ]
  );

  return objResponse;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔷 HELPER
 * @description
 *  📝 Fetches target data for `_this_` page.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ fetchData
 *  │ (
 *  │   <-sveltekit-fetch-instance->,
 *  │   'es'
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Fetches target data for `_this_` page.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : Returns `data` for `_this_` page.
 *  [X]──────────────────────────────────────────────────────────────────
 * @param { any } fetch
 *  ❗️ **REQUIRED** Instance of `fetch` object.
 * @param { string } permalink
 *  ❗️ **REQUIRED** `parmalink`.
 * @param { string } lang
 *  ❗️ **REQUIRED** Target `lang`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  permalink: string,
  lang: string
): Promise < PreloadPromise0 >
{
  const
    /**
     * @description
     *  📝 Target `urls` to be `fetched`.
     */
    listUrls
      = [
        `/api/data/author/article?permalink=${permalink}`,
        `/api/data/author/article?lang=${lang}`,
        `/api/data/main/seo-pages?months=true&lang=${lang}&decompress`,
      ],
    /**
     * @description
     *  📝 Target `data` returned.
     */
    dataRes0
      = await promiseUrlsPreload
      (
        listUrls,
        fetch
      ) as PreloadPromise0
  ;

  return dataRes0;
}
