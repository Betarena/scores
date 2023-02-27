import { json } from '@sveltejs/kit';

import {
  get_target_hset_cache_data,
  get_target_string_cache_data
} from '../../std_main';

import {
  LS2_C_D_A,
  LS2_C_T_A
} from 'betarena-types/redis/config';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(req): Promise<unknown> {
	const lang: string =
		req.url['searchParams'].get('lang');

	// [ℹ] (data)
	if (!lang) {
		const response =
			await get_target_string_cache_data(
				LS2_C_D_A
			);
		if (response) {
			return json(response);
		}
		// [ℹ] otherwise, there is NO MATCHES available;
		return json(null);
	}

	// [ℹ] (translation - inc. SEO)
	if (lang) {
		const response_cache =
			await get_target_hset_cache_data(
				LS2_C_T_A,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [ℹ] should never happen;
	return json(null);
}
