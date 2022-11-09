import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { error, json } from '@sveltejs/kit';

import type { 
  REDIS_CACHE_SINGLE_about_data, 
  REDIS_CACHE_SINGLE_about_translation 
} from '$lib/models/fixtures/about/types';

const cache_data_addr = "fixture_about_data"
const cache_trans_addr = "fixture_about_trans"

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET (req, res): Promise < unknown > {

  const lang: string = req.url['searchParams'].get('lang');
  const fixture_id: string = req.url['searchParams'].get('fixture_id');

  if (lang && !fixture_id) {
    const response_cache = await get_cache_translation_data (lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (lang && fixture_id) {
    const id = fixture_id + "_" + lang
    const response_cache = await get_cache_main_data (id)
    if (dev) console.log(`id: ${id}`)
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
): Promise < REDIS_CACHE_SINGLE_about_data | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cache_data_addr, fixture_id);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_about_data = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cache_data_addr} cache error`, e);
    return
  }
}

async function get_cache_translation_data (
  lang: string
): Promise < REDIS_CACHE_SINGLE_about_translation | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cache_trans_addr, lang);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_about_translation = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cache_trans_addr} cache error`, e);
    return
  }
}