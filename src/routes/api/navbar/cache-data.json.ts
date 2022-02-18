// ... import $app `modules`
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise< any > {
    // ... check for cache-existance;
    const response_cache = await getCacheNavBar()
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
// - getCacheNavBar()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheNavBar(): Promise < any | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('navbar', 'data');
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`;
            const parsed: any = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`✅ navbar-data retrieved from cache!`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.error("❌ unable to retrieve navbar-data from cache!", 'navbar', e);
    }
    return
}