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

import { dlogv2 } from '$lib/utils/debug.js';
import { promiseUrlsPreload } from '$lib/utils/navigation.js';

import type { IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
import type { B_SAP_D2 } from '@betarena/scores-lib/types/v8/preload.scores.js';
import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';

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
    IArticleTranslation | undefined,
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
  ): Promise<any>
{
  const
    // ╭─────
    // │ NOTE:
    // │ > 📣 Destruct `object`.
    // ╰─────
    {
      name
    } = event.params
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    // isUrlValid
    //   = await promiseValidUrlCheck
    //   (
    //     event.fetch,
    //     {
    //       authorTagsUrl: name
    //     }
    //   )
    ;

  // if (!isUrlValid)
  //   preloadExitLogic
  //   (
  //     0,
  //     '(authors)/tag',
  //     ERROR_CODE_INVALID
  //   );
  // ;
  const [
    data,
    contentTranslations,
    articleTranslations,
  ] = await fetchData
    (
      event.fetch,
      name,
      parentData.langParam
    );
  const translations = { ...contentTranslations, readingTime: articleTranslations?.translation };

  /**
     * @description
     *  📣 `Data` object for target `route`.
     */

  const response = {
    ...data,
    translations
  };

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ src/routes/(authors)/a/content/+page.server.ts',
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
 *  💠 **[required]** Target `tag name`.
 * @param { string } _lang
 *  💠 **[required]** Target `lang`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
  (
    fetch: any,
    _lang: string
  )
{
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
