import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { 
  REDIS_CACHE_FIXTURE_CONTENT_DATA_0, 
  REDIS_CACHE_FIXTURE_CONTENT_DATA_1, 
  REDIS_CACHE_FIXTURE_CONTENT_DATA_2 
} from '$lib/graphql/fixtures/content/query';
import { Queue, Worker } from 'bullmq';

import fs from 'fs';
import { performance } from 'perf_hooks';

import type { 
  BETARENA_HASURA_external_content,
  BETARENA_HASURA_historic_fixtures 
} from '$lib/models/hasura';
import type { BETARENA_HASURA_content_query } from '$lib/models/fixtures/content/types';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const cacheTarget = "REDIS CACHE | fixture content (all)"
const cacheQueueProcessName = "CQ_Fixture_Content"
const cache_data_addr = "fixture_content_data"
const CQ_Fixture_Content = new Queue (
  cacheQueueProcessName,
  { 
    connection: { 
      port: 6379, 
      host: "localhost", 
      password: "J6*&+@yDsRhyPU4%"
    },
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: 5
    }
  }
);
// [ℹ] debug info
let logs = []
let t0: number;
let t1: number;

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

    /*
      NOTE: Cache data:
      NOTE: Only current_season fixtures should be cached; 
    */

    /*
      NOTE: SEO Cache Data
      [ℹ] => Title
      [ℹ] => Link
      [ℹ] => Excerpt
    */
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
    // [ℹ] producers add [JOB] to consumer [QUEUE]
    const job = await CQ_Fixture_Content.add('job', {});
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
  id: string | number,
  json_cache: object
) {
  try {
    await redis.hset(cache_data_addr, id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cache_data_addr}`, e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

const worker = new Worker (
  cacheQueueProcessName, 
  async job =>
  {
    logs = []
    logs.push(`JobId: ${job.id}`);

    /* 
    do stuff
    */

    const t0 = performance.now();
    await main()
    const t1 = performance.now();

    logs.push(`${cacheTarget} updated!`);
    logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

    return { logs: logs };
  },
  {
    connection: { 
      port: 6379, 
      host: "localhost", 
      password: "J6*&+@yDsRhyPU4%"
    }
  }
);

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main () {

  /**
   * [ℹ] obtain target current season_id's
   * [ℹ] obtain target historic_fixtures
   * [ℹ] obtain target external_content
   * [ℹ] convert to map
  */

  const current_seasons = await get_current_seasons()
  // eslint-disable-next-line prefer-const
  let current_seasons_arr: number[] = current_seasons?.scores_football_seasons_details.map(a => a.id)
  if (dev) current_seasons_arr = [19734] // [ℹ] manual target season(s) [DEV]

  const h_fixtures_arr = await get_target_historic_fixtures(current_seasons_arr)
  // eslint-disable-next-line prefer-const
  let fixtures_arr: number[] = h_fixtures_arr.map(a => a.id)

  const external_content_arr = await get_target_external_content(fixtures_arr)
  const external_content_map = await generate_external_content_map(external_content_arr)

  /**
   * [ℹ] data pre-processing
   * [ℹ] & persistance to cache [END]
  */

  for (const [id, data] of external_content_map.entries()) {
    await cache_data(id, data)
  }

  // [🐞]
  if (dev) {
    const data = JSON.stringify(Array.from(external_content_map.entries()), null, 4)
    fs.writeFile(`./datalog/${cacheQueueProcessName}.json`, data, err => {
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

async function get_current_seasons (
): Promise < BETARENA_HASURA_content_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_FIXTURE_CONTENT_DATA_0";
	const response: BETARENA_HASURA_content_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURE_CONTENT_DATA_0
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function get_target_historic_fixtures (
  seasonIdsArr: number[]
): Promise < BETARENA_HASURA_historic_fixtures[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let h_fixtures_arr: BETARENA_HASURA_historic_fixtures[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  const queryName = "REDIS_CACHE_FIXTURE_CONTENT_DATA_1";
  t0 = performance.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    
    const response: BETARENA_HASURA_content_query = await initGrapQLClient().request (
      REDIS_CACHE_FIXTURE_CONTENT_DATA_1,
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

async function get_target_external_content (
  fixtureIds: number[]
): Promise < BETARENA_HASURA_external_content[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let external_content_arr: BETARENA_HASURA_external_content[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  const queryName = "REDIS_CACHE_FIXTURE_CONTENT_DATA_2";
  t0 = performance.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      gameIds: fixtureIds
    }
    
    const response: BETARENA_HASURA_content_query = await initGrapQLClient().request (
      REDIS_CACHE_FIXTURE_CONTENT_DATA_2,
      VARIABLES
    );

    external_content_arr = external_content_arr.concat(response.external_content)

    // [ℹ] break, exit loop
    if (offset >= total_limit) {
      // [🐞]
      if (dev) console.log(`exiting loop`)
      logs.push(`total limit: ${total_limit}`)
      logs.push(`gathered: ${external_content_arr.length}`)
      logs.push(`exiting after ${counter} iterations`)
      break;
    }

    total_limit = response.external_content_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return external_content_arr;
}

async function generate_external_content_map (
  data_arr: BETARENA_HASURA_external_content[]
): Promise < Map <string, BETARENA_HASURA_external_content[]> > {
  const map = new Map <string, BETARENA_HASURA_external_content[]>()

  // [ℹ] conversion to hashmap
  t0 = performance.now();
  for (const content of data_arr) {
    const id = content?.gameid + "_" + content?.lang
    // [ℹ] validation check of "key" in map existance
    if (map.has(id)) {
      const exist_arr = map.get(id)
      exist_arr.push(content)
      map.set(id, exist_arr)
    }
    // [ℹ] initialize "content" array
    else {
      const init_arr = []
      init_arr.push(content)
      map.set(id, init_arr);
    }
  }
  t1 = performance.now();
  logs.push(`Map generated with size: ${map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return map;
}