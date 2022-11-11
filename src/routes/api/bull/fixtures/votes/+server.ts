import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import Bull from 'bull';
import { Queue, Worker } from 'bullmq';

import { GET_HREFLANG_DATA } from '$lib/graphql/query';

import fs from 'fs';
import { performance } from 'perf_hooks';

import type { BETARENA_HASURA_votes_query, REDIS_CACHE_SINGLE_votes_translation } from '$lib/models/fixtures/votes/types';
import { HASURA_FIXTURE_VOTES_DATA_1 } from '$lib/graphql/fixtures/votes/query';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const cacheTarget = "REDIS CACHE | fixture votes (all)"
const cacheQueueProcessName = "CQ_Fixture_Votes"
const cache_trans_addr = "fixture_votes_trans"

// NOTE: V1 Bull V3
const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const CQ_Fixture_Votes = new Bull (
  cacheQueueProcessName, 
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

// NOTE: V2 BullMQ
/*
  const CQ_Fixture_Votes = new Queue (
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
*/

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
    console.log(`${cacheTarget}`);
    console.log(`at: ${new Date().toDateString()}`);

    /*
      NOTE: Cache data:
      NOTE: Only current_season fixtures should be cached; 
    */

    /*
      NOTE: SEO Cache Data
      [ℹ] => All Cache is meant to be cached
    */
    const langArray = await getHrefLang()
    await main_trans_and_seo(langArray)

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
    const job = await CQ_Fixture_Votes.add('job', {});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }
  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_translation (
  id: string | number,
  json_cache: object
) {
  try {
    await redis.hset(cache_trans_addr, id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cache_trans_addr}`, e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

// NOTE: V1 Bull V3
CQ_Fixture_Votes.process (async function (job, done) {
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
  const t1 = performance.now();

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// NOTE: V2 BullMQ
/**
const worker = new Worker (
  cacheQueueProcessName, 
  async job =>
  {
    logs = []
    logs.push(`JobId: ${job.id}`);

    const t0 = performance.now();
    const langArray = await getHrefLang()
    await main_trans_and_seo(langArray)
    await main(langArray)
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
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main_trans_and_seo (
  langArray :string[]
) {

  const res = await get_widget_translations()

  const fix_odds_translation_map = new Map <string, REDIS_CACHE_SINGLE_votes_translation> ()

  /**
   * [ℹ] MAIN 
  */
  for (const lang_ of langArray) {

    const object: REDIS_CACHE_SINGLE_votes_translation = {}
    object.lang = lang_

    const objectFixAbout = res.scores_fixture_voting_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = res.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const mergedObj = {
      ...object, 
      ...objectFixAbout?.translations,
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
): Promise < BETARENA_HASURA_votes_query > {

  const t0 = performance.now();
  const queryName = "HASURA_FIXTURE_VOTES_DATA_1";
  const response: BETARENA_HASURA_votes_query = await initGrapQLClient().request (
    HASURA_FIXTURE_VOTES_DATA_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}