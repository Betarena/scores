import { dev } from '$app/env'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { 
  REDIS_CACHE_FIXTURES_ODDS_DATA_1, 
  REDIS_CACHE_FIXTURES_ODDS_DATA_2, 
  REDIS_CACHE_FIXTURES_ODDS_DATA_3
} from '$lib/graphql/tournaments/fixtures_odds/query';
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';

import type { 
  BETARENA_HASURA_historic_fixtures
} from '$lib/models/hasura';
import type { 
  BETARENA_HASURA_fixtures_odds_query, 
  Fixture_Odds_Team, 
  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response, 
  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response, 
  Rounds_Data, 
  Tournament_Fixture_Odds, 
  Tournament_Season_Fixtures_Odds, 
  Weeks_Data
} from '$lib/models/tournaments/fixtures_odds/types';
import { GET_HREFLANG_DATA } from '$lib/graphql/query';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const CQ_Tour_FixOdds_All = new Bull (
  'CQ_Tour_FixOdds_All', 
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
const cacheTarget = "REDIS CACHE | tournament fixtures_odds (all)"
const cacheDataAddr = "tour_fix_odds_data"
const cacheTransAddr = "tour_fix_odds_t"
// [ℹ] debug info
let logs = []
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`
    ℹ ${cacheTarget} 
    at: ${new Date().toDateString()}
  `);

  // [ℹ] producers [JOBS]
  // const job = await CQ_Tour_FixOdds_All.add({});

  // const langArray = await getHrefLang()
  
  await main()
  // await main_trans_and_seo(langArray)

  // [🐛] debug
  if (dev) {
    for (const log of logs) {
      console.log(log)
    }
  }

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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheData (league_id: number, json_cache: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset(cacheDataAddr, league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cacheDataAddr}`, e);
  }
}

async function cacheTranslationData (lang: string, json_cache: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset(cacheTransAddr, lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cacheTransAddr}`, e);
  }
}

// [ℹ] DEPRECEATED CACHE DELETE (13/07/2022)

async function delCacheData () {
  await redis.del(cacheDataAddr)
  return
}

