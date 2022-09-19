import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';

import redis from "$lib/redis/init_dev"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET (req, res): Promise< any > {

  const geoPos: string = req.url['searchParams'].get('geoPos');
  const all: string = req.url['searchParams'].get('all');

  if (all) {
    const response_cache = await getCacheAll(geoPos)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (!all) {
    const response_cache = await getCache(geoPos)
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [ℹ] should never happen;
  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCache(geoPos: string): Promise < Cache_Single_SportbookDetails_Data_Response | Record < string, never > > {
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

async function getCacheAll(geoPos: string): Promise < Cache_Single_SportbookDetails_Data_Response[] | Record < string, never > > {
  try {
    const cached: string = await redis.hget('sportbook_details_all', geoPos);
    if (cached) {
      const parsed: Cache_Single_SportbookDetails_Data_Response[] = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! sportbook_details_all cache error", e);
    return
  }
}