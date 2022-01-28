
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { FixtureResponse } from "$lib/model/interface-fixture"
import type { League_List_Cache_Ready } from '$lib/model/league_list/types';

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function post({ params, request }, res): Promise < Array < League_List_Cache_Ready > | Record < string, never> > {
    // ... extract the 'geo_js';
    userGeo = await request.json(); // or request.json(), etc

    // ... DEBUGGING;
    if (dev) console.info('➤ GET league_list data for userGeo -->', userGeo)

    // ... check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getLeagueListForGeoPosFromCache(userGeo)
    // ... DEBUGGING;
    // if (dev) console.debug('-- response_cache --', response_usergeo)
    // ... return RESPONSE;
    if (response_usergeo) {
        return {
            body: response_usergeo
        }
    }

    // ... otherwise, return the "EN" version - default;
    const response_en = await getLeagueListForGeoPosFromCache('en')
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
// - getLeagueListForGeoPosFromCache(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLeagueListForGeoPosFromCache(geoPos: string): Promise < League_List_Cache_Ready | Record < string, never > > {
    // ... TRY;
    try {
        // ... cached data retrival;
        const cached: string = await redis.hget('league_list', geoPos);
        // ... check for `cached` data
        if (cached) {
            // ... convert the data from `string` to `JSON`
            const parsed: FixtureResponse = JSON.parse(cached);
            // ... DEBUGGING;
            if (dev) console.info(`✅ Success! Found target league_list ${geoPos} in cache!`);
            // ... return, cached data;
            return parsed;
        }
        return
    } 
    // ... CATCH, ERROR;
    catch (e) {
        // ... error, return;
        console.debug("❌ Error! Unable to retrieve league_list from cache", geoPos, e);
        return
    }
}