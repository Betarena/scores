import { ST_C_D_A, ST_C_T_A } from '@betarena/scores-lib/dist/redis/config';
import { json } from '@sveltejs/kit';

import {
    get_target_hset_cache_data
} from '../../std_main';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(req): Promise<unknown> {
	const lang: string =
		req?.url?.searchParams?.get('lang');
	const fixture_id: string =
		req?.url?.searchParams?.get('fixture_id');

	if (lang) {
		const response_cache =
			await get_target_hset_cache_data(
				ST_C_T_A,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	if (fixture_id) {
		const response_cache =
			await get_target_hset_cache_data(
				ST_C_D_A,
				fixture_id
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	return json(null);
}
