// ... import $app `modules`
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { GET_FOOTER_DATA } from '$lib/graphql/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(req, res): Promise< any > {

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_cache = await getCacheNavBar()
    // ... DEBUGGING;
    if (dev) console.debug('-- response_cache --')
    // ... return RESPONSE;
    if (response_cache) {
        return {
            body: response_cache
        }
    }

	// ... otherwise, FALLBACK GRAQPH-QL response;
	const response = await initGrapQLClient().request(GET_FOOTER_DATA);
    // ... cache-response;
    await cacheNavBar(response)
	// ... DEBUGGING;
	if (dev) console.debug('-- response --');
	// ... return, RESPONSE;
	return {
		status: response.status,
		body: response
	};
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
      await redis.hset('footer', 'translation', JSON.stringify(json_cache));
      // ... DEBUGGING;
      if (dev) console.debug('navbar-translation successfully stored in cache!')
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", 'navbar', e);
    }
}

async function getCacheNavBar(): Promise < any | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('footer', 'translation');
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: any = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found navbar-translation-data in cache!`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.debug("Unable to retrieve from cache", 'navbar', e);
    }
    return
}