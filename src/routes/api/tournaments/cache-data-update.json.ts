
// [ℹ] import $app `modules`;
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_Tournaments_Type } from '$lib/models/tournaments/types'
import { GET_TOURNAMENTS_DATA } from '$lib/graphql/tournaments/query'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise< any > {
	// [ℹ] update cache w/ response;
	const response: Hasura_Complete_Tournaments_Type = await initGrapQLClient().request(GET_TOURNAMENTS_DATA)
  // [ℹ] cache-response;
  await cache_Tournaments_Data(response)
	// [ℹ] return statusE;
	return {
    status: 200,
    body: '✅ Success! Tournaments/Data REDIS cache data is updated!'
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cache_Tournaments_Data(geoPos, json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_Tournaments_Data(json_cache: Hasura_Complete_Tournaments_Type) {
  // [ℹ] TRY;
  try {
    // [ℹ] store (cache) featured_match response,
    await redis.hset('tournaments', 'data', JSON.stringify(json_cache));
    // [ℹ] DEBUGGING;
    if (dev) console.debug('✅ tournaments/data successfully stored in REDIS cache!')
  } 
  // [ℹ] CATCH, ERROR;
  catch (e) {
    console.error("❌ unable to cache", 'tournaments/data', e);
  }
}