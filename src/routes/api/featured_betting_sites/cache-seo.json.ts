// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Scores_Featured_Betting_Sites_Hasura } from '$lib/model/featured_betting_sites/firebase-real-db-interface';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(req, res): Promise < any > {

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheFeaturedBettingSiteSEOResponse()
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
// - getCacheFeaturedBettingSiteSEOResponse(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheFeaturedBettingSiteSEOResponse(): Promise < Scores_Featured_Betting_Sites_Hasura | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('seo', 'featured_betting_sites');
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: Scores_Featured_Betting_Sites_Hasura = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found seo - featured_betting_sites - in cache`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.debug("Unable to retrieve from cache", 'seo', 'featured_betting_sites', e);
    }
    return
}