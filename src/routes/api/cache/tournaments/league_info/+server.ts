import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/navbar/types';

import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET (req, res): Promise< any > {

  const url: string = req.url['searchParams'].get('url');

  const response_cache = await getCacheNavBar(url)
  if (response_cache) {
    return json(response_cache)
  }

  // [ℹ] should never happen;
  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getCacheNavBar()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheNavBar(url: string): Promise < Cache_Single_Lang_Header_Translation_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('league_info', url);
    if (cached) {
      const parsed: any = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! league_info cache error", e);
    return
  }
}