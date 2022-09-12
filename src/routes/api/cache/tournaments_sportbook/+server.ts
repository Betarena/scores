import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';

import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET (req, res): Promise< any > {

  const geoPos: string = req.url['searchParams'].get('geoPos');

  const response_cache = await getCacheNavBar(geoPos)
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

async function getCacheNavBar(geoPos: string): Promise < Cache_Single_SportbookDetails_Data_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('sportbook_details', geoPos);
    if (cached) {
      const parsed: Cache_Single_SportbookDetails_Data_Response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! sportbook_details cache error", e);
    return
  }
}