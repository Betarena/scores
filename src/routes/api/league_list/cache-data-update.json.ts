
// [ℹ] import $app `modules`;
import { dev } from '$app/env'

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import type { 
  BETARENA_HASURA_league_list_query,
  REDIS_CACHE_SINGLE_league_list_geo_data_response,
  REDIS_CACHE_SINGLE_league_list_seo_t_response
} from '$lib/models/league_list/types'

import { 
  GET_COMPLETE_LEAGUE_LIST_DATA 
} from '$lib/graphql/league_list/query'

import { 
  GET_HREFLANG_DATA 
} from '$lib/graphql/query'

import type { 
  BETARENA_HASURA_scores_general_translations, 
  BETARENA_HASURA_scores_tournaments 
} from '$lib/models/hasura'

import fs from 'fs';
import { performance } from 'perf_hooks';

// [❗] critical
import Bull from 'bull';
const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueLeaguesList = new Bull('cacheQueueLeaguesList', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    }
  }, 
  settings
);
const cacheTarget = "REDIS CACHE | league_list"
let logs = []

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`
    ℹ ${cacheTarget} 
    at: ${new Date().toDateString()}
  `);

  // [ℹ] producers [JOBS]
  // const job = await cacheQueueLeaguesList.add();

  const t0 = performance.now();

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  // await leagueListGeoDataGeneration()
  await leagueListLangDataGeneration(langArray)

  const t1 = performance.now();

  if (dev) console.log(`
    ${cacheTarget} updated!
    completed in: ${(t1 - t0) / 1000} sec
  `)

  // console.log(`
  //   job_id: ${job.id}
  // `)

  return {
    status: 200,
    body: { 
      job_id: 1
    }
  }

}

/**
 * [ℹ] League List CACHEING ACTIONS METHODS
*/

async function cacheGeoPos (geoPos: string, json_cache: REDIS_CACHE_SINGLE_league_list_geo_data_response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('league_list_geo', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.log('❌ unable to cache league_list_geo for ', geoPos, e);
  }
}

