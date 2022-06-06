// ... import $app `modules`
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise< any > {
    // [ℹ] check for cache-existance;
    const response_cache = await getTournamentsPageData()
    // ... return RESPONSE;
    if (response_cache) {
        return {
            status: 200,
            body: response_cache
        }
    }
    // ... return, ERROR;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getTournamentsPageData()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTournamentsPageData(): Promise < any | Record < string, never > > {
  // [ℹ] TRY;
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('tournaments', 'data');
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`;
      const parsed: any = JSON.parse(cached);
      // [ℹ] DEBUGGING;
      if (dev) console.info(`✅ tournaments/data retrieved from cache!`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  // [ℹ] CATCH, ERROR;
  catch (e) {
    console.error("❌ unable to retrieve tournaments/data from cache!", 'tournaments', e);
  }
  return
}