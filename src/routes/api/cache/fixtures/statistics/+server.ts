import { json } from '@sveltejs/kit';

import {
    fixture_statistics_cache_data_addr, fixture_statistics_cache_trans_addr, get_target_hset_cache_data
} from '../../std_main';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(req): Promise<unknown> {
	const lang: string = req.url['searchParams'].get('lang');
	const fixture_id: string = req.url['searchParams'].get('fixture_id');

	if (lang) {
		const response_cache = await get_target_hset_cache_data(
			fixture_statistics_cache_trans_addr,
			lang
		);
		if (response_cache) {
			return json(response_cache);
		}
	}

	if (fixture_id) {
		const response_cache = await get_target_hset_cache_data(
			fixture_statistics_cache_data_addr,
			fixture_id
		);
		if (response_cache) {
			return json(response_cache);
		}
	}

	return json(null);
}
