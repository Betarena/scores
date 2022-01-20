
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { FixtureResponse } from "$lib/model/interface-fixture"

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post({ params, request }, res): Promise < any > {
    // ... extract the 'geo_js';
    userGeo = await request.json(); // or request.json(), etc
    // ... DEBUGGING;
    if (dev) console.info('-- cache-data.json userGeo --', userGeo)

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getFeaturedMatchForGeoPosFromCache(userGeo)
    // ... DEBUGGING;
    // if (dev) console.debug('-- response_cache --', response_usergeo)
    // ... return RESPONSE;
    if (response_usergeo) {
        return {
            body: response_usergeo
        }
    }

    // ... otherwise, return the "EN" version - default;
    const response_en = await getFeaturedMatchForGeoPosFromCache('en')
    // ... DEBUGGING;
    // if (dev) console.debug('-- response_cache_default! --', response_en)
    // ... return RESPONSE;
    if (response_en) {
        return {
            body: response_en
        }
    }

    // ... otherwise, there is NO MATCHES available;
    return {
        body: null
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getFeaturedMatchForGeoPosFromCache(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getFeaturedMatchForGeoPosFromCache(geoPos: string): Promise < FixtureResponse | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('featured_match', geoPos);
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: FixtureResponse = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`Found featured_match ${geoPos} in cache`);
            // ... return, cached data;
            return parsed;
        }
        return
    } 
    // ... CATCH, ERROR;
    catch (e) {
        // ... error, return;
        console.debug("Unable to retrieve from cache", geoPos, e);
        return
    }
    // ... error, return;
    return
}