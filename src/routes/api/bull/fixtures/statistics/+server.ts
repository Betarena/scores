import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import { GET_HREFLANG_DATA } from '$lib/graphql/query';
import { 
  REDIS_CACHE_FIXTURE_STATISTICS_DATA_0, 
  REDIS_CACHE_FIXTURE_STATISTICS_DATA_1, 
  REDIS_CACHE_FIXTURE_STATISTICS_DATA_3 
} from '$lib/graphql/fixtures/statistics/query';

import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_statistics_query, 
  BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures, 
  Fixture_Statistics, 
  Incident_Team, 
  REDIS_CACHE_SINGLE_statistics_data, 
  REDIS_CACHE_SINGLE_statistics_translation 
} from '$lib/models/fixtures/statistics/types';
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
const CQ_Fixture_Statistics = new Bull (
  'CQ_Fixture_Statistics', 
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
const cacheQueueProcessName = "CQ_Fixture_Statistics"
const cacheTarget = "REDIS CACHE | fixture statistics (all)"
const cache_data_addr = "fixture_statistics_data"
const cache_trans_addr = "fixture_statistics_trans"
// [ℹ] debug info
let logs = []
let t0;
let t1;

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

    // NOTE: Cache data:
    // Only current_season fixtures should be cached; 
    // the last 2 hours' update fixtures update logic
    // other seasons should call Hasura directly.

    // NOTE: SEO Cache data:
    // => widget_title
    // => team_names

    const langArray = await getHrefLang()
    await main_trans_and_seo(langArray)
    await main()

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
    const job = await CQ_Fixture_Statistics.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }
  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_data (
  league_id: number, 
  json_cache: REDIS_CACHE_SINGLE_statistics_data
) {
  try {
    await redis.hset(cache_data_addr, league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cache_data_addr}`, e);
  }
}

async function cache_translation (
  lang: string, 
  json_cache: REDIS_CACHE_SINGLE_statistics_translation
) {
  try {
    await redis.hset(cache_trans_addr, lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cache_trans_addr}`, e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

CQ_Fixture_Statistics.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  const langArray = await getHrefLang()
  await main_trans_and_seo(langArray)
  await main()
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

  /**
   * [ℹ] obtain target current season_id's
  */

  const current_seasons = await get_current_seasons()
  // eslint-disable-next-line prefer-const
  let current_seasons_arr: number[] = current_seasons?.scores_football_seasons_details.map(a => a.id)
  if (dev) current_seasons_arr = [19734] // [ℹ] manual update target seasons
  // if (dev) console.log(`current_seasons_arr`, current_seasons_arr)

  /**
   * [ℹ] obtain target historic_fixtures
   * [ℹ] convert to map
  */

  const h_fixtures_arr = await get_target_historic_fixtures(current_seasons_arr)
  const historic_fixtures_map = await generate_historic_fixtures_map(h_fixtures_arr)

  /**
   * [ℹ] data pre-processing
   * [ℹ] & persistance [END]
  */

  const cache_data_arr: Fixture_Statistics[] = []

  for (const [key, value] of historic_fixtures_map.entries()) {

    const fixture_id = value?.id;
    const status = value?.status_j;
    const stats = 
      value?.stats_j == undefined
        ? []
        : value?.stats_j
    ;

    // [ℹ] home-team
    const home_team_id = value?.localteam_id_j;
    const home_team_name = value?.home_team_name || null;
    const home_team_logo = value?.home_team_logo || null; 

    // [ℹ] away-team
    const away_team_id = value?.visitorteam_id_j;
    const away_team_name = value?.away_team_name;
    const away_team_logo = value?.away_team_logo;

    const home_team_obj: Incident_Team = {
      team_name: home_team_name || null,
      team_logo: home_team_logo || null,
      team_id: home_team_id
    }

    const away_team_obj: Incident_Team = {
      team_name: away_team_name || null,
      team_logo: away_team_logo || null,
      team_id: away_team_id
    }

    // [ℹ] generate [final] fixture object
    const fixture_object: Fixture_Statistics = {
      id:      fixture_id || null,
      status:  status,
      home:    home_team_obj,
      away:    away_team_obj,
      stats:   stats
    }

    await cache_data(key, fixture_object)

    // [🐞]
    cache_data_arr.push(fixture_object)
  }

  // [🐞]
  if (dev) {
    const data = JSON.stringify(cache_data_arr, null, 4)
    fs.writeFile(`./datalog/${cacheQueueProcessName}.json`, data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return;
}

async function main_trans_and_seo (
  langArray :string[]
) {

  const res = await get_widget_translations()

  const fix_odds_translation_map = new Map <string, REDIS_CACHE_SINGLE_statistics_translation> ()

  /**
   * [ℹ] MAIN 
  */
  for (const lang_ of langArray) {

    const object: REDIS_CACHE_SINGLE_statistics_translation = {}
    object.lang = lang_

    const objectFixOdds = res.scores_fixture_stats_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = res.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const mergedObj = {
      ...object, 
      ...objectFixOdds?.translations,
      ...objectFixGeneralTranslation?.widgets_no_data_available
    }

    fix_odds_translation_map.set(lang_, mergedObj)
  }

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(fix_odds_translation_map.values(), null, 4)
    fs.writeFile('./datalog/main_trans_and_seo.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  // [ℹ] persist data
  t0 = performance.now();
  logs.push(`total lang's: ${fix_odds_translation_map.size}`)
  for (const [key, value] of fix_odds_translation_map.entries()) {
    await cache_translation(key, value);
  }
  t1 = performance.now();
  logs.push(`cache uplaod complete in: ${(t1 - t0) / 1000} sec`);

  return

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_current_seasons (
): Promise < BETARENA_HASURA_statistics_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_FIXTURE_STATISTICS_DATA_0";
	const response: BETARENA_HASURA_statistics_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURE_STATISTICS_DATA_0
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function get_target_historic_fixtures (
  seasonIdsArr: number[]
): Promise < BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let h_fixtures_arr: BETARENA_HASURA_historic_fixtures[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  const queryName = "REDIS_CACHE_FIXTURE_STATISTICS_DATA_1";
  t0 = performance.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    
    const response: BETARENA_HASURA_statistics_query = await initGrapQLClient().request (
      REDIS_CACHE_FIXTURE_STATISTICS_DATA_1,
      VARIABLES
    );

    h_fixtures_arr = h_fixtures_arr.concat(response.historic_fixtures)

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`exiting loop`)
      logs.push(`total limit: ${total_limit}`)
      logs.push(`fixtures gathered: ${h_fixtures_arr.length}`)
      logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.historic_fixtures_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  // FIXME: some duplicates [?]
  /*
    const mainArrIds = []
    for (const i of h_fixtures_arr) {
      mainArrIds.push(i.id)
    }
    const duplicates = mainArrIds.filter((e, i, a) => a.indexOf(e) !== i) // [2, 4]
    logs.push(`duplicates: ${duplicates.length}`)

    if (dev) {
      const data = JSON.stringify(duplicates, null, 4)
      await fs.writeFile(`./datalog/duplicates_local_main.json`, data);
    }
  */

  return h_fixtures_arr;
}

async function generate_historic_fixtures_map (
  h_fixtures_arr: BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
): Promise < Map <number, BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures> > {
  const historic_fixtures_map = new Map <number, BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures>()

  // [ℹ] conversion to hashmap
  t0 = performance.now();
  for (const h_fixture of h_fixtures_arr) {
    historic_fixtures_map.set(h_fixture.id, h_fixture);
  }
  t1 = performance.now();
  logs.push(`historic_fixtures_map generated with size: ${historic_fixtures_map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return historic_fixtures_map;
}

async function getHrefLang (
): Promise < string[] > {
  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  return langArray;
}

async function get_widget_translations (
): Promise < BETARENA_HASURA_statistics_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_FIXTURE_STATISTICS_DATA_3";
  const response: BETARENA_HASURA_statistics_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURE_STATISTICS_DATA_3
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}