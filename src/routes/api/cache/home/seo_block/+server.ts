import { json } from '@sveltejs/kit';

import {
  get_target_hset_cache_data,
  seo_block_cache_trans_addr
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req): Promise<unknown> {
	const lang: string = req.url['searchParams'].get('lang');

	const response_cache = await get_target_hset_cache_data(seo_block_cache_trans_addr, lang);

	if (response_cache) {
		return json(response_cache);
	}

	return json(null);
}
