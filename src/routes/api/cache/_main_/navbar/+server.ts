import { json } from '@sveltejs/kit';
 
import { get_target_hset_cache_data, navbar_cache_trans_addr } from '../../std_main';

/** @type {import('./$types').RequestHandler} */
export async function GET (req, res): Promise< any > {

  const lang: string = req.url['searchParams'].get('lang');

  const response_cache = await get_target_hset_cache_data (
    navbar_cache_trans_addr,
    lang
  )

  if (response_cache) {
    return json(response_cache)
  }

  return json(null)
}