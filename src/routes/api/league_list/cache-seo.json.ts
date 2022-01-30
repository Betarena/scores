// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { League_List_Cache_SEO_Ready } from '$lib/model/league_list/types'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(): Promise < League_List_Cache_SEO_Ready > {

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheLeagueListSEOResponse()
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
// - getCacheLeagueListSEOResponse(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheLeagueListSEOResponse(): Promise < League_List_Cache_SEO_Ready | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('seo', 'league_list');
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: League_List_Cache_SEO_Ready = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found seo - League List - in cache`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.debug("Unable to retrieve from cache", 'seo', 'league_list', e);
    }
    return
}