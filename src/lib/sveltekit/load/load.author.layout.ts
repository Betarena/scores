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

import { dlogv2 } from '$lib/utils/debug';
import { promiseUrlsPreload } from '$lib/utils/navigation.js';
import { parseObject } from '$lib/utils/string.2.js';

import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Debugging tag.
   */
  strDebugModule = 'src/routes/(authors)/a/+layout.server.ts'
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
type IPreloadData0 =
[
  any,
  any,
  any,
  any
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
  /**
   * @description
   *  📝 Target `data` returned.
   */
  translations?: undefined;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  articleTranslation?: undefined;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  profile_translation?: undefined;
}

// #endregion ➤ ⛩️ TYPES

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟥 │ LOGIC - MAIN                                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  ♦️ MAIN
 * @description
 *  📝 Logic for 'src/routes/(authors)/a/+layout.server.ts' route data preload.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ main
 *  │ (
 *  │   <-sveltekit-server-preload-event-instance->
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Main logic for route `src/routes/(authors)/a/+layout.server.ts` for respective data preload.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : Returns `data` for `_this_` preload.
 *  [X]──────────────────────────────────────────────────────────────────
 * @param { ServerLoadEvent } event
 *  ❗️ **REQUIRED** instance of `ServerLoadEvent` object.
 * @param { object } objParentPreloadData
 *  ❗️ **REQUIRED** instance of `object` containing `langParam`.
 * @param { string } objParentPreloadData.langParam
 *  ❗️ **REQUIRED** `langParam` for target language.
 * @return { Promise < {} > }
 *  📤 Respective `data` for _this_ route.
 */
export async function main
(
  event: ServerLoadEvent,
  objParentPreloadData:
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
      `🔹 [var] ➤ objParentPreloadData :|: ${parseObject(objParentPreloadData)}`,
    ]
  );

  let
    /**
     * @description
     *  📝 Initialize page response
     */
    objResponse: IPreloadResponse = {}
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🏗️ │ PAGE DATA BUNDLING                                                          │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  // ╭─────
  // │ NOTE:
  // │ |: Destruct `object`.
  // ╰─────
  [
    objResponse.translations,
    objResponse.articleTranslation,
    objResponse.profile_translation
  ] = await fetchData
  (
    event.fetch,
    objParentPreloadData.langParam
  );

  // ╭─────
  // │ NOTE: IMPORTANT
  // │ |: Requires flattening of first-level `object`, to prevent `undefined` values in page.
  // ╰─────
  objResponse = {
    // @ts-expect-error :: expceted to be destructed for respective page data, the way it was structured.
    ...objResponse.translations,
    // @ts-expect-error :: expceted to be destructed for respective page data, the way it was structured.
    ...objResponse.profile_translation,
    // @ts-expect-error :: expceted to be destructed for respective page data, the way it was structured.
    readingTime: objResponse.articleTranslation?.translation
  };

  // [🐞]
  dlogv2
  (
    `🚏 checkpoint ➤ ${strDebugModule} main(..) // END`,
    [
      // `🔹 [var] ➤ objResponse :|: ${JSON.stringify(objResponse)}`,
    ]
  );

  return objResponse;
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟦 │ LOGIC - HELPER                                                              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

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
 * @param { string } lang
 *  ❗️ **REQUIRED** `lang`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  lang: string
): Promise < IPreloadData0 >
{
  const
    /**
     * @description
     *  📝 Load translations for articles layout
     */
    listUrls
      = [
        `/api/data/author/tags?translation=${lang}`,
        `/api/data/author/article?lang=${lang}`,
        `/api/data/author/translations?lang=${lang}`

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
      ) as IPreloadData0
  ;

  return dataRes0;
}
