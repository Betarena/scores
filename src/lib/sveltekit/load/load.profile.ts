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

import { dlogv2 } from '$lib/utils/debug.js';
import { preloadRedirect, promiseUrlsPreload } from '$lib/utils/navigation.js';

import type { B_SAP_D2, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_USRG_D } from '@betarena/scores-lib/types/types.misc.userguide.js';
import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';
import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

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
  IProfileData | undefined,
  B_USRG_D | undefined
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
      // lang,
    } = event.params,
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    loggedInCookie
      = event.cookies.get('betarenaCookieLoggedIn'),
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any = {}
    ;

  if (loggedInCookie == undefined)
  {
    const
      url: string
        = parentData.langParam == 'en'
          ? '/'
          : `/${parentData.langParam}`
    ;
    preloadRedirect
    (
      url
    );
  }

  [
    response.B_SAP_D2,
    response.B_SAP_D3_SP_M,
    response.RESPONSE_PROFILE_DATA,
    response.profile_main_data,
    response.B_USRG_D
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam,
    event.locals.uid || ""
  );

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/+page.server.ts',
    [
      `⏳ [LEAGUE] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
      // `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
    ],
    true
  );

  return {
    ...response
  };
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
 *  💠 **[required]** Target `language`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  uid: string
): Promise < IPreloadData0 >
{
  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/main/seo-pages?months=true&lang=${_lang}&decompress`,
        '/api/data/main/seo-pages?term=football&decompress',
        `/api/data/profile.main?lang=${_lang}&uid=${uid}`,
        `/api/data/profile.main?uid=${uid}`,
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
