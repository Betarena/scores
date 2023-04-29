import {
  dlog,
  ERROR_CODE_INVALID,
  ERROR_CODE_PRELOAD,
  HOME_LANG_PAGE_ERROR_MSG,
  PAGE_INVALID_MSG
} from '$lib/utils/debug';
import { error } from '@sveltejs/kit';

import { PRELOAD_invalid_data } from '$lib/utils/platform-functions.js';
import type { PageLoad } from './$types';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({
	url,
	params,
	fetch
}): Promise<PageLoad> {

  const t0 = performance.now();

	const urlLang: string =
		params.lang == undefined 
      ? 'en' 
      : params.lang
  ;

	// --------------
	// [ℹ] preload data DOC: REF: [2]
	// --------------

	const urls = [
		`/api/cache/_main_/pages_and_seo?lang=${urlLang}&page=homepage`,
		// [ℹ] home
		`/api/cache/home/featured_match?lang=${urlLang}`,
		`/api/cache/home/featured_betting_sites?lang=${urlLang}`,
		`/api/cache/home/best_goalscorer?lang=${urlLang}`,
		`/api/cache/home/league_list?lang=${urlLang}`,
		`/api/cache/home/leagues_table?lang=${urlLang}`,
		`/api/cache/home/seo_block?lang=${urlLang}`,
		`/api/cache/home/livescores-v2?lang=${urlLang}`,
		`/api/cache/home/livescores-v2?seo=true&lang=${urlLang}`,
		// [ℹ] page validation check;
		`/api/cache/_main_/pages_and_seo?url=${url.pathname}`
	];

	const promises = urls.map((_url) =>
		fetch(_url).then((response) =>
			response.json()
		)
	);

	const data = await Promise.all(promises);
	dlog(data, false);

	const [
		PAGE_DATA_SEO,
		FEATURED_MATCH_WIDGET_DATA_SEO,
		FEATURED_BETTING_SITES_WIDGET_DATA_SEO,
		BEST_GOAL_SCORERS_DATA_SEO,
		LEAGUE_LIST_WIDGET_DATA_SEO,
		LEAGUES_TABLE_SCORES_SEO_DATA,
		SEO_BLOCK_DATA,
    LIVESCORES_V2_T_DATA,
    LIVESCORES_V2_SEO,
		VALID_URL
	] = data;

	// --------------
	// [ℹ] return(s)
	// --------------

	// [ℹ] exit;
	if (!VALID_URL) {
		throw error(
			ERROR_CODE_INVALID,
			PAGE_INVALID_MSG
		);
	}

	// [ℹ] FIXME: valid-page does not count data[7] - already checked
	const INVALID_PAGE_DATA_POINTS: boolean = data.includes(undefined);

	// FIXME: currently based on checking for any NULL/UNDEFINED data points
	// FIXME: should still allow for page access if page is VALID but widget data or
	// FIXME: otherwise page component is simply missing
	// [ℹ] exit;
	if (INVALID_PAGE_DATA_POINTS) {
		throw error(
			ERROR_CODE_PRELOAD,
			HOME_LANG_PAGE_ERROR_MSG
		);
	}

  PRELOAD_invalid_data(data)

  // [🐞]
  const t1 = performance.now();
  dlog(`⏳ [HOME] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)

	// FIXME: types not working
	return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // NOTE: issues with setting correct <PageLoad> types, 
    // NOTE: not being applied to return;
    // NOTE: not critical - can be silenced;
		PAGE_DATA_SEO,
		FEATURED_MATCH_WIDGET_DATA_SEO,
		FEATURED_BETTING_SITES_WIDGET_DATA_SEO,
		BEST_GOAL_SCORERS_DATA_SEO,
		LEAGUE_LIST_WIDGET_DATA_SEO,
		LEAGUES_TABLE_SCORES_SEO_DATA,
		SEO_BLOCK_DATA,
    LIVESCORES_V2_T_DATA,
    LIVESCORES_V2_SEO
	};
}
