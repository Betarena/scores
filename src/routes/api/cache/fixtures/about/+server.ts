import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

const cache_data_addr  = "fixture_about_data"
const cache_trans_addr = "fixture_about_trans"

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET (req, res): Promise < unknown > {

  const lang: string = req.url['searchParams'].get('lang');
  const fixture_id: string = req.url['searchParams'].get('fixture_id');

  if (lang && !fixture_id) {
    const response_cache = 
      await get_target_hset_cache_data (
        cache_trans_addr,
        lang
    );
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (lang && fixture_id) {
    const id = fixture_id + "_" + lang
    const response_cache = 
      await get_target_hset_cache_data (
        cache_data_addr,
        id
    );
    if (dev) console.log(`id: ${id}`)
    if (response_cache) {
      return json(response_cache)
    }
  }

  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHE [GET] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_hset_cache_data (
  key: string,
  id:  string
): Promise < unknown > {
  try {
    const cached: string = await redis.hget(key, id);
    if (cached) {
      const parsed: unknown = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${key} cache error`, e);
    return
  }
}