import {
  ERROR_CODE_PRELOAD,
  LAYOUT_1_LANG_PAGE_ERROR_MSG,
  dlog
} from '$lib/utils/debug';
import { error } from '@sveltejs/kit';

import type { LayoutLoad, PageLoadEvent } from './$types';
import { PRELOAD_invalid_data } from '$lib/utils/platform-functions.js';

/** @type {import('./$types').LayoutLoad} */
export async function load(event: PageLoadEvent): Promise<LayoutLoad> {

  const t0 = performance.now();

  const {
    // url,
    fetch,
    params,
    // setHeaders,
    // route
  } = event

  // ==================
  // NOTE: TEST
  // [ℹ] Attempt to Identify the USERS IP from "load()"
  // [ℹ] only works with deployment using '<node-server>.js'
  // ==================

  /*
  
    try {
      // [ℹ] V1 | ❌ does not appear to work - breaks platform
      // const response_IP = await fetch(`/getClientIP`, {
      // const response_IP_3 = await fetch(`https://betarena-scores-platform.herokuapp.com/getClientIP`, {
      // console.log("🔵🔵🔵 response_IP: ", response_IP);
      // [ℹ] V2 | ✅ works [?] but incorrect IP
      // console.log("🔵🔵🔵 event: ", event);
      // console.log("🔵🔵🔵 event.getClientAddress(): ", event?.getClientAddress());
      // [ℹ] V3 | ❓ works [?] but incorrect IP
      // const response_IP_3 = await get(`/getClientIP`)
      // console.log("🔵🔵🔵 response_IP_3: ", response_IP_3);
    } catch (error) {
      console.log(`🔴 ${error}`)
    }

    try {
      // [ℹ] V3 | ✅ works [?] only on when calling directly URL, not from .server.ts
      // NOTE: works when using the non +layout.ts/+page.ts file
      // const response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
      // OR:
      // const response_IP_2 = await fetch(`http://betarena-scores-platform.herokuapp.com/getClientIP`, {
      // 	  method: 'GET',
      //   }
      // ).then((r) => r.json())
      // .catch((error) => { console.log(error) });
      // console.log("🔵🔵🔵 response_IP_2: ", response_IP_2);
    } catch (error) {
      console.log(`🔴 ${error}`)
    }

  */

  // --------------
	// [ℹ] preload data [1] DOC: REF: [2]
	// --------------

	// const response_valid_url = await fetch(
	// 	`/api/cache/_main_/pages_and_seo?url=${url.pathname}`,
	// 	{
	// 		method: 'GET'
	// 	}
	// ).then((r) => r.json());
  
	const urlLang: string =
		params.lang == undefined
    // FIXME: interferes with [player=player] route;
    // || (!response_valid_url && route?.id != '/u/[view]/[lang=lang]')
    // || (route?.id != '/u/[view]/[lang=lang]')
			? 'en'
			: params.lang;

  // console.log('🔴 (+layout.ts) urlLang', urlLang)

	// --------------
	// [ℹ] preload data [2] DOC: REF: [2]
	// --------------

	const urls = [
		`/api/cache/_main_/navbar?lang=${urlLang}`,
		`/api/cache/_main_/footer?lang=${urlLang}`
	];

	const promises = urls.map((url) =>
		fetch(url).then((response) => response.json())
	);

	const data = await Promise.all(promises);

	const [
		HEADER_TRANSLATION_DATA,
		FOOTER_TRANSLATION_DATA
	] = data;

	// --------------
	// [ℹ] return(s)
	// --------------

	const INVALID_PAGE_DATA_POINTS: boolean =
		data.includes(undefined);

	// [ℹ] exit;
	if (INVALID_PAGE_DATA_POINTS) {
		throw error(
			ERROR_CODE_PRELOAD,
			LAYOUT_1_LANG_PAGE_ERROR_MSG
		);
	}

  PRELOAD_invalid_data(data)

  const t1 = performance.now();
  dlog(`⏳ [LAYOUT] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)

  // NOTE: interferes with error indentification
  // thus, kept disabled;
	// setHeaders({
	// 	'cache-control': 'public, max-age=3600'
	// });

	return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // NOTE: issues with setting correct <PageLoad> types, 
    // NOTE: not being applied to return;
    // NOTE: not critical - can be silenced;
		HEADER_TRANSLATION_DATA,
		FOOTER_TRANSLATION_DATA
	};
}
