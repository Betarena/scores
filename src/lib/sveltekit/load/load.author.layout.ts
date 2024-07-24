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


import { promiseUrlsPreload } from '$lib/utils/navigation.js';

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
export async function main
  (
    {
      fetch,
      langParam
    }: { fetch: any, langParam: string }
  ): Promise<any[]>
{

  return fetchData
    (
      fetch,
      langParam
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
     *  📣 Load translations for articles layout
     */
    urls0
      = [
        `/api/data/author/tags?translation=${_lang}`,
        `/api/data/author/article?lang=${_lang}`,
        `/api/data/author/translations?lang=${_lang}`

      ]

  /**
   * @description
   *  📣 Target `data` returned.
  */
  const [translations, articleTranslation, profile_translation] = await promiseUrlsPreload(urls0, fetch);
  return {
    ...translations,
    ...profile_translation,
    readingTime: articleTranslation?.translation

  }
}
