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

import DeviceDetector from 'device-detector-js';
import parser from 'ua-parser-js';

import { routeIdPageAuthors } from '$lib/constants/paths.js';
import { ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlog, dlogv2 } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload } from '$lib/utils/platform-functions.js';

import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_FOT_T } from '@betarena/scores-lib/types/types.main.footer.js';
import type { Cookies, ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load
(
  event: ServerLoadEvent
): Promise < LayoutServerLoad >
{
  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/+layout.server.ts',
    [
      `🔹 [var] ➤ request.headers.get('user-agent') :|: ${JSON.stringify([...event.request.headers.entries()], null, 4)}`,
    ],
    false
  );

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
    // [🐞]
    t0 = performance.now(),
    /**
     * @description
     *  📣 Destructing variables.
     */
    {
      // url,
      fetch,
      params,
      request,
      // setHeaders,
      route
    } = event,
    /**
     * @description
     *  📣 Identify 'user-agent' object data, for target user 'device' type.
     */
    deviceType
      = detectDeviceWithUA
      (
        request.headers.get('user-agent') ?? ''
      ),
    /**
     * @description
     *  📣 Target `lang` identification
     */
    langParam
      = detectPlatformLanguage
      (
        {
          parameterLanguage: params.lang,
          cookies: event.cookies,
          routeId: route.id
        }
      ),
    /**
     * @description
     *  📣 Preload Data.
     */
    [
      B_NAV_T,
      B_FOT_T,
      B_SAP_D3_CP_H
    ] = await fetchData
    (
      fetch,
      langParam
    )
  ;

  // [🐞]
  console.log('params.lang', params.lang, 'langParam', langParam);

  if (B_NAV_T == undefined || B_FOT_T == undefined)
    preloadExitLogic
    (
      t0,
      '[LAYOUT]',
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );
  ;

  const
    // [🐞]
    t1 = performance.now()
  ;

  // [🐞]
  dlog
  (
    `⏳ [LAYOUT] preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
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

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error 'unknown'
    // ╭─────
    // │ NOTE: FIXME:
    // │ > issues with setting correct <PageLoad> types.
    // ╰─────
    B_NAV_T,
    B_FOT_T,
    B_SAP_D3_CP_H,
    deviceType,
    langParam,
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
  B_NAV_T | undefined,
  B_FOT_T | undefined,
  B_SAP_D3 | undefined,
];

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
        '/api/data/main/seo-pages?term=competitions&decompress',
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

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Detect device used from target `User-Agent` data.
 * @param { string } userAgent
 *  💠 **[required]** Target `user-agent` string.
 * @see https://discord.com/channels/457912077277855764/1067871458233159750
 * @see https://discord.com/channels/457912077277855764/1067529519294070885/1067827869004341319
 * @returns { string }
 *  📤 Target `device` type.
 */
function detectDeviceWithUA
(
  userAgent: string
): string
{
  let
    /**
     * @description
     *  📣 Target `device type`.
     */
    deviceType: string = 'mobile'
  ;

  const
    /**
     * @description
     *  📣 Using `ua-parser-js` module.
     */
    parsedUA = parser(userAgent),
    /**
     * @description
     *  📣 Using 'device-detector-js' module.
     */
    parsedUA2
      = new DeviceDetector().parse
      (
        userAgent
      )
  ;

  // [🐞]
  dlogv2
  (
    'name',
    [
      `🔹 [var] ➤ detectDeviceWithUA(..) parsedUA ${JSON.stringify(parsedUA, null, 4)}`,
      `🔹 [var] ➤ detectDeviceWithUA(..) parsedUA2 ${JSON.stringify(parsedUA2, null, 4)}`,
      `🔹 [var] ➤ detectDeviceWithUA(..) deviceType ${deviceType}`,
    ],
    false
  );

  deviceType = (parsedUA.device.type ?? 'mobile');
  deviceType = (parsedUA2.device?.type ?? 'mobile');

  return deviceType;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Detect platform language.
 * @param { Object } opts
 *   💠 **[required]** Target method `arguments`.
 * @param { string | undefined } opts.parameterLanguage
 *  💠 **[required]** Preliminary detected language.
 * @param { Cookies } opts.cookies
 *  💠 **[required]** Request `cookies`.
 * @param { string | undefined | null } opts.routeId
 *  💠 **[required]** Request `route.id`.
 * @return { string }
 *  📤 Detected platform `language`.
 */
function detectPlatformLanguage
(
  opts:
  {
    parameterLanguage: string | undefined
    cookies: Cookies,
    routeId: string | undefined | null
  }
): string
{
  let
    /**
     * @description
     *  📣 Target deteted `language`.
     */
    urlLang
      = [undefined, 'en'].includes(opts.parameterLanguage)
        // ╭─────
        // │ FIXME:
        // │ > interferes with [player=player] routeId.
        // ╰─────
        // || (!response_valid_url && route?.id != '/u/[view]/[lang=lang]')
        // || (route?.id != '/u/[view]/[lang=lang]')
        ? 'en'
        : opts.parameterLanguage!
  ;

  const
    /**
     * @description
     *  📣 Extract target expected 'visitor' cookie preference data.
     */
    cookieValue = JSON.parse(opts.cookies.get('betarenaScoresCookie') ?? null)
  ;

  // [🐞]
  // console.log('urlLang', urlLang);

  // [🐞]
  // console.log('cookieValue', cookieValue);

  // ╭─────
  // │ CHECK
  // │ > for authors page, custom logic.
  // ╰─────
  if (opts.routeId == routeIdPageAuthors)
    urlLang = cookieValue.lang;
  ;

  // [🐞]
  console.log('urlLang', urlLang);

  return urlLang;
}

// #endregion ➤ 🛠️ METHODS
