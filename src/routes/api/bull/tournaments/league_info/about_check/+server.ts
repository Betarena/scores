import { dev } from '$app/environment'
import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { 
  REDIS_CACHE_LEAGUE_INFO_DATA_3, 
  REDIS_CACHE_LEAGUE_INFO_DATA_4 
} from '$lib/graphql/tournaments/league-info/query';
import { removeDiacritics } from '$lib/utils/languages';

import type { 
  BETARENA_HASURA_league_info_query,
  Cache_Single_Tournaments_League_Info_Data_Response
} from '$lib/models/tournaments/league-info/types';

import fs from 'fs';
import Bull from 'bull';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const CQ_Tour_Info_About = new Bull (
  'CQ_Tour_Info_About', 
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
const cacheQueueProcessName = "CQ_Tour_Info_About"
const cacheTarget = "REDIS CACHE | tournament league_info (about_check)"
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

    await main();

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
    const job = await CQ_Tour_Info_About.add({}, { timeout: 300000 });
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheTournamentsPageLeagueInfoData (
  url: string, 
  json_cache: Cache_Single_Tournaments_League_Info_Data_Response
) {
  try {
    await redis.hset('league_info', url, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache league_info', e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

CQ_Tour_Info_About.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  await main();
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

async function main () {
  
	const response = await get_check_finished_season_rounds();

  // [ℹ] validation check [tournaments-to-update]
  if (response.scores_football_seasons_details.length == 0) {
    logs.push(`no leagues to update`)
    return
  }

  const league_ids_arr: number[] = response.scores_football_seasons_details.map(s => s.league_id)

  const response_main = await get_main_league_info_data(
    league_ids_arr
  )

  // [🐞]
  if (dev) {
    const data = JSON.stringify(league_ids_arr, null, 4)
    fs.writeFile(`./datalog/league_ids_arr.json`, data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  // const cacheRedisObj = {}
  // deleteCacheTournamentsPageLeagueInfoData()

  // [ℹ] generate appropiate URLS
  // [ℹ] per [LANG]
  // FIXME: future change, should 
  // FIXME: be 1 row per league
  // NOTE: Issue not documented
  for (const iterator of response_main.scores_tournaments) {

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
        translation: undefined,
        seo_content: undefined         
      }
    }

    const tournament_id = iterator.tournament_id

    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    // [ℹ] /{lang}/{sport}/{country}/{league_name} OR 
    // [ℹ] /{sport}/{country}/{league_name} 
    // [ℹ] generation URL
    const url = iterator.lang == 'en' 
      ? '/' + sport + '/' + country + '/' + league_name
      : '/' + lang  + '/' + sport + '/' + country + '/' + league_name

    finalCacheObj.url = url
    finalCacheObj.lang = lang

    const targetWidgetTranslation = response_main.scores_widget_league_info_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    ).data
    // [ℹ] no-widget-translations data
    const noWidgetTranslation = response_main.scores_general_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    )
    // [ℹ] league-info-2 [widget] data
    const leagueInfoWidget2Translations = response_main.widget_league_info_translations
    .find(( { lang } ) => 
      lang === iterator.lang
    )
    // [ℹ] about-tournament [widget] data
    const aboutTournamentTranslation = response_main.scores_widget_tournament_about_translations
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
      about_the_league:      aboutTournamentTranslation?.data?.about_the_league,
      no_info:               noWidgetTranslation?.widgets_no_data_available?.no_info,
      no_info_desc:          noWidgetTranslation?.widgets_no_data_available?.no_info_desc
    }

    // NOTE: using "name" does not work,
    // NOTE: as we are comparing [iterator-name] (translated)
    // NOTE: to the "EN" league name
    // NOTE: so league_id / tournament_id is suffieicent
    const league_target = response_main.scores_football_leagues
    .find(( { name, id } ) => 
      // name === iterator.name &&
      id === tournament_id
    )
    
    // [🐛] debug
    // if (tournament_id == 462 && iterator.lang == 'pt') {
    //   console.log(`
    //     found it: ${JSON.stringify(finalCacheObj, null, 4)}
    //     leagueInfoWidget2Translations: ${JSON.stringify(leagueInfoWidget2Translations, null, 4)}
    //   `)
    //   break;
    // }

    // [🐛] debug erroneous league_ids
    // FIXME: there appears to be some leagues
    // FIXME: not present in the DB "scores_football_leagues"
    // FIXME: but are present in the "scores_tournaments" [?]
    if (league_target == undefined) {
      if (dev) console.log(`
        undefined: ${tournament_id}
        url: ${url}
      `)
      continue;
    }

    finalCacheObj.data.image_path = league_target?.data?.logo_path;
    finalCacheObj.data.country_logo = league_target?.country?.image_path;

    finalCacheObj.data.country = iterator?.country;
    finalCacheObj.data.name = iterator?.name;

    finalCacheObj.data.seo_content = iterator?.seo_content;
    finalCacheObj.data.seasons = [] // [ℹ] reset

    // [ℹ] get all seasons for (this) league
    for (const season_main of league_target.seasons) {

      // [ℹ] match target X season from league Z to extra-info-season-data;
      const seasonExtraInfo = response_main.scores_football_seasons_details.find(( { id } ) => id === season_main.id)

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

    // [ℹ] persist object; = impossible due to MAX-REQUEST EXCEEDED FREE UPSTASH PLAN [ALT]
    // cacheRedisObj[finalCacheObj.url] = finalCacheObj
  }

  // [ℹ] persist-cache-response; 
  // [ℹ] HMSET() 
  // [ℹ] [ALT]
  // await cacheTournamentsPageLeagueInfoData(cacheRedisObj);

  return;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_check_finished_season_rounds (
): Promise < BETARENA_HASURA_league_info_query > {

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  let yesterday_str = yesterday.toISOString().slice(0, 10)
  yesterday_str = "\"end\": \"" + yesterday_str + "\""
  logs.push("yesterday_str", yesterday_str)

  const VARIABLES = {
    _iregex: yesterday_str
  }

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_3";
	const response: BETARENA_HASURA_league_info_query = await initGrapQLClient().request (
    REDIS_CACHE_LEAGUE_INFO_DATA_3,
    VARIABLES
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function get_main_league_info_data (
  league_ids_arr: number[]
): Promise < BETARENA_HASURA_league_info_query > {

  const VARIABLES = {
    league_ids_arr: league_ids_arr,
    league_ids_arr_2: league_ids_arr
  }

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LEAGUE_INFO_DATA_4";
  const response: BETARENA_HASURA_league_info_query = await initGrapQLClient().request (
    REDIS_CACHE_LEAGUE_INFO_DATA_4,
    VARIABLES
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}