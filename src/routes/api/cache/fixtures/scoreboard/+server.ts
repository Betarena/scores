// [ℹ] import $app `modules`
import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { error, json } from '@sveltejs/kit';

import type { 
  REDIS_CACHE_SINGLE_scoreboard_data
} from '$lib/models/fixtures/scoreboard/types';

const cache_data_addr = "scoreboard_data"

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET (req, res): Promise < unknown > {

  const lang: string = req.url['searchParams'].get('lang');
  const fixture_id: string = req.url['searchParams'].get('fixture_id');

  if (fixture_id) {
    const response_cache = await get_cache_main_data (fixture_id)
    if (response_cache) {
      return json(response_cache)
    }
  }

  return json(null)
}

// ~~~~~~~~~
// REDIS
// ~~~~~~~~~

async function get_cache_main_data (
  fixture_id: string
): Promise < REDIS_CACHE_SINGLE_scoreboard_data | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cache_data_addr, fixture_id);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_scoreboard_data = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cache_data_addr} cache error`, e);
    return
  }
}