// [ℹ] import $app `modules`
import { dev } from '$app/env'
import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/navbar/types';

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise< any > {

  const url: string = req.url['searchParams'].get('url');

  const response_cache = await getCacheNavBar(url)

  if (response_cache) {
    return {
      status: 200,
      body: response_cache
    }
  }

  // [ℹ] should never happen;
  return {
    body: null
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getCacheNavBar()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheNavBar(url: string): Promise < Cache_Single_Lang_Header_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('league_info', url);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: any = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ league_info cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! league_info cache error", e);
    return
  }
}