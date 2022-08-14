import { dev } from '$app/env'

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_LEAGUE_INFO_FULL_DATA } from '$lib/graphql/tournaments/league-info/query';
import { removeDiacritics } from '$lib/utils/languages';

import type { 
  BETARENA_HASURA_league_info_query,
  Cache_Single_SportbookDetails_Data_Response, 
  Cache_Single_Tournaments_League_Info_Data_Response
} from '$lib/models/tournaments/league-info/types';

import fs from 'fs';

import { performance } from 'perf_hooks';

// [❗] critical
import Bull from 'bull';
const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourInfo = new Bull('cacheQueueTourInfo', 
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
const cacheTarget = "REDIS CACHE | tournament league_info"
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
  const job = await cacheQueueTourInfo.add({});

  console.log(`
    job_id: ${job.id}
  `)

  return {
    status: 200,
    body: { 
      job_id: job.id
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheTournamentsPageLeagueInfoData (url: string, json_cache: Cache_Single_Tournaments_League_Info_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('league_info', url, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache league_info', e);
  }
}

async function cacheCacheSportbookDetailInfoData (geoPos: string, json_cache: Cache_Single_SportbookDetails_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('sportbook_details', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache sportbook_details', e);
  }
}

async function deleteCacheTournamentsPageLeagueInfoData() {
  await redis.del('league_info')
  return
}

async function deleteCacheSportbookDetailInfoData() {
  await redis.del('sportbook_details')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueTourInfo.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  // await surgicalDataUpdate()
  await sportbookDetailsGeneration();
  await leagueInfoGeneration();
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
 * [ℹ] Tournaments Page Data Generation Methods
*/

async function sportbookDetailsGeneration () {
  
  // [ℹ] get HASURA-DB response;
	const response: BETARENA_HASURA_league_info_query = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);

  let finalCacheObj: Cache_Single_SportbookDetails_Data_Response = {
    geoPos: undefined
  }

  // deleteCacheSportbookDetailInfoData()

  for (const geoSportbook of response.sportsbook_details_dev) {

    finalCacheObj.geoPos = geoSportbook.lang

    // [ℹ] sportbook-details-info
    for (const [key, value] of Object.entries(geoSportbook.data)) {
      // [ℹ] based on key-value-pair;
      if (geoSportbook.data[key].position.toString() === '1') {
        finalCacheObj = {
          ...value,
          geoPos: geoSportbook.lang
        }
      }
    }

    // [ℹ] persist-cache-response;
    await cacheCacheSportbookDetailInfoData(finalCacheObj.geoPos, finalCacheObj)

  }

}

async function leagueInfoGeneration () {
  
  const t0 = performance.now();
  const queryName = "GET_LEAGUE_INFO_FULL_DATA";
	const response: BETARENA_HASURA_league_info_query = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);
  const t1 = performance.now();
  if (dev) console.log(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  // const cacheRedisObj = {}
  // deleteCacheTournamentsPageLeagueInfoData()

  // [ℹ] FIXME: speed up the data-processing (takes aroud 450 sec ATM)
  // [ℹ] data pre-processing;
  // const players_map = new Map()
  // for (const p of response_const.scores_football_players_dev) {
  //   players_map.set(p.player_id, p)
  // }

  // [ℹ] generate appropiate URLS
  for (const iterator of response.scores_tournaments_dev) {

    // [ℹ] per LANG

    const finalCacheObj: Cache_Single_Tournaments_League_Info_Data_Response = {
      lang: undefined,
      url: undefined,
      data: {
        name: undefined,
        country: undefined,
        image_path: undefined,
        country_logo: undefined,
        // betting_site_logo?: undefined,
        // beting_cta_link?: undefined,
        seasons: [],
        translation: undefined         
      }
    }

    const tournament_id = iterator.tournament_id;

    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    // [ℹ] /{lang}/{sport}/{country}/{league_name} OR /{sport}/{country}/{league_name} generation URL
    const url = iterator.lang == 'en' 
      ? '/' + sport + '/' + country + '/' + league_name
      : '/' + lang  + '/' + sport + '/' + country + '/' + league_name

    finalCacheObj.url = url;
    finalCacheObj.lang = lang;

    const targetWidgetTranslation = response.scores_widget_league_info_translations_dev
      .find(( { lang } ) => 
        lang === iterator.lang
      ).data
    finalCacheObj.data.translation = targetWidgetTranslation

    const league_target = response.scores_football_leagues_dev
      .find(( { name, id } ) => 
        name === iterator.name && 
        id === tournament_id
      )
    
    // [🐛] debug erroneous league_ids
    if (league_target == undefined) {
      console.log(`
        undefined: ${tournament_id}
        url: ${url}
      `)
      continue;
    }

    finalCacheObj.data.image_path = league_target?.data?.logo_path;
    finalCacheObj.data.country_logo = league_target?.country?.image_path;

    finalCacheObj.data.country = iterator?.country;
    finalCacheObj.data.name = iterator?.name;

    finalCacheObj.data.seasons = [] // [ℹ] reset

    // [ℹ] get all seasons for (this) league
    for (const season_main of league_target.seasons) {

      // [ℹ] match target X season from league Z to extra-info-season-data;
      const seasonExtraInfo = response.scores_football_seasons_details_dev.find(( { id } ) => id === season_main.id)

      const num_clubs = seasonExtraInfo?.data_stats === null ? null : seasonExtraInfo?.data_stats?.number_of_clubs
      const start_date = seasonExtraInfo?.start_date
      const end_date = seasonExtraInfo?.end_date

      // [ℹ] omit seasons with missing data:
      // if (num_clubs != null && 
      //     start_date != null && 
      //     end_date != null) {

        finalCacheObj.data.seasons.push(
          {
            ...season_main,
            number_of_clubs: num_clubs,
            start_date: start_date,
            end_date: end_date
          }
        )

      // }
    }

    // [ℹ] persist data [MAIN];
    await cacheTournamentsPageLeagueInfoData(url, finalCacheObj);

    // [ℹ] persist object; = impossible due to MAX-REQUEST EXCEEDED FREE UPSTASH PLAN
    // cacheRedisObj[finalCacheObj.url] = finalCacheObj
  }

  // [ℹ] persist-cache-response; HMSET() [ALT]
  // await cacheTournamentsPageLeagueInfoData(cacheRedisObj);

  return;
}