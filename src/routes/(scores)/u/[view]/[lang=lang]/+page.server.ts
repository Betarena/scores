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

import { getCookie } from '$lib/store/cookie.js';
import { preloadRedirect, promiseUrlsPreload } from '$lib/utils/platform-functions.js';

import type { B_SAP_D2, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_USRG_D } from '@betarena/scores-lib/types/types.misc.userguide.js';
import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';
import type { PageServerLoadEvent } from './$types';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').PageServerLoadEvent}
 */
export async function load
(
  event: PageServerLoadEvent
): Promise < PageServerLoadEvent >
{
  const
    {
      params,
      fetch
    } = event,
    /**
     * @description
     *  📣 Target `lang` identification
     */
    langParam: string
      = [undefined, 'en'].includes(params.lang)
        ? 'en'
        : params.lang,
    /**
     * @description
     *  📣 `Cookies` retrieve.
     */
    loggedInCookie: string | undefined
      = getCookie
      (
        event.request.headers.get('cookie') ?? ''
      ).betarenaCookieLoggedIn
  ;

  if (loggedInCookie == undefined)
  {
    const
      url: string
        = langParam == 'en'
          ? '/'
          : `/${langParam}`
    ;
    preloadRedirect
    (
      url
    );
  }

  const
    [
      B_SAP_D2,
      B_SAP_D3_SP_M,
      RESPONSE_PROFILE_DATA,
      B_USRG_D
    ] = await fetchData
    (
      fetch,
      langParam
    )
  ;

  return {
    // @ts-expect-error '<-error-desc->'
    B_SAP_D2,
    B_SAP_D3_SP_M,
    RESPONSE_PROFILE_DATA,
    B_USRG_D
  };
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData0 =
[
  IProfileTrs | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D2 | undefined,
  B_USRG_D | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  💠 Target instance of `fetch` object.
 * @param { string } _lang
 *  💠 Target `language`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string
): Promise < IPreloadData0 >
{
  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0: string[]
      = [
        `/api/data/main/seo-pages?months=true&lang=${_lang}&decompress`,
        '/api/data/main/seo-pages?term=football&decompress',
        `/api/data/profile?lang=${_lang}`,
        `/api/data/main/userguide?userguideId=2&lang=${_lang}`,
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data0
      = await promiseUrlsPreload
      (
        urls0,
        fetch
      ) as IPreloadData0
  ;

  return data0;
}

// #endregion ➤ 🛠️ METHODS
