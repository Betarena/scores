// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { LiveScore_SEO_Game_Scoped_Lang } from '$lib/models/featured_betting_sites/firebase-real-db-interface';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(req, res): Promise<any> {

   let lang = req.url['searchParams'].get('lang');
    const response_usergeo = await getLiveScoresFootball(lang)
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

async function getLiveScoresFootball(lang:string): Promise < LiveScore_SEO_Game_Scoped_Lang[] | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('live_scores',lang);
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: LiveScore_SEO_Game_Scoped_Lang[] = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found seo - live_scores - in cache`);
            // ... return, cached data;
            return parsed;
        }
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.debug("Unable to retrieve from cache", 'live_scores', lang, e);
    }
    return
}