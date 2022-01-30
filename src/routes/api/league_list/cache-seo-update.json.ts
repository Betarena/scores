
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_League_List_Type, League_List_Cache_SEO_Ready } from '$lib/model/league_list/types'
import { GET_COMPLETE_LEAGUE_LIST_DATA } from '$lib/graphql/league_list/query'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('➤ updating-redis-cache league-list-data')
    // ... get all of the LEAGUE LIST DATA from HASURA;
    const response = await main()
    // ... cache;
    cacheLeagueListSEO(response)
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

async function cacheLeagueListSEO(json_cache: League_List_Cache_SEO_Ready) {
    // ... TRY;
    try {
        //... store (cache) league_list response,
        await redis.hset('seo', 'league_list', JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
        console.debug('❌ unable to cache - seo / league_list', e);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - getAllLeagueListData()
// - compareStrings(a, b)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < League_List_Cache_SEO_Ready > {
    // ...
    const response = await getAllLeagueListData()

    // ...
    const finalObj: League_List_Cache_SEO_Ready = {
        all_leagues_list: [],
        unique_county_list: [],
        translations: undefined
    }

    // ...
    finalObj.all_leagues_list = response.scores_league_list
    // ...
    finalObj.translations = response.scores_leagues_list_translations_dev
    // ...
    finalObj.unique_county_list = response.scores_league_list.filter((obj, pos, arr) => {
        return arr
            .map(mapObj => mapObj.country_id)
            .indexOf(obj.country_id) == pos;
    });
    finalObj.unique_county_list = finalObj.unique_county_list.map(u => ({
        country_id: u.country_id,
        country_name: u.country_name,
        image_path: u.image_path
    }));
    finalObj.unique_county_list.sort(function(a, b) {
        return compareStrings(a.country_name, b.country_name);
    })

    // if (dev) console.debug('finalObj', finalObj)

    return finalObj
}

async function getAllLeagueListData(): Promise < Hasura_Complete_League_List_Type > {
    // ... DEBUGGING;
    if (dev) console.debug('➤  FETCH all league filtered country data')
    // ... push-GRAPH-QL-request;
    const response = await initGrapQLClient().request(GET_COMPLETE_LEAGUE_LIST_DATA)
    // ... DEBUGGING;
    // if (dev) console.debug('➤ getAllLeagueList() response', response)
    // ... reutrn response;
    return response
}

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}