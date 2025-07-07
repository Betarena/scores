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

import { performance } from 'perf_hooks';

import { main as articleTrFetch } from '$lib/sveltekit/load/load.author.layout.js';
import { ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlogv2 } from '$lib/utils/debug';
import { detectDeviceWithUA } from '$lib/utils/device.js';
import { preloadExitLogic, promiseUrlsPreload } from '$lib/utils/navigation.js';
import { parseObject } from '$lib/utils/string.2.js';

import type { IAuthTrs } from '@betarena/scores-lib/types/auth.js';
import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
import type { B_FOT_T } from '@betarena/scores-lib/types/types.main.footer.js';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { TranslationSearchDataJSONSchema } from '@betarena/scores-lib/types/v8/_HASURA-0.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Debugging tag.
   */
  strDebugModule = 'src/routes/+layout.server.ts'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ ⛩️ TYPES

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📝 Type for `_this_` page required at preload.
 */
type IPreloadData0 =
[
  B_NAV_T | undefined,
  B_FOT_T | undefined,
  IAuthTrs | undefined,
  TranslationSearchDataJSONSchema | undefined,
  TranslationSearchDataJSONSchema | undefined
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
   *  📝 Target `lang` identification
   */
  langParam: string;
  /**
   * @description
   *  📝 Identify 'user-agent' object data, for target user 'device' type.
   */
  deviceType: string;
  /**
   * @description
   * 📝 Target `urls` to be `fetched`.
   */
  userAgent: string | null;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  B_NAV_T?: B_NAV_T | undefined;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  B_FOT_T?: B_FOT_T | undefined;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  authTrs?: IAuthTrs | undefined;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  translations?: unknown | undefined;
  /**
   * @description
   *  📝 Target `data` returned.
   */
  setState?: unknown;

    /**
   * @description
   *  📝 Translations for `search`.
   */
  search_translations?: TranslationSearchDataJSONSchema;
  app_install_translations?: TranslationSearchDataJSONSchema;
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
 *  📝 Logic for route `src/routes/+layout.server.ts` for respective data preload.
 * @example
 *  [1]──────────────────────────────────────────────────────────────────
 *  │ main
 *  │ (
 *  │   <-sveltekit-server-preload-event-instance->
 *  │ );
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ DESCRIPTION
 *  │ : Main logic for route `src/routes/+layout.server.ts` for respective data preload.
 *  ┣────────────────────────────────────────────────────────────────────
 *  │ OUTPUT
 *  │ : Returns `data` for `_this_` preload.
 *  [X]──────────────────────────────────────────────────────────────────
 * @param { ServerLoadEvent } event
 *  ❗️ **REQUIRED** instance of `ServerLoadEvent` object.
 * @return { Promise < {} > }
 *  📤 Respective `data` for _this_ route.
 */
export async function main
(
  event: ServerLoadEvent
): Promise < IPreloadResponse >
{
  // [🐞]
  dlogv2
  (
    `🚏 checkpoint ➤ ${strDebugModule} main(..) // START`,
    [
      `🔹 [var] ➤ request.headers.get('user-agent') :: ${parseObject(event.request.headers)}`,
    ]
  );

  // ╭─────
  // │ NOTE:
  // │ │: testing to identify 'users ip', from within load
  // │ │: only works with deployment using '<node-server>.js'
  // ╰─────
  /*
    try
    {
      // ╭─────
      // │ NOTE:
      // │ |: V1 | ❌ does not appear to work, breaks platform.
      // ╰─────
      // const response_IP = await fetch(`/getClientIP`, {..});
      // const response_IP_3 = await fetch(`https://XXXX/getClientIP`, {..}
      // console.log("🔵 response_IP: ", response_IP);

      // ╭─────
      // │ NOTE:
      // │ |: V2 | ✅ works [?] but incorrect IP.
      // ╰─────
      // console.log("🔵 event: ", event);
      // console.log("🔵 event.getClientAddress(): ", event?.getClientAddress());

      // ╭─────
      // │ NOTE:
      // │ |: V3 | ❓ works [?] but incorrect IP
      // ╰─────
      // const response_IP_3 = await get(`/getClientIP`)
      // console.log("🔵 response_IP_3: ", response_IP_3);
    }
    catch (error)
    {
      console.log(`🔴 ${error}`)
    }

    try
    {
      // ╭─────
      // │ NOTE:
      // │ |: V3 | ✅ works [?] only on when calling directly URL, not from .server.ts
      // │ │: works when using the non +layout.ts/+page.ts file
      // ╰─────
      // const response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
      // OR:
      // const response_IP_2 = await fetch(`http://betarena-scores-platform.herokuapp.com/getClientIP`, {
      // 	  method: 'GET',
      //   }
      // ).then((r) => r.json())
      // .catch((error) => { console.log(error) });
      // console.log("🔵 response_IP_2: ", response_IP_2);
    }
    catch (error)
    {
      console.log(`🔴 ${error}`)
    }
  */

  const
    /**
     * @description
     *  📝 `Data` object for target `route`.
     */
    objResponse: IPreloadResponse
      = {
        langParam: event.locals.user.lang!,
        deviceType:
          detectDeviceWithUA
          (
            event.request.headers.get('user-agent') ?? ''
          ),
        userAgent: event.request.headers.get('user-agent')
      }
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🏗️ │ PAGE DATA BUNDLING                                                          │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  // ╭─────
  // │ NOTE:
  // │ |: Destruct `object`.
  // ╰─────
  [
    objResponse.B_NAV_T,
    objResponse.B_FOT_T,
    objResponse.authTrs,
    objResponse.search_translations,
    objResponse.app_install_translations
  ] = await fetchData
  (
    event.fetch,
    objResponse.langParam
  );

  // ╭─────
  // │ NOTE:
  // │ |: check for 'undefined' values in critical data, causing exit logic.
  // ╰─────
  if (objResponse.B_NAV_T == undefined || objResponse.B_FOT_T == undefined)
    preloadExitLogic
    (
      performance.now(),
      '[LAYOUT]',
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );
  ;
  if (['/(scores)/[[lang=lang]]', '/(scores)/search'].includes( event.route.id || ""))
  {
    const
      /**
       * @description
       * 📝 Target `urls` to be `fetched`.
       */
      dataRes0
        = await articleTrFetch
        (
          event,
          {
            langParam: objResponse.langParam,
          }
        )
    ;

    objResponse.translations = dataRes0;
  }

  objResponse.setState = event.locals.setState;

  // [🐞]
  dlogv2
  (
    `🚏 checkpoint ➤ ${strDebugModule} main(..) // END`,
    [
      // `🔹 [var] ➤ objResponse :|: ${objResponse}`,
    ]
  );

  // ╭─────
  // │ NOTE: | WARNING:
  // │ │: commented out due to interferences
  // │ │: with error logs and code-traces.
  // ╰─────
  /*
    setHeaders
    (
      {
        'cache-control': 'public, max-age=3600'
      }
    );
  */

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
 *  ❗️ **REQUIRED** instance of `fetch` object.
 * @param { string } lang
 *  ❗️ **REQUIRED** `language`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 `Data` fetched.
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
     *  📝 Target `urls` to be `fetched`.
     */
    listUrls
      = [
        `/api/data/main/navbar?lang=${lang}&decompress`,
        `/api/data/main/footer?lang=${lang}&decompress`,
        `/api/hasura/_main_/auth?lang=${lang}`,
        `/api/data/translations?lang=${lang}&table=search`,
        `/api/data/translations?lang=${lang}&table=app_install`
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
