// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { League_List_Cache_SEO_Ready } from '$lib/model/league_list/types'
import type { LiveScore_SEO_Game_Scoped_Lang } from '$lib/model/featured_betting_sites/firebase-real-db-interface';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get(req, res): Promise<any> {

    //let lang = req.searchParams['lang'];
   let lang = req.url['searchParams'].get('lang');
   console.log("lang is",lang);
    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getLiveScoresFootball(lang)
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