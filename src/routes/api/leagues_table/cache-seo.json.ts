// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Leagues_Table_SEO_Cache_Ready } from '$lib/models/leagues_table/types';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(req, res): Promise < any > {

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await get_Leagues_Table_CacheSEOResponse()
    // ... DEBUGGING;
    // if (dev) console.debug('-- response_cache --', response_usergeo)
    // ... return RESPONSE;
    if (response_usergeo) {
        return {
            body: response_usergeo
        }
    }

    // ... should never happen;
    return {
        body: null
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - get_Leagues_Table_CacheSEOResponse(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_Leagues_Table_CacheSEOResponse(): Promise < Leagues_Table_SEO_Cache_Ready | Record < string, never > > {
    // ... ℹ TRY;
    try {
        // ... ℹ cached data retrival;
        const cached: string = await redis.hget('seo', 'leagues_table');
        // ... ℹ check for `cached` data
        if (cached) {
            // ... ℹ convert the data from `string` to `JSON`
            const parsed: Leagues_Table_SEO_Cache_Ready = JSON.parse(cached);
            // ... 🐛 DEBUGGING;
            if (dev) console.info(`✅ found seo - leagues_table - in cache`);
            // ... ℹ return, cached data;
            return parsed;
        }
    } 
    // ... ℹ CATCH, ERROR;
    catch (e) {
      // ... 🐛 DEBUGGING;
      console.debug("❌ unable to retrieve from cache", 'seo', 'leagues_table', e);
    }
    return
}