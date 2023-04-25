import { dlog, dlogv2, NB_W_TAG, NB_W_TOG } from "./debug";

/**
 * @description Simple function
 * to determine language (SSR) of platform
 * @param {string | undefined} page_route_id
 * @param {unknown | undefined} page_error
 * @param {string | undefined} page_params_lang
 * @returns string (language)
 */
export function platfrom_lang_ssr(
	page_route_id?: string | undefined,
	page_error?: unknown | undefined,
	page_params_lang?: string | undefined
): string {
  dlogv2(
    NB_W_TAG,
    [
      `page_route_id: ${page_route_id}`,
      `page_error: ${JSON.stringify(page_error, null, 2)}`,
      `page_params_lang: ${page_params_lang}`
    ],
    NB_W_TOG
  )
	// NOTE: default (EN)
	let server_side_language = 'en';
	// [ℹ] validation (#1)
  // [ℹ] errorPage
	const validation_1 =
		page_route_id == null 
    && page_error;
	if (validation_1) return server_side_language;
	// [ℹ] validation (#2)
  // [ℹ] if [[lang=lang]] page
	server_side_language = 
    (page_route_id.includes('[[lang=lang]]') || page_route_id.includes('[lang=lang]'))
    && page_params_lang != undefined
      ? page_params_lang
      : 'en'
  ;
  dlog(`${NB_W_TAG} server_side_language ➡️ ${server_side_language}`, NB_W_TOG)
	return server_side_language;
}

/**
 * @description Simple function to return
 * the TABLET and MOBILE viewport changes
 * as a array/tuple of both states
 * @param {number} TABLET_VIEW
 * @param {number}MOBILE_VIEW
 * @returns boolean (true/false)
 */
export function viewport_change(
	TABLET_VIEW: number,
	MOBILE_VIEW: number
) {
	const width = document.documentElement.clientWidth;
	const tabletExclusive =
    width >= TABLET_VIEW ? false : true;
	const mobileExclusive =
    width <= MOBILE_VIEW ? true : false;
	return [tabletExclusive, mobileExclusive];
}

/**
 * @summary [HELPER] method
 * @description validates for number of
 * null || undefined data points in target
 * data Array[];
 * @example [[object Object], [object Object], undefined] => null:
 * @param {unknown[]} data 
 * @returns NaN
 */
export function PRELOAD_invalid_data (
  data: unknown[]
): void {
  const indexesOf = (arr, item) =>
		arr.reduce(
			(acc, v, i) => (
				v === item && acc.push(i), acc
  ),[]);
	dlog(`null (preload): ${indexesOf(data, null)}`, true);
}