async function delCacheTranslationData () {
  await redis.del(cacheTransAddr)
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

CQ_Tour_FixOdds_All.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  // await tournamentsTopPlayersDataGeneration ()
  // await tournamentsTopPlayersTGeneration ()
  const t1 = performance.now();

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

  const start_date = "2022-08-10";
  const end_date = "2022-08-27"; 
  const limit = 1000;
  let offset = 0;
  let total_limit;

  /**
   * [ℹ] Obtain target historic_fixtures
   * [ℹ] Obtain taget season_id's 
  */

  let h_fixtures_arr: BETARENA_HASURA_historic_fixtures[] = [] 
  const historic_fixtures_map = new Map <number, BETARENA_HASURA_historic_fixtures> ()
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_1";
  t0 = performance.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      start_date: start_date,
      end_date: end_date
    }
    // [🐛] debug
    // if (dev) console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)
    
    const response: BETARENA_HASURA_fixtures_odds_query = await initGrapQLClient().request (
      REDIS_CACHE_FIXTURES_ODDS_DATA_1,
      VARIABLES
    );

    h_fixtures_arr = h_fixtures_arr.concat(response.historic_fixtures_dev)

    total_limit = response.historic_fixtures_dev_aggregate.aggregate.totalCount;
    offset += limit;
    
    counter++

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`ℹ exiting loop!`)
      logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

  }
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  // [ℹ] conversion to hashmap
  t0 = performance.now();
  for (const h_fixture of h_fixtures_arr) {
    historic_fixtures_map.set(h_fixture.id, h_fixture);
  }
  t1 = performance.now();
  logs.push(`historic_fixtures_map generated with size: ${historic_fixtures_map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);
  
  // [ℹ] obtain target season_id's data
  let seasonIdsArr: number[] = []
  for (const [key, value] of historic_fixtures_map.entries()) {
    const season_id = value.data.season_id
    seasonIdsArr.push(season_id);
  }
  seasonIdsArr = [...new Set(seasonIdsArr)]
  logs.push(`seasonIdsArr (unique): ${seasonIdsArr.length}`)

  // [ℹ] obtain target season_details data [hasura]
  const season_details_data = await getTargetSeasonDetailsData (seasonIdsArr);

  /**
   * [ℹ] breakdown season by weeks
   * [ℹ] breakdown season by rounds 
  */

  const season_week_round_ranges_map = new Map <number, Tournament_Season_Fixtures_Odds> ();

  for (const seasonId of seasonIdsArr) {

    const t_season = season_details_data.scores_football_seasons_details_dev
      .find( ({id}) => id === seasonId);

    if (t_season == undefined) {
      continue;
    }


    const seasonObj: Tournament_Season_Fixtures_Odds = {}

    const mod_rounds: Rounds_Data[] = t_season.round_data.map( d => ({
        s_date: d?.start?.toString(),
        e_date: d?.end?.toString(),
        name: d?.name?.toString()
      })
    );

    const mod_weeks: Weeks_Data[] = []

    const season_start = t_season.default_data.start_date
    const season_end = t_season.default_data.end_date
    const count_weeks: number = await getWeeksDiff(new Date(season_start), new Date(season_end));

    // console.log(`seasonId: ${seasonId}`)
    if (seasonId.toString() == '19740') {

      console.log(`
        season_start: ${season_start}
        season_start v2: ${new Date(season_start)}
        count_weeks: ${count_weeks}
      `)

    }

    for (let index = 0; index < count_weeks; index++) {

      const name = index + 1
      const s_date = new Date(season_start)
      const e_date = new Date(season_start)

      s_date.setDate(s_date.getDate() + (index * 7));
      e_date.setDate(e_date.getDate() + (index * 7) + 7);

      mod_weeks.push({
        name: name?.toString(),
        s_date: s_date?.toString(),
        e_date: e_date?.toString()
      })

    }

    seasonObj.rounds = mod_rounds
    seasonObj.weeks = mod_weeks

    season_week_round_ranges_map.set(seasonId, seasonObj)
  }

  /**
   * [ℹ] data pre-processing
   * [ℹ] grouping fixtures by league_id's
   * [ℹ] based in nested season_id's objects
   * [ℹ] housing fixture_odds objects
  */

  const historic_fixtures_by_league = new Map <number, Tournament_Season_Fixtures_Odds[]> ()
  
  for (const [key, value] of historic_fixtures_map.entries()) {

    const fix_season_id = value.data?.season_id;
    const league_id = value.league_id;
    const fixture_id = value.id;
    const home_team_id = value.data?.localteam_id;
    const away_team_id = value.data?.visitorteam_id;

    const round = value.data?.round?.data?.name;
    const fixture_date = value.fixture_day;
    const fixture_time = value.time;
    const live_minutes = value.data?.time?.minute;

    const tip_link = value.tip_link_wp
    const media_link = value.media_link;
    const fixture_link = value.fixture_link_wp;
    
    const home_team_name = value.home_team_name;
    const home_red_cards = value?.data?.stats?.data?.find( ({ team_id }) => team_id === home_team_id )?.redcards;
    const home_team_score = value?.data?.stats?.data?.find( ({team_id}) => team_id === home_team_id )?.goals;
    
    const away_team_name = value.away_team_name;
    const away_red_cards = value?.data?.stats?.data?.find( ({ team_id }) => team_id === away_team_id )?.redcards;
    const away_team_score = value?.data?.stats?.data?.find( ({ team_id }) => team_id === home_team_id )?.goals;

    const home_team_obj: Fixture_Odds_Team = {
      name: home_team_name,
      score: home_team_score || null,
      red_cards: home_red_cards || null
    }

    const away_team_obj: Fixture_Odds_Team = {
      name: away_team_name,
      score: away_team_score || null,
      red_cards: away_red_cards || null
    }

    // [ℹ] generate fixtures_odds object
    const fixtures_odds_object: Tournament_Fixture_Odds = {
      id:               fixture_id,
      round:            round,
      week:             2, // FIXME:
      live_minute:      live_minutes,
      fixture_time:     fixture_time,
      fixture_date:     fixture_date,
      teams: {
        home:           home_team_obj,
        away:           away_team_obj
      },
      tip_link:         tip_link,
      media_link:       media_link,
      fixture_link:     fixture_link
    }

    // [ℹ] target league exists
    if (historic_fixtures_by_league.has(league_id)) {
      const league_fixtures_obj_arr = historic_fixtures_by_league.get(league_id)

      const target_season = league_fixtures_obj_arr.find (
        ({ season_id }) => 
          season_id === fix_season_id
      )

      // [ℹ] target season exists
      if (target_season != undefined) {

        // [🐛] debug
        /*
          const debug_league = 19517
          if (fix_season_id === 19517) {
            logs.push(`Pushing to existing season!`);
          }
        */
        
        league_fixtures_obj_arr.find(
          ({ season_id }) => season_id === fix_season_id
        ).fixtures.push(fixtures_odds_object)

        let arr = league_fixtures_obj_arr

        historic_fixtures_by_league.set(league_id, arr);
      }
      // [ℹ] no target season, init.
      else {

        // [🐛] debug
        /*
          const debug_league = 19517
          if (fix_season_id === 19517) {
            logs.push(`19517! No target, generating new!`);
          }
        */
          
        const new_league_id_obj: Tournament_Season_Fixtures_Odds = {
          season_id: fix_season_id,
          fixtures: []
        }
        new_league_id_obj.fixtures.push(fixtures_odds_object)

        league_fixtures_obj_arr.push(new_league_id_obj)
        
        let arr = league_fixtures_obj_arr
        
        historic_fixtures_by_league.set(league_id, arr);
      }
    }
    // [ℹ] no league_id yet exists
    else {

      if (fix_season_id === 19517) {
        logs.push(`19517! Generating new`);
      }

      const new_league_id_obj: Tournament_Season_Fixtures_Odds = {
        season_id: fix_season_id,
        fixtures: []
      }
      new_league_id_obj.fixtures.push(fixtures_odds_object)

      const fixtures_season_obj_arr: Tournament_Season_Fixtures_Odds[] = []
      fixtures_season_obj_arr.push(new_league_id_obj)

      let data = fixtures_season_obj_arr

      historic_fixtures_by_league.set(league_id, data);
    }
  }

  /**
   * [ℹ] merge rounds & weeks data
   * [ℹ] with each league_id's (sub) season_id 
  */

  for (const [key, value] of historic_fixtures_by_league.entries()) {
    const newObj: Tournament_Season_Fixtures_Odds[] = [] 
    for (let season_fix_odds of value) {
      const seasonId = season_fix_odds.season_id
      const weeks_rounds_data = season_week_round_ranges_map.get(seasonId)
      season_fix_odds = {
        ...season_fix_odds, 
        ...weeks_rounds_data
      }
      newObj.push(season_fix_odds)
    }
    historic_fixtures_by_league.set(key, newObj)
  }

  // [ℹ] persist data
  const arrayObj = []
  t0 = performance.now();
  logs.push(`total leagues: ${historic_fixtures_by_league.size}`)
  for (const [key, value] of historic_fixtures_by_league.entries()) {
    const finalObj: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response = {
      league_id: key,
      seasons: value || []
    }
    await cacheData(key, finalObj);
    arrayObj.push(value);
  }
  t1 = performance.now();
  logs.push(`cache uplaod complete in: ${(t1 - t0) / 1000} sec`);

  // // [🐛] debug
  if (dev) {
    const data = JSON.stringify(arrayObj, null, 4)
    fs.writeFile('./datalog/CQ_Tour_FixOdds_All_23.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return;
}

async function main_trans_and_seo (langArray :string[]) {

  const res = await getFixturesOddsTranslationData()

  const fix_odds_translation_map = new Map <string, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response> ()

  /**
   * [ℹ] MAIN 
  */
  for (const lang_ of langArray) {

    const object: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response = {}
    object.lang = lang_

    const objectFixOdds = res.scores_widget_football_fixtures_odds_translations_dev
      .find(({ lang }) => lang === lang_)

    const objectGeneral = res.scores_general_translations_dev
      .find(({ lang }) => lang === lang_)
    
    const mergedObj = {
      ...object, 
      ...objectFixOdds?.translations,
      ...objectGeneral?.months,
      ...objectGeneral?.weekdays,
      ...objectGeneral?.widgets_no_data_available
    }

    fix_odds_translation_map.set(lang_, mergedObj)
  }

  // [ℹ] persist data
  const arrayObj = []
  t0 = performance.now();
  logs.push(`total lang's: ${fix_odds_translation_map.size}`)
  for (const [key, value] of fix_odds_translation_map.entries()) {
    await cacheTranslationData(key, value);
    arrayObj.push(value);
  }
  t1 = performance.now();
  logs.push(`cache uplaod complete in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(arrayObj, null, 4)
    fs.writeFile('./datalog/main_trans_and_seo.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }
  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getHrefLang (): Promise < string[] > {
  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  return langArray;
}

async function getTargetSeasonDetailsData (seasonIdsArr: number[]): Promise < BETARENA_HASURA_fixtures_odds_query > {

  const VARIABLES_1 = {
    seasonIds: seasonIdsArr
  }
  
  const t0 = performance.now();
  const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_2";
	const response: BETARENA_HASURA_fixtures_odds_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURES_ODDS_DATA_2,
    VARIABLES_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function getFixturesOddsTranslationData (): Promise < BETARENA_HASURA_fixtures_odds_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_FIXTURES_ODDS_DATA_3";
	const response: BETARENA_HASURA_fixtures_odds_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURES_ODDS_DATA_3
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function getWeeksDiff (startDate: Date, endDate: Date) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.round(Math.abs(endDate - startDate) / msInWeek);
}