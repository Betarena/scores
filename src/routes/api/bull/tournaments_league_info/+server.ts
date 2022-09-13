import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_LEAGUE_INFO_FULL_DATA, REDIS_CACHE_LEAGUE_INFO_DATA_1, REDIS_CACHE_LEAGUE_INFO_DATA_2 } from '$lib/graphql/tournaments/league-info/query';
import { removeDiacritics } from '$lib/utils/languages';
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_league_info_query,
  Cache_Single_SportbookDetails_Data_Response, 
  Cache_Single_Tournaments_League_Info_Data_Response
} from '$lib/models/tournaments/league-info/types';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourInfo = new Bull (
  'cacheQueueTourInfo', 
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
const cacheQueueProcessName = "cacheQueueTourInfo"
const cacheTarget = "REDIS CACHE | tournament league_info"
let logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST(): Promise < unknown > {

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    await sportbookDetailsGeneration();
    await leagueInfoGeneration();

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
    const job = await cacheQueueTourInfo.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function sportbookDetailsGeneration () {
  
	const response = await getSportbookDetails ();

  let finalCacheObj: Cache_Single_SportbookDetails_Data_Response = {
    geoPos: undefined
  }

  // deleteCacheSportbookDetailInfoData()

  for (const geoSportbook of response.sportsbook_details) {

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
  
	const response = await getLeagueInfoData();

  // const cacheRedisObj = {}
  // deleteCacheTournamentsPageLeagueInfoData()

  // [ℹ] FIXME: speed up the data-processing (takes aroud 450 sec ATM)
  // [ℹ] data pre-processing;
  // const players_map = new Map()
  // for (const p of response_const.scores_football_players) {
  //   players_map.set(p.player_id, p)
  // }

  // [ℹ] generate appropiate URLS
  for (const iterator of response.scores_tournaments) {

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

    const targetWidgetTranslation = response.scores_widget_league_info_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    ).data
    // [ℹ] league-info-2 widget data
    const leagueInfoWidget2Translations = response.widget_league_info_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    )

    finalCacheObj.data.translation = {
      ...targetWidgetTranslation,
      clubs:                 leagueInfoWidget2Translations?.data?.clubs,
      goals:                 leagueInfoWidget2Translations?.data?.goals,
      league_info:           leagueInfoWidget2Translations?.data?.league_info,
      average_goals:         leagueInfoWidget2Translations?.data?.average_goals,
      win_percentage:        leagueInfoWidget2Translations?.data?.win_percentage,
      average_player_rating: leagueInfoWidget2Translations?.data?.average_player_rating,
    }

    const league_target = response.scores_football_leagues
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
      const seasonExtraInfo = response.scores_football_seasons_details.find(( { id } ) => id === season_main.id)

      const num_clubs = seasonExtraInfo?.data_stats === null ? null : seasonExtraInfo?.data_stats?.number_of_clubs
      const start_date = seasonExtraInfo?.start_date
      const end_date = seasonExtraInfo?.end_date

      // [ℹ] league-info-2 widget data
      const num_goals = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.number_of_goals
      ;
      const avg_goals = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.goals_scored?.all
      ;
      const win_p = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.win_percentage?.all
      ;
      const avg_player_r = seasonExtraInfo?.data_stats === null 
        ? null
        : seasonExtraInfo?.data_stats?.avg_player_rating
      ;

      // [ℹ] omit seasons with missing data:
      // if (num_clubs != null && 
      //     start_date != null && 
      //     end_date != null) {

        finalCacheObj.data.seasons.push(
          {
            ...season_main,
            number_of_clubs:  num_clubs,
            start_date:       start_date,
            end_date:         end_date,
            // [ℹ] league-info-2 widget data
            goals:            num_goals,
            avg_goals:        avg_goals,
            win_p:            win_p,
            avg_player_r:     avg_player_r
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getSportbookDetails (
): Promise < BETARENA_HASURA_league_info_query > {
  
    const t0 = performance.now();
    const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_2";
    const response: BETARENA_HASURA_league_info_query = await initGrapQLClient().request (
      REDIS_CACHE_LEAGUE_INFO_DATA_2
    );
    const t1 = performance.now();
    logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);
  
    return response;
  }

async function getLeagueInfoData (
): Promise < BETARENA_HASURA_league_info_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_1";
	const response: BETARENA_HASURA_league_info_query = await initGrapQLClient().request (
    REDIS_CACHE_LEAGUE_INFO_DATA_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}