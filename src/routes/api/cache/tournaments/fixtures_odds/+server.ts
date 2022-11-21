import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';

import {
	get_target_hset_cache_data,
	fixture_odds_cache_trans_addr,
	fixture_odds_cache_data_addr
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req, res): Promise<unknown> {
	const lang: string = req.url['searchParams'].get('lang');
	const league_id: string = req.url['searchParams'].get('league_id');

	if (lang) {
		const response_cache = await get_target_hset_cache_data(fixture_odds_cache_trans_addr, lang);
		if (response_cache) {
			return json(response_cache);
		}
	}

	if (league_id) {
		const response_cache = await get_target_hset_cache_data(
			fixture_odds_cache_data_addr,
			league_id
		);
		if (response_cache) {
			return json(response_cache);
		}
	}

	return json(null);
}
