import { SPD_C_D_A, SPD_C_D_A1 } from '@betarena/scores-lib/dist/redis/config';
import { json } from '@sveltejs/kit';

import {
    get_target_hset_cache_data
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req): Promise<unknown> {
	const geoPos: string =
		req?.url?.searchParams?.get('geoPos');
	const all: string =
		req?.url?.searchParams?.get('all');

	if (all && geoPos) {
		let response_cache =
			await get_target_hset_cache_data(
				SPD_C_D_A1,
				geoPos
			);
		if (response_cache) {
			return json(response_cache);
		} else {
			response_cache =
				await get_target_hset_cache_data(
					SPD_C_D_A1,
					'en'
				);
			return json(response_cache);
		}
	}

	if (!all) {
		let response_cache =
			await get_target_hset_cache_data(
				SPD_C_D_A,
				geoPos
			);
		if (response_cache) {
			return json(response_cache);
		} else {
			response_cache =
				await get_target_hset_cache_data(
					SPD_C_D_A,
					'en'
				);
			return json(response_cache);
		}
	}

	// [ℹ] should never happen;
	return json(null);
}
