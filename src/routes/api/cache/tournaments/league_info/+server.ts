import { json } from '@sveltejs/kit';

import { get_target_hset_cache_data, league_info_cache_data_addr } from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req): Promise<unknown> {
	const url: string = req.url['searchParams'].get('url');

	const response_cache = await get_target_hset_cache_data(league_info_cache_data_addr, url);
	if (response_cache) {
		return json(response_cache);
	}

	// [ℹ] should never happen;
	return json(null);
}
