// ... import $app `modules`
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { GET_WEBSITE_ALL_LANG_TRANSLATIONS } from '$lib/graphql/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(req, res): Promise< any > {

	// ... update cache response;
	const response = await initGrapQLClient().request(GET_WEBSITE_ALL_LANG_TRANSLATIONS);
    // ... cache-response;
    await cacheNavBar(response)
	// ... DEBUGGING;
	if (dev) console.debug('-- response --');
	// ... return, RESPONSE;
	return {
        status: 200,
        body: 'Success! Navbar Data Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheNavBar(json_cache)
// - getCacheNavBar()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheNavBar(json_cache: any) {
    // ... TRY;
    try {
      //... store (cache) featured_match response,
      await redis.hset('navbar', 'translation', JSON.stringify(json_cache));
      // ... DEBUGGING;
      if (dev) console.debug('navbar-translation successfully stored in cache!')
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", 'navbar', e);
    }
}