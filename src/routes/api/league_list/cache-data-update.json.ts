
// [ℹ] import $app `modules`;
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import type { 
  Cache_Single_Geo_LeagueList_Translation_Response, 
  Cache_Single_Lang_LeagueList_Translation_Response, 
  Hasura_Complete_League_List_Type, 
  League_List_Cache_SEO_Ready 
} from '$lib/models/league_list/types'
import { GET_COMPLETE_LEAGUE_LIST_DATA } from '$lib/graphql/league_list/query'
import { GET_HREFLANG_DATA } from '$lib/graphql/query'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(): Promise < any > {
    
  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  await leagueListGeoDataGeneration()
  await leagueListLangDataGeneration(langArray)

  // [ℹ] return, RESPONSE;
  return {
    status: 200,
    body: '✅ Success \nLeague List Cache Updated!'
  }

}

/**
 * [ℹ] League List CACHEING ACTIONS METHODS
*/

async function cacheLeagueListGeoPos (geoPos: string, json_cache: Cache_Single_Geo_LeagueList_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('league_list_geo', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.log('❌ unable to cache league_list_geo for ', geoPos, e);
  }
}

async function cacheLeagueListLang (lang: string, json_cache: Cache_Single_Lang_LeagueList_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('league_list_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ league_list_t lang ', lang, 'cached')
  } 
  catch (e) {
    console.error('❌ unable to cache league_list_t for ', lang, e);
  }
}

async function deleteLeagueListGeoPos () {
  await redis.del('league_list_geo')
  return
}

async function deleteLeagueListLang () {
  await redis.del('league_list_t')
  return
}

/**
 * [ℹ] League List Sites CACHE GENERATION
*/

async function leagueListGeoDataGeneration () {

  await deleteLeagueListGeoPos()

  // [ℹ] get all of the LEAGUE LIST DATA from HASURA;
  const response: Array < Cache_Single_Geo_LeagueList_Translation_Response > = await mainGeo()

  // [ℹ] iterate over EACH LEAGUE OBJECT, lang, by lang;
  for await (const leagueObj of response) {
    const userGeo = leagueObj.lang
    // [ℹ] cache-response;
    await cacheLeagueListGeoPos(userGeo, leagueObj);
  }

}

async function leagueListLangDataGeneration (langArray: string[]) {

  const finalCacheObj: Cache_Single_Lang_LeagueList_Translation_Response = {
    all_leagues_list: undefined,
    unique_county_list: undefined,
    translations: undefined
  }

  // [ℹ] ℹ generate best goal scorers data by GEO;
  const response: League_List_Cache_SEO_Ready = await mainLang()

  deleteLeagueListLang()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.all_leagues_list = response.all_leagues_list;
    finalCacheObj.unique_county_list = response.unique_county_list;
    finalCacheObj.translations = response.translations.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheLeagueListLang(lang_, finalCacheObj);
  }

}

/**
 * [ℹ] League List Methods
*/

async function mainGeo(): Promise < Array < Cache_Single_Geo_LeagueList_Translation_Response >> {

  const response: Hasura_Complete_League_List_Type = await initGrapQLClient().request(GET_COMPLETE_LEAGUE_LIST_DATA)

  const finalObj: Array < Cache_Single_Geo_LeagueList_Translation_Response > = []

  // [ℹ] for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {

    const leagueObj: Cache_Single_Geo_LeagueList_Translation_Response = {
        lang: undefined,
        top_geo_leagues: [],
        all_leagues_list: [],
        unique_county_list: [],
        translations: undefined
    }
    // [ℹ] ℹ declare language [GEO];
    leagueObj.lang = country_leagues.lang

    // [ℹ] select-top-7-leagues;
    for (const country_league of country_leagues.leagues) {

        for (const league of response.scores_league_list) {
            // [ℹ] match_league_ids && match correct-lang
            if (league.league_id.toString() === country_league.league_id.toString()) {
                leagueObj.top_geo_leagues.push(league)
            }

            if (leagueObj.top_geo_leagues.length > 7) {
                if (dev) console.debug('➤  exiting inner loop', leagueObj.top_geo_leagues.length)
                break;
            }
        }
        if (leagueObj.top_geo_leagues.length > 6) {
            if (dev) console.debug('➤  exiting main loop', leagueObj.top_geo_leagues.length)
            break;
        }
    }

    leagueObj.all_leagues_list = response.scores_league_list

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

    finalObj.push(leagueObj);
  }

  return finalObj
}

async function mainLang(): Promise < League_List_Cache_SEO_Ready > {
  
  const response: Hasura_Complete_League_List_Type = await initGrapQLClient().request(GET_COMPLETE_LEAGUE_LIST_DATA)

  const finalObj: League_List_Cache_SEO_Ready = {
      all_leagues_list: [],
      unique_county_list: [],
      translations: undefined
  }

  finalObj.all_leagues_list = response.scores_league_list
  finalObj.translations = response.scores_leagues_list_translations_dev
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

  return finalObj
}

function compareStrings(a, b) {

    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}