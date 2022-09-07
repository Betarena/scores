import { dev } from '$app/env'
import redis from "$lib/redis/init"
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { 
  REDIS_CACHE_FIXTURES_ODDS_DATA_2, 
  REDIS_CACHE_FIXTURES_ODDS_ST_DATA_1 
} from '$lib/graphql/tournaments/fixtures_odds/query';

import type { 
  BACKEND_tournament_standings_surgical_update
} from '$lib/models/tournaments/standings/types';
import type { 
  BETARENA_HASURA_fixtures_odds_query,
  Fixture_Odds_Team,
  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response, 
  Rounds_Data, 
  Tournament_Fixture_Odds, 
  Tournament_Season_Fixtures_Odds,
  Weeks_Data
} from '$lib/models/tournaments/fixtures_odds/types';
import type { 
  BETARENA_HASURA_historic_fixtures 
} from '$lib/models/hasura';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const CQ_Tour_FixOdds_S = new Bull (
  'CQ_Tour_FixOdds_S', 
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
const cacheQueueProcessName = "CQ_Tour_FixOdds_S"
const cacheTarget           = "REDIS CACHE | tournament fixtures_odds (surgical)"
const cacheDataAddr         = "tour_fix_odds_data"
// [ℹ] debug info
let logs = []
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST (
  { request }
): Promise < unknown > {

  const body = await request.json();
  if (dev) console.log(body);
  const dataSurgical = JSON.parse(JSON.stringify(body));

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    await surgicalDataUpdate(dataSurgical);

    for (const log of logs) {
      console.log(log)
    }

    return {
      status: 200,
      body: { 
        job_id: cacheTarget + " done!"
      }
    }
  }
  // [ℹ] otherwise prod.
  else {
    // [ℹ] producers [JOBS]
    const job = await CQ_Tour_FixOdds_S.add(dataSurgical, { timeout: 120000 });
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return {
      status: 200,
      body: { 
        job_id: job.id
      }
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheData (
  league_id: number, 
  json_cache: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response
) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset(cacheDataAddr, league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cacheDataAddr}`, e);
  }
}

async function getCacheData (
  league_id: string
): Promise < REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cacheDataAddr, league_id);
    if (cached) {
      // [🐛] debug;
      if (dev) console.info(`✅ ${cacheDataAddr} cache data retrieved`);
      const parsed: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cacheDataAddr} cache error`, e);
    return
  }
} 

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

CQ_Tour_FixOdds_S.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  await surgicalDataUpdate(job.data);
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

