import { json } from '@sveltejs/kit';

import {
    get_target_hset_cache_data,
    get_target_string_cache_data
} from '../../std_main';

import {
    LS2_C_D_A,
    LS2_C_S_A,
    LS2_C_T_A
} from '@betarena/scores-lib/dist/redis/config.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(req): Promise<unknown> {
	const lang: string =
		req.url['searchParams'].get('lang');
  const seo: string =
		req.url['searchParams'].get('seo');

	// [ℹ] (data)
	if (!lang && !seo) {
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
	if (lang && !seo) {
		const response_cache =
			await get_target_hset_cache_data(
				LS2_C_T_A,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [ℹ] (data)
	if (seo) {
		const response =
			await get_target_string_cache_data(
				LS2_C_S_A
			);
		if (response) {
			return json(response);
		}
		// [ℹ] otherwise, there is NO MATCHES available;
		return json(null);
	}

	// [ℹ] should never happen;
	return json(null);
}
