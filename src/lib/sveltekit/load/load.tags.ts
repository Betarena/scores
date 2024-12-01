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

import { ERROR_CODE_INVALID, dlogv2 } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';

import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { B_SAP_D2 } from '@betarena/scores-lib/types/v8/preload.scores.js';
import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';

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
  { name, fetch, locals }
): Promise < IPageAuthorTagDataFinal >
{
  const
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    { isValid: isUrlValid }
      = await promiseValidUrlCheck
      (
        fetch,
        {
          authorTagsUrl: name
        }
      )
  ;

  if (!isUrlValid)
    preloadExitLogic
    (
      0,
      '(authors)/tag',
      ERROR_CODE_INVALID
    );
  ;
  const user = JSON.parse(locals.user);
  const [
    data
  ] = await fetchData
  (
    fetch,
    name,
    user.lang
    );

  /**
     * @description
     *  📣 `Data` object for target `route`.
     */
  const response = {
    ...data,
  };


  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(authors)/a/tag/[name]/+page.server.ts',
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
 * @param { string } _name
 *  💠 **[required]** Target `lang`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _name: string | undefined,
  lang = "en"
)
{
  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/author/tags?permalinkTag=${_name}&lang=${lang}`,
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
