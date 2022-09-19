import { dev } from '$app/environment'
import redis from "$lib/redis/init_dev"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { REDIS_CACHE_LEAGUE_INFO_DATA_2 } from '$lib/graphql/tournaments/league-info/query';
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_league_info_query,
  Cache_Single_SportbookDetails_Data_Response
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

    await sportbookDetailsGenerationAll();

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

async function cacheCacheSportbookDetailInfoData (geoPos: string, json_cache: Cache_Single_SportbookDetails_Data_Response) {
  try {
    await redis.hset('sportbook_details', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache sportbook_details', e);
  }
}

async function cacheCacheSportbookDetailInfoAllData (geoPos: string, json_cache: Cache_Single_SportbookDetails_Data_Response[]) {
  try {
    await redis.hset('sportbook_details_all', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache sportbook_details', e);
  }
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
  await sportbookDetailsGenerationAll();
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

async function sportbookDetailsGenerationAll () {
  
	const response = await getSportbookDetails ();

  // [ℹ] individual sportbook persistance
  for (const geoSportbook of response.sportsbook_details) {

    let finalCacheObj: Cache_Single_SportbookDetails_Data_Response = {
      geoPos: undefined
    }

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

  // [ℹ] all sportbook persistance
  for (const geoSportbook of response.sportsbook_details) {

    const finalCacheObjList: Cache_Single_SportbookDetails_Data_Response[] = []

    let finalCacheObj: Cache_Single_SportbookDetails_Data_Response = {
      geoPos: undefined
    }

    finalCacheObj.geoPos = geoSportbook.lang

    // [ℹ] sportbook-details-info
    for (const [key, value] of Object.entries(geoSportbook.data)) {
      // [ℹ] based on key-value-pair;
      finalCacheObj = {
        ...value,
        geoPos: geoSportbook.lang
      }
      finalCacheObjList.push(finalCacheObj)
    }

    // [ℹ] persist-cache-response;
    await cacheCacheSportbookDetailInfoAllData(finalCacheObj.geoPos, finalCacheObjList)

  }

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
