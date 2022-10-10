import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_league_list_query,
  REDIS_CACHE_SINGLE_league_list_geo_data_response,
  REDIS_CACHE_SINGLE_league_list_seo_t_response
} from '$lib/models/league_list/types'

import { 
  REDIS_CACHE_LEAGUE_LIST_DATA_1 
} from '$lib/graphql/league_list/query'

import { 
  GET_HREFLANG_DATA 
} from '$lib/graphql/query'

import type { 
  BETARENA_HASURA_scores_general_translations, 
  BETARENA_HASURA_scores_tournaments 
} from '$lib/models/hasura'

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueLeaguesList = new Bull (
  'cacheQueueLeaguesList', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    },
    settings: settings
  }
);
const cacheQueueProcessName = "cacheQueueLeaguesList"
const cacheTarget = "REDIS CACHE | league_list"
let logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST (): Promise < unknown > {

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    // [ℹ] get KEY platform translations
    const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

    // [ℹ] get-all-exisitng-lang-translations;
    const langArray: string [] = response.scores_hreflang
      .filter(a => a.link)         /* filter for NOT "null" */
      .map(a => a.link)            /* map each LANG */ 

    // [ℹ] push "EN"
    langArray.push('en')

    await leagueListGeoDataGeneration()
    await leagueListLangDataGeneration(langArray)

    for (const log of logs) {
      console.log(log)
    }

    return json({
      job_id: cacheTarget + " done!"
    })
  }
  // [ℹ] otherwise prod.
  else {
    // [ℹ] producers [JOBS]
    const job = await cacheQueueLeaguesList.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

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
  const langArray: string [] = response.scores_hreflang
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function leagueListGeoDataGeneration () {

  // [ℹ] get all of the LEAGUE LIST DATA from HASURA;
  const response = await mainGeo()

  // [ℹ] iterate over EACH LEAGUE OBJECT, 
  // [ℹ] lang, by lang;
  // [ℹ] cache-response;
  for await (const leagueObj of response) {
    const userGeo = leagueObj.geo
    await cacheGeoPos(userGeo, leagueObj);
  }

}

async function leagueListLangDataGeneration (
  langArray: string[]
) {

  const response = await mainLang(langArray)

  // [❗] FIXME: make sure [CACHE] is TIME-BASED-EXPIRATION, not DELETE-INSERT based;
  // deleteLeagueListLang()

  // [🐛] debug
  /*
    if (dev) {
      const data = JSON.stringify(response, null, 4)
      fs.writeFile('./datalog/leagueListLangDataGeneration.json', data, err => {
        if (err) {
          console.error(err);
        }
      });
    }
  */

  // [ℹ] for-each available translation:
  // [ℹ] persist-cache-response;
  for (const item of response) {
    await cacheTranslationLang (item.lang, item);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function mainGeo (): 
Promise < Array < REDIS_CACHE_SINGLE_league_list_geo_data_response >> {

  const response = await getLeagueListQuery ();
  const tournament_map = await obtainLeagueListTournamentsMap (
    response
  );

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

async function mainLang (
  langArray: string[]
): Promise < REDIS_CACHE_SINGLE_league_list_seo_t_response[] > {

  const response = await getLeagueListQuery ()
  const lang_country_map = await obtainLeagueListTranslationMap (
    response
  )

  /**
   * [ℹ] MAIN
  */

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

    const widgetTranslation = response.scores_leagues_list_translations
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

function compareStrings (
  a, 
  b
) {

  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

async function getLeagueListQuery (
): Promise < BETARENA_HASURA_league_list_query > {
  
  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LEAGUE_LIST_DATA_1";
	const response: BETARENA_HASURA_league_list_query = await initGrapQLClient().request (
    REDIS_CACHE_LEAGUE_LIST_DATA_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function obtainLeagueListTranslationMap (
  data: BETARENA_HASURA_league_list_query
): Promise < Map < string, BETARENA_HASURA_scores_general_translations > > {

  const t0  = performance.now();
  const lang_country_map = new Map < string, BETARENA_HASURA_scores_general_translations > ()
  for (const t of data.scores_general_translations) {
    lang_country_map.set(t.lang, t)
  }
  const t1 = performance.now();
  logs.push(`lang_country_map generated with size: ${lang_country_map.size}`)
  logs.push(`hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return lang_country_map
}

async function obtainLeagueListTournamentsMap (
  data: BETARENA_HASURA_league_list_query
): Promise < Map < number, BETARENA_HASURA_scores_tournaments > > {

  const t0  = performance.now();
  const tournament_map = new Map < number, BETARENA_HASURA_scores_tournaments > ()
  for (const t of data.scores_tournaments) {
    tournament_map.set(t.tournament_id, t)
  }
  const t1 = performance.now();
  logs.push(`tournament_map generated with size: ${tournament_map.size}`)
  logs.push(`hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return tournament_map
}