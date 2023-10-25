// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Server Endpoint for Layouit Page (Prefetch) Data Load                  ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { PRELOAD_exitPage, promiseUrlsPreload } from '$lib/utils/platform-functions.js';
import DeviceDetector from "device-detector-js";
import parser from 'ua-parser-js';

import type { B_FOT_T } from '@betarena/scores-lib/types/footer.js';
import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export async function load
(
  event: ServerLoadEvent
): Promise < LayoutServerLoad >
{

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ request.headers.get('user-agent') ${JSON.stringify([...event.request.headers.entries()], null, 4)}`,
    false
  );

  // ### [🐞]
  const t0: number = performance.now();

  const
  {
    // url,
    fetch,
    params,
    request,
    setHeaders,
    // route
  } = event;

  // ### NOTE: | TEST: | STASH:
  // ### testing to identify USERS IP, from within load
  // ### only works with deployment using '<node-server>.js'
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

  // ### NOTE: | TEST:
  // ### identify 'user-agent' object data, for device type.
  const deviceType: string = detectDeviceWithUA
  (
    request?.headers?.get('user-agent') ?? ''
  );

  const _langUrl: string =
    [undefined, 'en'].includes(params?.lang)
    // ### FIXME:
    // ### interferes with [player=player] routeId.
    // || (!response_valid_url && route?.id != '/u/[view]/[lang=lang]')
    // || (route?.id != '/u/[view]/[lang=lang]')
      ? 'en'
      : params.lang
  ;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  //  📌 PREFETCH DATA                    ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
  [
    B_NAV_T,
    B_FOT_T,
    B_SAP_D3_CP_H
  ] = await fetchData
  (
    fetch,
    _langUrl
  );

  // ### IMPORTANT
  // ### exit condition.
  const if_M_0: boolean =
    B_NAV_T == undefined
    || B_FOT_T == undefined
  ;
	if (if_M_0)
  {
    PRELOAD_exitPage
    (
      t0,
      `[LAYOUT]`,
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );
	}

  // ### [🐞]
  const t1: number = performance.now();

  // ### [🐞]
  dlog
  (
    `⏳ [LAYOUT] preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  // ### NOTE: ### WARNING:
  // ### commented out due to interferences
  // ### with error logs and code-traces.
	setHeaders
  (
    {
		  'cache-control': 'public, max-age=3600'
	  }
  );

	return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error <whatever>
    // ### NOTE: FIXME:
    // ### issues with setting correct <PageLoad> types.
		B_NAV_T,
		B_FOT_T,
    deviceType,
    B_SAP_D3_CP_H
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
 *  📌 Target `types` for `_this_` page required at preload.
 */
type PP_PROMISE_0 =
[
  B_NAV_T | undefined,
  B_FOT_T | undefined,
  B_SAP_D3 | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  Target instance of `fetch` object.
 * @param { string } _lang
 *  Target `language`.
 * @returns { Promise < PP_PROMISE_0 > }
 */
async function fetchData
(
  fetch: any,
  _lang: string
): Promise < PP_PROMISE_0 >
{

  // ### [🐞]
  dlog
  (
    `🚏 checkpoint ➤ src/routes/+layout.ts fecthData(..)`
  );

  const urls_0: string[] =
  [
    `/api/data/main/navbar?lang=${_lang}&decompress`,
    `/api/data/main/footer?lang=${_lang}&decompress`,
    `/api/data/main/seo-pages?term=competitions&decompress`,
  ];

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    urls_0,
    fetch
  ) as PP_PROMISE_0;

  return data_0;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 Detect device used from target `User-Agent` data.
 * @see
 *  https://discord.com/channels/457912077277855764/1067871458233159750
 * @see
 *  https://discord.com/channels/457912077277855764/1067529519294070885/1067827869004341319
 * @param { string } userAgent
 *  Target `user-agent` string.
 * @returns { string }
 */
function detectDeviceWithUA
(
  userAgent: string
): string
{

  let deviceType: string = 'mobile';

  // ### NOTE:
  // ### using 'ua-parser-js' module.
  const parsedUA: parser.IResult = parser(userAgent);

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ detectDeviceWithUA(..) parsedUA ${JSON.stringify(parsedUA, null, 4)}`,
    false
  );

  deviceType = parsedUA?.device?.type ?? 'mobile';

  // ### NOTE:
  // ### using 'device-detector-js' module.
  const parsedUA_2: DeviceDetector.DeviceDetectorResult = new DeviceDetector().parse
  (
    userAgent
  );

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ detectDeviceWithUA(..) parsedUA_2 ${JSON.stringify(parsedUA_2, null, 4)}`,
    false
  );

  deviceType = parsedUA_2?.device?.type ?? 'mobile';

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ detectDeviceWithUA(..) deviceType ${deviceType}`,
    true
  );

  return deviceType;
}

// #endregion ➤ 🛠️ METHODS