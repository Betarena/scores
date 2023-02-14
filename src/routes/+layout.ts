import { get } from '$lib/api/utils';
import {
	ERROR_CODE_PRELOAD,
	LAYOUT_1_LANG_PAGE_ERROR_MSG
} from '$lib/utils/debug';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export async function load({
	url,
	params,
	fetch,
	setHeaders
}): Promise<PageLoad> {

  // --------------
  // TEST
  // --------------

  /**
   * ==================
   * [ℹ] Attempt to Identify the USERS IP from "pre-load()"
   * [ℹ] only works in PROD with deployment of 'my_server.js'
  */

  // let response_IP_2;
  // ⚠❌ does not appear to work
  const response_IP = await fetch(`/getClientIP`, {
    method: 'GET'
  }).then((r) => r.json());
  console.log("🔵🔵🔵 response_IP: ", response_IP);
  
  // 🤔✅ works ? only on `same-origin-domain-deployment`
  const response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
  console.log("🔵🔵🔵 response_IP_2: ", response_IP_2);

  // --------------
	// [ℹ] preload data [1] DOC: REF: [2]
	// --------------

	const response_valid_url = await fetch(
		`/api/cache/_main_/pages_and_seo?url=${url.pathname}`,
		{
			method: 'GET'
		}
	).then((r) => r.json());

	const urlLang: string =
		params.lang == undefined ||
		!response_valid_url
			? 'en'
			: params.lang;

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

	setHeaders({
		'cache-control': 'public, max-age=3600'
	});
	return {
		HEADER_TRANSLATION_DATA,
		FOOTER_TRANSLATION_DATA
	};
}
