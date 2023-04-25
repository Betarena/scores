import { STA_C_D_A, STA_C_T_A } from '@betarena/scores-lib/dist/redis/config';
import { json } from '@sveltejs/kit';

import {
    get_target_hset_cache_data
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req): Promise<unknown> {
	const lang: string =
		req?.url?.searchParams?.get('lang');
	const league_id: string =
		req?.url?.searchParams?.get('league_id');

	if (lang) {
		const response_cache =
			await get_target_hset_cache_data(
				STA_C_T_A,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	if (league_id) {
		const response_cache =
			await get_target_hset_cache_data(
				STA_C_D_A,
				league_id
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [ℹ] should never happen;
	return json(null);
}
