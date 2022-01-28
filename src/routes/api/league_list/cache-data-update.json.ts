
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_League_List_Type, League_List_Cache_Ready } from '$lib/model/league_list/types'
import { GET_COMPLETE_LEAGUE_LIST_DATA } from '$lib/graphql/league_list/query'

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('➤ updating-redis-cache league-list-data')
    // ... clear the cache data for `league_list`
    await deleteCacheLeagueList()
    // ... get all of the LEAGUE LIST DATA from HASURA;
    const response = await main()
    // ... iterate over EACH LEAGUE OBJECT, lang, by lang;
    for await (const leagueObj of response) {
        userGeo = leagueObj.lang
        // ... cache-response;
        await cacheLeagueListGeoPos(userGeo, leagueObj);
    }
    // ...
    return {
        status: 200,
        body: '✅ Success! League list cache data has been updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheFeaturedMatchGeoPos(geoPos, json_cache)
// - deleteCacheFeaturedMatch()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheLeagueListGeoPos(geoPos: string, json_cache: League_List_Cache_Ready) {
    // ... TRY;
    try {
        //... store (cache) league_list response,
        await redis.hset('league_list', geoPos, JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
        console.debug('❌ unable to cache - league_list', geoPos, e);
    }
}

async function deleteCacheLeagueList() {
    await redis.del('league_list')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getAllLeaguesFilteredCountry()
// - getAllLeagueList()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Array < League_List_Cache_Ready >> {
    // ...
    const response = await getAllLeagueListData()

    // ...
    const finalObj: Array < League_List_Cache_Ready > = []

    // ... for-each country-filtered-league-list,
    for (const country_leagues of response.leagues_filtered_country) {
        // ... select-top-7-leagues;
        const leagueObj: League_List_Cache_Ready = {
            lang: undefined,
            top_geo_leagues: [],
            all_leagues_list: [],
            unique_county_list: [],
            translations: undefined
        }
        // ...
        leagueObj.lang = country_leagues.lang
        if (dev) console.debug('➤ leagueObj.lang', leagueObj.lang)
        // ...
        for (const country_league of country_leagues.leagues) {
            // ...
            for (const league of response.scores_league_list) {
                // ... match_league_ids && match correct-lang
                if (league.league_id.toString() === country_league.league_id.toString()) {
                    // ... DEBUGGING;
                    if (dev) console.debug('league identified!', league.country_id, league.league_id)
                    // ...
                    leagueObj.top_geo_leagues.push(league)
                }
                // ...
                if (leagueObj.top_geo_leagues.length > 7) {
                    if (dev) console.debug('➤  exiting inner loop', leagueObj.top_geo_leagues.length)
                    break;
                }
            }
            // ...
            if (leagueObj.top_geo_leagues.length > 6) {
                if (dev) console.debug('➤  exiting main loop', leagueObj.top_geo_leagues.length)
                break;
            }
        }
        // ...
        leagueObj.all_leagues_list = response.scores_league_list
        // ...
        leagueObj.translations = response.scores_leagues_list_translations_dev
        // ...
        leagueObj.unique_county_list = response.scores_league_list.filter((obj, pos, arr) => {
            return arr
                .map(mapObj => mapObj.country_id)
                .indexOf(obj.country_id) == pos;
        });
        leagueObj.unique_county_list = leagueObj.unique_county_list.map(u => ({
            country_id: u.country_id,
            country_name: u.country_name,
            image_path: u.image_path
        }));
        leagueObj.unique_county_list.sort(function(a, b) {
            return compareStrings(a.country_name, b.country_name);
        })
        // ...
        finalObj.push(leagueObj);
    }

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