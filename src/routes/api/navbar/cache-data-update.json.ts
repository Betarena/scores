// ... import $app `modules`
import { dev } from '$app/env'
// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_NAVBAR_DATA } from '$lib/graphql/header/query';
import type { Header_Translation_Response } from '$lib/models/navbar/types';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise< any > {
	// ... update cache response;
	const response: Header_Translation_Response = await initGrapQLClient().request(GET_NAVBAR_DATA);
  // ... cache-response;
  await cacheNavBar(response)
	// ... return, RESPONSE;
	return {
    status: 200,
    body: '✅ Success! Navbar cache data is updated!'
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheNavBar(json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheNavBar(json_cache: Header_Translation_Response) {
  // ... TRY;
  try {
    //... store (cache) featured_match response,
    await redis.hset('navbar', 'data', JSON.stringify(json_cache));
    // ... DEBUGGING;
    if (dev) console.debug('✅ navbar-data successfully stored in cache!')
  } 
  // ... CATCH, ERROR;
  catch (e) {
    console.error("❌ unable to cache", 'navbar-data', e);
  }
}