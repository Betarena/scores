import { dev } from '$app/env'
import redis from "$lib/redis/init"
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';

import { getLivescoresNow } from '$lib/firebase/fixtures_odds';

import type { 
  BACKEND_tournament_standings_surgical_update
} from '$lib/models/tournaments/standings/types';
import type { 
  FIREBASE_livescores_now 
} from '$lib/models/firebase';
import type { 
  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response 
} from '$lib/models/tournaments/fixtures_odds/types';

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
const cacheTarget = "REDIS CACHE | tournament fixtures_odds (surgical)"
const cacheDataAddr = "tour_fix_odds_data"
// [ℹ] debug info
let logs = []
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function post({ request }): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`
    ℹ ${cacheTarget} 
    at: ${new Date().toDateString()}
  `);

  const body = await request.json();
  if (dev) console.log(body);
  const dataSurgical = JSON.parse(JSON.stringify(body));
  
  // [ℹ] job producers
  // const job = await CQ_Tour_FixOdds_S.add(dataSurgical);

  await surgicalDataUpdate(dataSurgical)

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

async function getCacheData (league_id: string): Promise < REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response | Record < string, never > > {
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
  // await surgicalDataUpdate()
  // await surgicalDataUpdate_2(job.data);
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

async function surgicalDataUpdate (dataUpdate: BACKEND_tournament_standings_surgical_update) { 
  
  // [ℹ] validation check
  if (dataUpdate === undefined) {
    logs.push(`dataUpdate is undefined`)
    logs.push(`dataUpdate: ${dataUpdate}`)
    console.log("dataUpdate undefined!")
    return;
  }
  if (dataUpdate.leagueSeasons === undefined) {
    logs.push(`dataUpdate.leagueSeasons is undefined`)
    logs.push(`dataUpdate.leagueSeasons: ${dataUpdate?.leagueSeasons}`)
    console.log("dataUpdate.leagueSeasons undefined!")
    return;
  }

  const leagueIdsArr = dataUpdate.leagueSeasons.map(a => a.leagueId);
  const fixturesIdsArr = dataUpdate?.fixturesList;
  
  logs.push(`num. of leagueIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of fixturesIds: ${fixturesIdsArr}`);

  const firebase_real_time = await getLivescoresNow()
  const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)

  const liveFixturesMap = await checkForLiveFixtures(data);
  const cacheTargetLeagueData = await getTargetLeagueFixturesData(leagueIdsArr);
  
  const newData = await injectNewFixturesData(liveFixturesMap, cacheTargetLeagueData);

  // for (const newFixture of newData) {
  //   await cacheData(newFixture.league_id, newFixture);
  // }

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(newData, null, 4)
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

async function checkForLiveFixtures (data: [string, FIREBASE_livescores_now][]): Promise < Map <number, FIREBASE_livescores_now> >  {

  const liveFixturesMap = new Map <number, FIREBASE_livescores_now>( );

  // [ℹ] generate map
  for (const live_fixture of data) {
    const fixture_id = parseInt(live_fixture[0].toString())
    const fixture_data = live_fixture[1]
    liveFixturesMap.set(fixture_id, fixture_data)
  }

  return liveFixturesMap;
}

async function getTargetLeagueFixturesData (leagueIdsArr: number[]) {

  const dataArr: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response[] = []
  
  for await (const league of leagueIdsArr) {
    const cacheData = await getCacheData(league.toString())
    dataArr.push(cacheData)
  }

  return dataArr
}

async function injectNewFixturesData (liveFixturesMap: Map <number, FIREBASE_livescores_now>, cacheTargetLeagueData: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response[] ): Promise < REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response[] > {

  for (const cache of cacheTargetLeagueData) {

    if (cache?.seasons === null || cache?.seasons.length === 0) continue;
    
    for (const season of cache.seasons) {
      
      if (season.fixtures === null || season.fixtures.length === 0) continue;

      for (const fixture of season.fixtures) {

        if (liveFixturesMap.has(fixture.id)) {

          fixture.minute = liveFixturesMap.get(fixture.id)?.time?.minute,
          fixture.status = liveFixturesMap.get(fixture.id)?.time?.status,
          fixture.teams = {
            away: {
              name: fixture?.teams?.away?.name,
              red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[0]?.redcards,
              score: liveFixturesMap.get(fixture.id)?.scores?.visitorteam_score,
            },
            home: {
              name: fixture?.teams?.home?.name,
              red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[1]?.redcards,
              score: liveFixturesMap.get(fixture.id)?.scores?.localteam_score,
            }
          }

        }
      }
    }
  }

  return cacheTargetLeagueData;
}