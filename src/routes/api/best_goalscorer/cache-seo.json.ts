// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { GoalScorers_Cache_SEO_Ready } from '$lib/models/best_goalscorer/types';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(req, res): Promise < any > {

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await get_Best_Goalscorer_CacheSEOResponse()
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

async function get_Best_Goalscorer_CacheSEOResponse(): Promise < GoalScorers_Cache_SEO_Ready | Record < string, never > > {
    // ... ℹ TRY;
    try {
        // ... ℹ cached data retrival;
        const cached: string = await redis.hget('seo', 'best_goalscorer');
        // ... ℹ check for `cached` data
        if (cached) {
            // ... ℹ convert the data from `string` to `JSON`
            const parsed: GoalScorers_Cache_SEO_Ready = JSON.parse(cached);
            // ... 🐛 DEBUGGING;
            if (dev) console.info(`✅ found seo - best_goalscorer - in cache`);
            // ... ℹ return, cached data;
            return parsed;
        }
    } 
    // ... ℹ CATCH, ERROR;
    catch (e) {
      // ... 🐛 DEBUGGING;
      console.debug("❌ unable to retrieve from cache", 'seo', 'best_goalscorer', e);
    }
    return
}