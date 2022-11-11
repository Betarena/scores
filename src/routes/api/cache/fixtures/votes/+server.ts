import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { error, json } from '@sveltejs/kit';

import type {
  REDIS_CACHE_SINGLE_incidents_translation 
} from '$lib/models/fixtures/incidents/types';

const cache_trans_addr = "fixture_votes_trans"

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET (req, res): Promise < unknown > {

  const lang: string = req.url['searchParams'].get('lang');

  if (lang) {
    const response_cache = await get_cache_translation_data (lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  return json(null)
}

// ~~~~~~~~~
// REDIS
// ~~~~~~~~~

async function get_cache_translation_data (
  lang: string
): Promise < REDIS_CACHE_SINGLE_incidents_translation | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cache_trans_addr, lang);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_incidents_translation = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cache_trans_addr} cache error`, e);
    return
  }
}