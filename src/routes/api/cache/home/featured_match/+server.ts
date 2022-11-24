import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';

import {
	get_target_hset_cache_data,
	featured_match_cache_data_addr,
	featured_match_cache_trans_addr
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req, res): Promise<unknown> {
	const geoPos: string = req.url['searchParams'].get('geoPos');
	const lang: string = req.url['searchParams'].get('lang');

	// [ℹ] widget data
	if (geoPos) {
		// [ℹ] check for cache-existance [IN THE USER-GEO-POS];
		const response_usergeo = await get_target_hset_cache_data(
			featured_match_cache_data_addr,
			geoPos
		);
		const fixture_time = new Date(response_usergeo?.time);
		const in_future = fixture_time.getTime() > new Date().getTime();
		if (response_usergeo && in_future) {
			return json(response_usergeo);
		}

		// [ℹ] otherwise, return the "EN" version - default;
		const response_en = await get_target_hset_cache_data(featured_match_cache_data_addr, 'en');
		if (response_en) {
			return json(response_en);
		}

		// [ℹ] otherwise, there is NO MATCHES available;
		return json(null);
	}

	// [ℹ] translation (also SEO)
	if (lang) {
		const response_cache = await get_target_hset_cache_data(
			featured_match_cache_trans_addr,
			lang
		);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [ℹ] should never happen;
	return json(null);
}
