import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';

import {
	get_target_hset_cache_data,
	league_tables_cache_data_addr,
	league_tables_cache_trans_addr
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(
	req: { url: { [x: string]: { get: (arg0: string) => string } } },
	res: any
): Promise<unknown> {
	const geoPos: string = req.url['searchParams'].get('geoPos');
	const lang: string = req.url['searchParams'].get('lang');

	// [ℹ] widget data
	if (geoPos) {
		// [ℹ] check for cache-existance [IN THE USER-GEO-POS];
		const response_usergeo = await get_target_hset_cache_data(
			league_tables_cache_data_addr,
			geoPos
		);
		if (response_usergeo) {
			return json(response_usergeo);
		}

		// [ℹ] otherwise, return the "EN" version - default;
		const response_en = await get_target_hset_cache_data(league_tables_cache_data_addr, 'en');
		if (response_en) {
			return json(response_en);
		}

		// [ℹ] otherwise, there is NO MATCHES available;
		return json(null);
	}

	// [ℹ] translation (also SEO)
	if (lang) {
		const response_cache = await get_target_hset_cache_data(league_tables_cache_trans_addr, lang);
		if (response_cache) {
			return json(response_cache);
		}
	}

	return json(null);
}
