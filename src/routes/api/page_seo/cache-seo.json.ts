// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_Pages_SEO } from '$lib/models/page_seo/types';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(): Promise < Hasura_Complete_Pages_SEO > {

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheHomepageSEODataResponse()
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

async function getCacheHomepageSEODataResponse(): Promise < Hasura_Complete_Pages_SEO | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('seo', 'page_homepage');
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: Hasura_Complete_Pages_SEO = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found seo - League List - in cache`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.debug("Unable to retrieve from cache", 'seo', 'page_homepage', e);
    }
    return
}