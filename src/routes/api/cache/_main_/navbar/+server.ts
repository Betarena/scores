import { NAV_C_T_A } from '@betarena/scores-lib/dist/redis/config';
import { json } from '@sveltejs/kit';

import {
    get_target_hset_cache_data
} from '../../std_main';

/** @type {import('./$types').RequestHandler} */
export async function GET(req): Promise<unknown> {
	const lang: string =
		req?.url?.searchParams?.get('lang');

	const response_cache =
		await get_target_hset_cache_data(
			NAV_C_T_A,
			lang
		);

	if (response_cache) {
		return json(response_cache);
	}

	return json(null);
}
