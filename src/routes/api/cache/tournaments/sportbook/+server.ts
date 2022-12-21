import { json } from '@sveltejs/kit';

import {
    get_target_hset_cache_data, sportbook_details, sportbook_details_all
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req): Promise<any> {
	const geoPos: string = req.url['searchParams'].get('geoPos');
	const all: string = req.url['searchParams'].get('all');

	if (all && geoPos) {
		let response_cache = await get_target_hset_cache_data(sportbook_details_all, geoPos);
		if (response_cache) {
			return json(response_cache);
		} else {
			response_cache = await get_target_hset_cache_data(sportbook_details_all, 'en');
			return json(response_cache);
		}
	}

	if (!all) {
		let response_cache = await get_target_hset_cache_data(sportbook_details, geoPos);
		if (response_cache) {
			return json(response_cache);
		} else {
			response_cache = await get_target_hset_cache_data(sportbook_details, 'en');
			return json(response_cache);
		}
	}

	// [ℹ] should never happen;
	return json(null);
}
