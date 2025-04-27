// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Layout Loader ('Server-Side')                               │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { performance } from 'perf_hooks';

import { ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlog, dlogv2 } from '$lib/utils/debug';
import { detectDeviceWithUA } from '$lib/utils/device.js';
import { detectPlatformLanguage } from '$lib/utils/languages.js';
import { preloadExitLogic, promiseUrlsPreload } from '$lib/utils/navigation.js';

import type { IAuthTrs } from '@betarena/scores-lib/types/auth.js';
import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_FOT_T } from '@betarena/scores-lib/types/types.main.footer.js';
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
  B_NAV_T | undefined,
  B_FOT_T | undefined,
  B_SAP_D3 | undefined,
  IAuthTrs | undefined
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
  event: ServerLoadEvent
): Promise < {} >
{
  // ╭─────
  // │ NOTE:
  // │ > testing to identify 'users ip', from within load
  // │ > only works with deployment using '<node-server>.js'
  // ╰─────
  /*
    try
    {
      // ### NOTE:
      // ### V1 | ❌ does not appear to work, breaks platform.
      // const response_IP = await fetch(`/getClientIP`, {
      // const response_IP_3 = await fetch(`https://betarena-scores-platform.herokuapp.com/getClientIP`, {
      // console.log("🔵 response_IP: ", response_IP);

      // ### NOTE:
      // ### V2 | ✅ works [?] but incorrect IP.
      // console.log("🔵🔵🔵 event: ", event);
      // console.log("🔵🔵🔵 event.getClientAddress(): ", event?.getClientAddress());

      // ### NOTE:
      // ### V3 | ❓ works [?] but incorrect IP
      // const response_IP_3 = await get(`/getClientIP`)
      // console.log("🔵🔵🔵 response_IP_3: ", response_IP_3);
    }
    catch (error)
    {
      console.log(`🔴 ${error}`)
    }

    try
    {
      // ### NOTE:
      // ### V3 | ✅ works [?] only on when calling directly URL, not from .server.ts
      // ### works when using the non +layout.ts/+page.ts file
      // const response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
      // OR:
      // const response_IP_2 = await fetch(`http://betarena-scores-platform.herokuapp.com/getClientIP`, {
      // 	  method: 'GET',
      //   }
      // ).then((r) => r.json())
      // .catch((error) => { console.log(error) });
      // console.log("🔵🔵🔵 response_IP_2: ", response_IP_2);
    }
    catch (error)
    {
      console.log(`🔴 ${error}`)
    }
  */
  const
    /**
     * @description
     *  📣 Identify 'user-agent' object data, for target user 'device' type.
     */
    deviceType
      = detectDeviceWithUA
      (
        event.request.headers.get('user-agent') ?? ''
      ),
    /**
     * @description
     *  📣 Target `lang` identification
     */
    langParam
      = detectPlatformLanguage
      (
        {
          parameterLanguage: event.params.lang,
          cookies: event.cookies,
          routeId: event.route.id
        }
      ),
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any
      = {
        langParam,
        deviceType
      }
  ;

  [
    response.B_NAV_T,
    response.B_FOT_T,
    response.authTrs
  ] = await fetchData
  (
    event.fetch,
    langParam
  );

  if (response.B_NAV_T == undefined || response.B_FOT_T == undefined)
    preloadExitLogic
    (
      performance.now(),
      '[LAYOUT]',
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/+page.server.ts',
    [
      `🔹 [var] ➤ response :|: ${JSON.stringify(response.PAGE_DATA_SEO)}`,
    ],
    true
  );

  // ╭─────
  // │ NOTE: | WARNING:
  // │ > commented out due to interferences
  // │ > with error logs and code-traces.
  // ╰─────
  /*
    setHeaders
    (
      {
        'cache-control': 'public, max-age=3600'
      }
    );
  */
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
 * @param { string } _lang
 *  💠 **[required]** Target `language`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 `Data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string
): Promise < IPreloadData0 >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ src/routes/+layout.ts fecthData(..)'
  );

  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0: string[]
      = [
        `/api/data/main/navbar?lang=${_lang}&decompress`,
        `/api/data/main/footer?lang=${_lang}&decompress`,
        `/api/hasura/_main_/auth?lang=${_lang}`,
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
