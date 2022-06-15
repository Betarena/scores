// [ℹ] import $app `modules`
import { dev } from '$app/env'
import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/navbar/types';
import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/types';

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise< any > {

  const geoPos: string = req.url['searchParams'].get('geoPos');

  const response_cache = await getCacheNavBar(geoPos)

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

async function getCacheNavBar(geoPos: string): Promise < Cache_Single_SportbookDetails_Data_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('sportbook_details', geoPos);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: Cache_Single_SportbookDetails_Data_Response = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ sportbook_details cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! sportbook_details cache error", e);
    return
  }
}