async function surgicalDataUpdate (
  dataUpdate: BACKEND_tournament_standings_surgical_update
) { 
  
  // [ℹ] validation check
  if (dataUpdate === undefined) {
    logs.push(`dataUpdate is undefined`)
    console.log("dataUpdate undefined!")
    return;
  }

  // const leagueIdsArr = dataUpdate.leagueSeasons.map(a => a.leagueId); // not present in body
  const fixturesIdsArr = dataUpdate?.fixturesList;
  
  // logs.push(`num. of leagueIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of fixturesIds: ${fixturesIdsArr}`);

  const hasura_data = await getTargetHistoricFixtures (fixturesIdsArr)

  const leagueIdsArr = hasura_data?.historic_fixtures_dev.map(a => a.league_id);
  const seasonIdsArr = hasura_data?.historic_fixtures_dev.map(a => a.data?.season_id);

  // [🐛] debug
  if (leagueIdsArr.includes(null)) {
    console.log(`contains null`)
  }
  if (seasonIdsArr.includes(null)) {
    console.log(`contains null`)
  }

  const historicFixturesMap = await checkForLiveFixtures (hasura_data);

  // [🐛] debug
  if (dev) {
    const values = Array.from(historicFixturesMap.values());
    const data = JSON.stringify(values, null, 4)
      fs.writeFile('./datalog/historicFixturesMap.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  /**
   * [ℹ] dealing with season_details 
  */

  const season_details_data = await getTargetSeasonDetailsData (seasonIdsArr);
  const season_week_round_ranges_map = await breakdownWeeksRounds (
    seasonIdsArr,
    season_details_data
  );

  /**
   * [ℹ] gather target cache data 
  */

  const cacheTargetLeagueData = await getTargetLeagueFixturesData (leagueIdsArr);
  
  /**
   * [ℹ] inject new fixtures data
   * [ℹ] with cache 
  */

  const newData = await injectNewFixturesData (
    historicFixturesMap, 
    cacheTargetLeagueData
  );

  /**
   * [ℹ] merge rounds & weeks data
   * [ℹ] with each league_id's (sub) season_id 
  */

  const newDataFinal = await injectWeeksRounds (
    season_week_round_ranges_map,
    newData
  )

  // [ℹ] persist data
  t0 = performance.now();
  logs.push(`leagues: ${Array.from(newDataFinal.keys())}`)
  logs.push(`total leagues: ${newDataFinal.size}`)
  for (const [key, value] of newDataFinal.entries()) {
    await cacheData(key, value);
  }
  t1 = performance.now();
  logs.push(`cache uplaod complete in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  if (dev) {
    const values = Array.from(newDataFinal.values());
    const data = JSON.stringify(values, null, 4)
      fs.writeFile('./datalog/surgicalDataUpdate.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTargetHistoricFixtures (
  fixturesIdsArr: number[]
): Promise < BETARENA_HASURA_fixtures_odds_query > {

  const VARIABLES_1 = {
    fixtureIds: fixturesIdsArr
  }
  
  const t0 = performance.now();
  const queryName = "REDIS_CACHE_FIXTURES_ODDS_ST_DATA_1";
	const response: BETARENA_HASURA_fixtures_odds_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURES_ODDS_ST_DATA_1,
    VARIABLES_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function getTargetSeasonDetailsData (
  seasonIdsArr: number[]
): Promise < BETARENA_HASURA_fixtures_odds_query > {

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

async function breakdownWeeksRounds (
  seasonIdsArr:         number[], 
  season_details_data:  BETARENA_HASURA_fixtures_odds_query
): Promise < Map < number, Tournament_Season_Fixtures_Odds > > {

  /**
   * [ℹ] breakdown season by weeks
   * [ℹ] breakdown season by rounds 
  */

  const season_week_round_ranges_map = new Map < number, Tournament_Season_Fixtures_Odds > ();

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

    // [🐛] debug
    /*
      console.log(`seasonId: ${seasonId}`)
      if (seasonId.toString() == '19740') {
        console.log(`
          season_start: ${season_start}
          season_start v2: ${new Date(season_start)}
          count_weeks: ${count_weeks}
        `)
      }
    */
    for (let index = 0; index < count_weeks + 1; index++) {

      const name = index + 1
      const s_date = new Date(season_start)
      const e_date = new Date(season_start)

      s_date.setDate(s_date.getDate() + (index * 7));
      e_date.setDate(e_date.getDate() + (index * 7));

      // [ℹ] hypothetical alternative to get
      // [ℹ] next-month "sunday"
      // const currentMonthDays = new Date(
      //   s_date.getFullYear(),
      //   s_date.getMonth() + 1,
      //   0
      // ).getDate();

      s_date.setDate(s_date.getDate() - s_date.getDay() + 1);
      e_date.setDate(e_date.getDate() - e_date.getDay() + 7);

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

  return season_week_round_ranges_map;
}

async function getWeeksDiff (
  startDate: Date, 
  endDate: Date
) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.round(Math.abs(endDate - startDate) / msInWeek);
}

async function checkForLiveFixtures (
  data: BETARENA_HASURA_fixtures_odds_query
): Promise < Map <number, BETARENA_HASURA_historic_fixtures> >  {

  const historicFixturesMap = new Map <number, BETARENA_HASURA_historic_fixtures>( );

  // [ℹ] generate map
  for (const hist_fixture of data?.historic_fixtures_dev) {
    const fixture_id = parseInt(hist_fixture?.id.toString())
    historicFixturesMap.set(fixture_id, hist_fixture)
  }

  return historicFixturesMap;
}

async function getTargetLeagueFixturesData (
  leagueIdsArr: number[]
): Promise < Map <number, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response> > {

  const dataArr: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response[] = []
  
  for await (const league of leagueIdsArr) {
    const cacheData = await getCacheData(league.toString())
    dataArr.push(cacheData)
  }

  const cacheHistoricFixturesMap = new Map <number, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response>( );

  // [ℹ] generate map
  for (const hist_league of dataArr) {
    const league_id = parseInt(hist_league?.league_id.toString())
    cacheHistoricFixturesMap.set(league_id, hist_league)
  }

  return cacheHistoricFixturesMap
}

async function injectNewFixturesData (
  historicFixturesMap:    Map <number, BETARENA_HASURA_historic_fixtures>, 
  cacheTargetLeagueData:  Map <number, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response> 
): Promise < Map <number, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response> > {

  // [ℹ] iterating over target fixtures to update
  for (const [key, value] of historicFixturesMap.entries()) {

    const fix_season_id = value.data?.season_id;
    const league_id = value.league_id;
    const fixture_id = value.id;
    const home_team_id = value.data?.localteam_id;
    const away_team_id = value.data?.visitorteam_id;

    const round = value.data?.round?.data?.name;
    const fixture_date = value.fixture_day;
    const fixture_time = value.time;
    const minutes = value.data?.time?.minute;
    const status = value.data?.time?.status;

    const tip_link = value.tip_link_wp
    const media_link = value.media_link;
    const fixture_link = value.fixture_link_wp;
    
    const home_team_name = value.home_team_name;
    const home_red_cards = value?.data?.stats?.data?.find( ({ team_id }) => team_id === home_team_id )?.redcards;
    const home_team_score = value?.data?.stats?.data?.find( ({team_id}) => team_id === home_team_id )?.goals;
    
    const away_team_name = value.away_team_name;
    const away_red_cards = value?.data?.stats?.data?.find( ({ team_id }) => team_id === away_team_id )?.redcards;
    const away_team_score = value?.data?.stats?.data?.find( ({ team_id }) => team_id === away_team_id )?.goals;

    const home_team_obj: Fixture_Odds_Team = {
      name: home_team_name,
      score: home_team_score || 0,
      red_cards: home_red_cards || null
    }

    const away_team_obj: Fixture_Odds_Team = {
      name: away_team_name,
      score: away_team_score || 0,
      red_cards: away_red_cards || null
    }

    // [ℹ] generate fixtures_odds object
    const fixtures_odds_object: Tournament_Fixture_Odds = {
      id:               fixture_id,
      round:            round,
      // week:             2, // FIXME: unecessary, using fixture_date instead
      minute:           minutes,
      status:           status,             
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
    if (cacheTargetLeagueData.has(league_id)) {

      const league_fixtures_obj_arr = cacheTargetLeagueData.get(league_id)

      const target_season = league_fixtures_obj_arr.seasons
      .find(
        ({ season_id }) => 
          season_id === fix_season_id
      );

      // [ℹ] target season exists
      if (target_season != undefined) {

        for (const fixture of target_season.fixtures) {

          // FIXME: add the check to populate a new "fixture_id"
          // FIXME: if this does not exist in the "fixtures" array in
          // FIXME: the first place

          if (fixture.id === fixture_id) {
            
            if (dev) console.log(`fixture_id: ${fixture.id} | before: ${fixture.status}`)

            fixture.round = historicFixturesMap.get(fixture.id)?.data?.round?.data?.name;
            fixture.fixture_date = historicFixturesMap.get(fixture.id)?.fixture_day;
            fixture.fixture_time = historicFixturesMap.get(fixture.id)?.time;
            fixture.minute = historicFixturesMap.get(fixture.id)?.data?.time?.minute;
            fixture.status = historicFixturesMap.get(fixture.id)?.data?.time?.status;
            fixture.teams = {
              away: {
                name: fixture?.teams?.away?.name,
                red_cards: historicFixturesMap.get(fixture.id)?.data?.stats?.data[1]?.redcards,
                score: historicFixturesMap.get(fixture.id)?.data?.scores?.visitorteam_score,
              },
              home: {
                name: fixture?.teams?.home?.name,
                red_cards: historicFixturesMap.get(fixture.id)?.data?.stats?.data[0]?.redcards,
                score: historicFixturesMap.get(fixture.id)?.data?.scores?.localteam_score,
              }
            }
            fixture.tip_link = historicFixturesMap.get(fixture.id).tip_link_wp
            fixture.fixture_link = historicFixturesMap.get(fixture.id).fixture_link_wp
            fixture.media_link = historicFixturesMap.get(fixture.id).media_link

            if (dev) console.log(`fixture_id: ${fixture.id} | after: ${fixture.status} | expected: ${historicFixturesMap.get(fixture.id)?.data?.time?.status}`)
          }
        }

        cacheTargetLeagueData.set(league_id, league_fixtures_obj_arr);
      }
      // [ℹ] no target season, init.
      else {

        const new_league_id_obj: Tournament_Season_Fixtures_Odds = {
          season_id: fix_season_id,
          fixtures: []
        }
        new_league_id_obj.fixtures.push(fixtures_odds_object)

        league_fixtures_obj_arr.seasons.push(new_league_id_obj)
        
        cacheTargetLeagueData.set(league_id, league_fixtures_obj_arr);
      }

    }
    // [ℹ] no league_id yet exists
    else {

      const new_league_id_obj: Tournament_Season_Fixtures_Odds = {
        season_id: fix_season_id,
        fixtures: []
      }
      new_league_id_obj.fixtures.push(fixtures_odds_object)

      const fixtures_season_obj_arr: Tournament_Season_Fixtures_Odds[] = []
      fixtures_season_obj_arr.push(new_league_id_obj)

      const league_parent_obj: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response = {
        league_id: league_id,
        seasons: fixtures_season_obj_arr
      }

      cacheTargetLeagueData.set(league_id, league_parent_obj);
    }

  }

  return cacheTargetLeagueData;
}

async function injectWeeksRounds (
  season_week_round_ranges_map: Map < number, Tournament_Season_Fixtures_Odds >,
  cacheTargetLeagueData:  Map <number, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response>
): Promise < Map <number, REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response> > {

  for (const [key, value] of cacheTargetLeagueData.entries()) {

    const newObj: Tournament_Season_Fixtures_Odds[] = [] 
    
    // FIXME: can be "null" for some reason
    // FIXME: particulary on the (ALL) cache generation
    if (key == null) { 
      if (dev) console.log(`league_id: ${key}`)
      continue;
    }

    for (let season_fix_odds of value?.seasons) {

      const seasonId = season_fix_odds.season_id
      const weeks_rounds_data = season_week_round_ranges_map.get(seasonId)

      if (weeks_rounds_data?.weeks == null || weeks_rounds_data?.weeks == undefined ) {
        if (dev) console.log(`week value: ${weeks_rounds_data?.weeks}`)
      }
      
      season_fix_odds = {
        season_id: seasonId,
        fixtures: season_fix_odds?.fixtures,
        weeks: weeks_rounds_data?.weeks || [],
        rounds: weeks_rounds_data?.rounds || []
      }

      // [ℹ] remove empty (NaN fixtures num.)
      // [ℹ] target weeks from weeks_list
      const modWeeksData = await identifyFixtureWeeks(season_fix_odds)
      season_fix_odds.weeks = modWeeksData

      newObj.push(season_fix_odds)

      value.seasons = newObj;
    }

    cacheTargetLeagueData.set(key, value)
  }
  
  return cacheTargetLeagueData;
}

async function identifyFixtureWeeks (
  target_season: Tournament_Season_Fixtures_Odds 
): Promise < Weeks_Data[] > {

  const newWeekArr: Weeks_Data[] = []

  for (const week of target_season.weeks) {

    const week_start_t = new Date(week.s_date)
    const week_end_t = new Date(week.e_date)

    const fixturesArrMatch = target_season.fixtures
    .filter( ({ fixture_date }) => 
      new Date(fixture_date) >= week_start_t &&
      new Date(fixture_date) <= week_end_t
    );
    
    // [ℹ] fixtures exist
    if (fixturesArrMatch.length != 0) {
      newWeekArr.push(week)
    }
  }

  // [ℹ] additional array re-structuring
  // [ℹ] validation check for change
  if (newWeekArr.length !== target_season.weeks.length) {

    // [ℹ] re-sort array descending by "name"
    newWeekArr.sort((a,b) => parseInt(a.name) - parseInt(b.name));

    // [ℹ] update "name" (id) in sequntial [1,2,3..]
    // [ℹ] values
    let counter = 1;
    for (const item of newWeekArr) {
      item.name = counter.toString()
      counter++
    }
  }

  return newWeekArr;
}