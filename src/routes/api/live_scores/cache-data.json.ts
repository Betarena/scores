// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(req, res): Promise<any> {

 
    const response_usergeo = await getLiveScoresFootballLeagues()
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
// - getFeaturedMatchForGeoPosFromCache(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLiveScoresFootballLeagues(): Promise < any | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.get('live_scores_leagues');
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: any = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found seo - live_scores_leagues - in cache`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.debug("Unable to retrieve from cache", 'live_scores_leagues',  e);
    }
    return
}