async function cacheTranslationLang (lang: string, json_cache: REDIS_CACHE_SINGLE_league_list_seo_t_response) {
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueLeaguesList.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();

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

  const t1 = performance.now();

  if (dev) console.log(`
    ${cacheTarget} updated!
    completed in: ${(t1 - t0) / 1000} sec
  `)

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

/**
 * [ℹ] League List Sites CACHE GENERATION
*/

async function leagueListGeoDataGeneration () {

  // await deleteLeagueListGeoPos()

  // [ℹ] get all of the LEAGUE LIST DATA from HASURA;
  const response: Array < REDIS_CACHE_SINGLE_league_list_geo_data_response > = await mainGeo()

  // [ℹ] iterate over EACH LEAGUE OBJECT, lang, by lang;
  for await (const leagueObj of response) {
    const userGeo = leagueObj.geo
    // [ℹ] cache-response;
    await cacheGeoPos(userGeo, leagueObj);
  }

}

async function leagueListLangDataGeneration (langArray: string[]) {

  const response: REDIS_CACHE_SINGLE_league_list_seo_t_response [] = await mainLang(langArray)

  // [❗] FIXME: make sure [CACHE] is TIME-BASED-EXPIRATION, not DELETE-INSERT based;
  // deleteLeagueListLang()

  // [🐛] debug
  // if (dev) {
  //   const data = JSON.stringify(response, null, 4)
  //   fs.writeFile('./datalog/leagueListLangDataGeneration.json', data, err => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   });
  // }

  // [ℹ] for-each available translation:
  for (const item of response) {
    // [ℹ] persist-cache-response;
    await cacheTranslationLang (item.lang, item);
  }
}

/**
 * [ℹ] League List [MAIN HELPER] Methods
*/

async function mainGeo (): Promise < Array < REDIS_CACHE_SINGLE_league_list_geo_data_response >> {

  const response: BETARENA_HASURA_league_list_query = await initGrapQLClient().request(GET_COMPLETE_LEAGUE_LIST_DATA)

  // [🐛] debug [prod-handy]
  console.log(`ℹ tournament_map is generating!`)
  const tournament_map = new Map()
  for (const t of response.scores_tournaments_dev) {
    tournament_map.set(t.tournament_id, t)
  }
  // [🐛] debug [prod-handy]
  console.log(`ℹ tournament_map generated! With size: ${tournament_map.size}`)

  const finalObj: Array < REDIS_CACHE_SINGLE_league_list_geo_data_response > = []

  // [ℹ] iterate .forEach country [filtered]
  for (const country_leagues of response.leagues_filtered_country) {

    const leagueObj: REDIS_CACHE_SINGLE_league_list_geo_data_response = {
      geo: undefined,
      top_geo_leagues: [],
      all_leagues_list: []
    }

    // [ℹ] declare [GEO]
    leagueObj.geo = country_leagues.lang

    // [ℹ] select [TOP-7] leagues
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

    // [ℹ] aggregate [ALL] LEAGUES-LIST
    leagueObj.all_leagues_list = response.scores_league_list
    // [ℹ] inject [URLs]
    leagueObj.all_leagues_list.forEach((elem) => {
      const target_tournament: boolean = tournament_map.has(elem.league_id);
      if (target_tournament) {
        const target_tournament: BETARENA_HASURA_scores_tournaments = tournament_map.get(elem.league_id);
        elem.urls = target_tournament.urls
      }
    })
    
    finalObj.push(leagueObj);
  }

  return finalObj
}

async function mainLang (langArray: string[]): Promise < REDIS_CACHE_SINGLE_league_list_seo_t_response[] > {

  // [ℹ] debug info
  let t0;
  let t1;

  /*
    [ℹ] data breakdown MAIN
  */
  
  t0 = performance.now();
  const queryName = "HASURA_GET_TARGET_TEAMS_AND_PLAYERS";
  const response: BETARENA_HASURA_league_list_query = await initGrapQLClient().request(
    GET_COMPLETE_LEAGUE_LIST_DATA
  )
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  t0 = performance.now();
  const lang_country_map = new Map()
  for (const t of response.scores_general_translations_dev) {
    lang_country_map.set(t.lang, t)
  }
  t1 = performance.now();
  console.log(`lang_country_map generated with size: ${lang_country_map.size}`)

  logs.push(`lang_country_map generated with size: ${lang_country_map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  // [ℹ] MAIN

  const finalCacheObj: REDIS_CACHE_SINGLE_league_list_seo_t_response [] = []

  // [ℹ] universal [EN] [LIST]
  const pre_unique_county_list = response.scores_league_list
    .filter ((obj, pos, arr) => {
      return arr
        .map(mapObj => mapObj.country_id)
        .indexOf(obj.country_id) == pos;
  });
  const pre_updated_unique_county_list = pre_unique_county_list
    .map (u => ({
    country_id:     u.country_id,
    country_name:   u.country_name,
    image_path:     u.image_path
  }));

  // [ℹ] .forEach() [LANG]
  for (const lang_m of langArray) {

    const widgetTranslation = response.scores_leagues_list_translations_dev
      .find( ({ lang }) =>  lang === lang_m);

    if (widgetTranslation == undefined) {
      continue
    }

    const preCacheObj: REDIS_CACHE_SINGLE_league_list_seo_t_response = {
      lang:                undefined,
      all_leagues_list:    [],
      unique_county_list:  [],
      translations:        undefined
    }

    preCacheObj.lang =                lang_m
    preCacheObj.all_leagues_list =    response.scores_league_list
    preCacheObj.translations =        widgetTranslation.translations
    preCacheObj.unique_county_list =  pre_unique_county_list
      .map (u => ({
      country_id:     u.country_id,
      country_name:   u.country_name,
      image_path:     u.image_path
    }));

    // [ℹ] updating translating [COUNTRY_NAME]
    preCacheObj.unique_county_list.forEach ((elem) => {
      const target_country_t: boolean = lang_country_map.has(lang_m);
      if (target_country_t) {
        const target_country_t_data: BETARENA_HASURA_scores_general_translations = lang_country_map.get(lang_m);
        const country_name:     string = elem.country_name;

        // [🐛] debug
        // if (country_name == "Azerbaijan") {
        //   console.log(country_name + " " + lang_m + " ");
        //   console.log(target_country_t_data.countries[country_name])
        // }
        
        // const countryObjFinal = Object.assign({}, ...target_country_t_data.countries); 
        // [ℹ] TODO: update to countries[<->] when update on Hasura
        if (target_country_t_data.countries[country_name] !== undefined) {
          elem.country_name = target_country_t_data.countries[country_name]
        }
      }
    })
    // [ℹ] descending alphabetical order
    preCacheObj.unique_county_list.sort (function(a, b) {
      return compareStrings(a.country_name, b.country_name);
    })

    finalCacheObj.push(preCacheObj)
  }

  return finalCacheObj
}

/**
 * [ℹ] Helper Methods
*/

function compareStrings(a, b) {

  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}