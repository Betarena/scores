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
import { ERROR_CODE_INVALID } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';
import { normalizeSeo } from '$lib/utils/seo.js';
import { redirect } from '@sveltejs/kit';

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
    name,
    fetch,
    url
  }: {
    name: string,
    fetch: any,
    url: string
  }
): Promise<any[]>
{
  const
    // ╭─────
    // │ NOTE:
    // │ |: Destructure `object`.
    // ╰─────
    {
      isValid,
      objRedirect
    } = await promiseValidUrlCheck
    (
      fetch,
      {
        authorUrl: name
      }
    )
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📟 │ PERMALINK VALIDATION                                                        │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  if (objRedirect.isRedirect && objRedirect.strRedirectUrl != null)
    throw redirect
    (
      301,
      `/a/sportstack${objRedirect.strRedirectUrl}`
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

  return fetchData
  (
    fetch,
    name || '',
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
        `/api/data/author/sportstack?permalink=${_name}&page=0&sortPublishDate=desc&status=published`

      ],

    /**
   * @description
   *  📣 Target `data` returned.
  */
    [articles] = await promiseUrlsPreload(urls0, fetch);
  // preloadExitLogic
  if (articles.errorId) return preloadExitLogic(0, 'sportstack', ERROR_CODE_INVALID);
  const author = articles.mapAuthor[0] || [null, {}],
    sportstack = author[1].data || {};
  return {
    articles,
    seoTemplate: normalizeSeo(articles?.seoTamplate, { username_link: _name, ...sportstack, url })
  }
}
