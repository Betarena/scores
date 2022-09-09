import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_FOOTER_DATA } from '$lib/graphql/query';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  Cache_Single_Lang_Footer_Translation_Response, 
  Hasura_Footer_Translation_Response 
} from '$lib/models/footer/types';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueFooter = new Bull (
  'cacheQueueFooter', 
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
const cacheQueueProcessName = "cacheQueueFooter"
const cacheTarget = "REDIS CACHE | footer"
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
    const job = await cacheQueueFooter.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheFooter(lang: string, json_cache: Cache_Single_Lang_Footer_Translation_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('footer_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ footer-data cached')
  } 
  catch (e) {
    console.error("❌ unable to cache", 'footer-data', e);
  }
}

async function deleteCacheFooter() {
  await redis.del('footer_t')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueFooter.process (async (job, done) => {
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

  // [ℹ] get HASURA-DB response;
	const response: Hasura_Footer_Translation_Response = await initGrapQLClient().request(GET_FOOTER_DATA);

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  // [🐛] debug
  if (dev) console.debug("langArray", langArray)

  const finalCacheObj: Cache_Single_Lang_Footer_Translation_Response = {
    lang: undefined,
    scores_footer_translations_dev: undefined,
    scores_footer_links_dev: undefined,
  }

  // deleteCacheFooter()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_;
    finalCacheObj.scores_footer_translations_dev = response.scores_footer_translations_dev.find(( { lang } ) => lang_ === lang);
    finalCacheObj.scores_footer_links_dev = response.scores_footer_links_dev.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheFooter(lang_, finalCacheObj);
  }

  return;
}