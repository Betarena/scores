
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import { GET_COMPLETE_PAGES_SEO_DATA } from '$lib/graphql/page_seo/query'
import type { Hasura_Complete_Pages_SEO } from '$lib/model/page_seo/types'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('➤ updating-redis-cache league-list-data')
    // ... get all of the LEAGUE LIST DATA from HASURA;
    const response = await main()
    // ... cache;
    cacheHomepageSEOData(response)
    // ... return RESPONSE;
    if (response) {
        return {
            status: 200,
            body: '✅ Success! League list SEO cache data has been updated!'
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
// - cacheLeagueListSEO(json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheHomepageSEOData(json_cache: Hasura_Complete_Pages_SEO) {
    // ... TRY;
    try {
        //... store (cache) league_list response,
        await redis.hset('seo', 'page_homepage', JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
        console.debug('❌ unable to cache - seo / page_homepage', e);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - getAllHomepageSEOtData()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Hasura_Complete_Pages_SEO > {
    // ...
    const response = await getAllHomepageSEOData()
    // if (dev) console.debug('finalObj', finalObj)
    return response
}

async function getAllHomepageSEOData(): Promise < Hasura_Complete_Pages_SEO > {
    // ... DEBUGGING;
    if (dev) console.debug('➤  FETCH all league filtered country data')
    // ... push-GRAPH-QL-request;
    const response = await initGrapQLClient().request(GET_COMPLETE_PAGES_SEO_DATA)
    // ... DEBUGGING;
    // if (dev) console.debug('➤ getAllLeagueList() response', response)
    // ... reutrn response;
    return response
}