import { dev } from '$app/environment'

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_HREFLANG_DATA } from '$lib/graphql/query';
import { REDIS_CACHE_HOMEAPGE_SEO_BLOCK } from '$lib/graphql/home/seo_block/query';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_seo_block_query, 
  Cache_Single_Homepage_SEO_Block_Translation_Response 
} from '$lib/models/home/seo_block/types';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueSeoBlock = new Bull (
  'cacheQueueSeoBlock', 
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
const cacheQueueProcessName = "cacheQueueSeoBlock"
const cacheTarget = "REDIS CACHE | seo_block"
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
    const job = await cacheQueueSeoBlock.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheSEOblock(lang: string, json_cache: Cache_Single_Homepage_SEO_Block_Translation_Response) {
  try {
    await redis.hset('seo_block_t', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error("❌ unable to cache", 'navbar-data', e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueSeoBlock.process (async (job, done) => {
  // console.log(job.data.argumentList);

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

async function main() {

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)
  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 
  // [ℹ] push "EN"
  langArray.push('en')

  // [🐛] debug
  if (dev) console.debug("langArray", langArray)

  const finalCacheObj: Cache_Single_Homepage_SEO_Block_Translation_Response = {
    lang: undefined,
    html: undefined,
    title: undefined,
  }

  const response_data: BETARENA_HASURA_seo_block_query = await initGrapQLClient().request(
    REDIS_CACHE_HOMEAPGE_SEO_BLOCK
  )

  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_;
    finalCacheObj.html = response_data.scores_seo_block_homepage.find(( { lang } ) => lang_ === lang).html;
    finalCacheObj.title = response_data.scores_seo_block_homepage.find(( { lang } ) => lang_ === lang).title;

    await cacheSEOblock(lang_, finalCacheObj);
  }

  return;
}