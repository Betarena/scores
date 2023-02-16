import { dlog } from "./debug";

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
  dlog(`page_route_id: ${page_route_id}`, true)
  dlog(`page_error: ${page_error}`, true)
  dlog(`page_params_lang: ${page_params_lang}`, true)
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
  dlog(`➡️ ${server_side_language}`, true)
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
	const w = document.documentElement.clientWidth;
	const tabletExclusive =
		w >= TABLET_VIEW ? false : true;
	const mobileExclusive =
		w <= MOBILE_VIEW ? true : false;
	return [tabletExclusive, mobileExclusive];
}
