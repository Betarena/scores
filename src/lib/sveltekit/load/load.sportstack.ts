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
import { normalizeSeo } from '$lib/utils/seo.js';

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
    { name,
      fetch,
      url
    }: { name: string, fetch: any, url: string }
  ): Promise<any[]>
{

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
      fetch,
      name || "",
      url
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
    url,
  )
{
  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/author/sportstack?permalink=${_name}`

      ]

  /**
   * @description
   *  📣 Target `data` returned.
  */
  const [articles] = await promiseUrlsPreload(urls0, fetch);
  const author = articles.mapAuthor[0] || [null, {}];
  const sportstack = author[1].data || {};
  return {
    articles,
    seoTemplate: normalizeSeo(articles?.seoTamplate, { username_link: _name, ...sportstack, url })
  }
}
