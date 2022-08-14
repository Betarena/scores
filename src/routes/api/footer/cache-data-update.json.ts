// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_FOOTER_DATA } from '$lib/graphql/query';
import type { Cache_Single_Lang_Footer_Translation_Response, Hasura_Footer_Translation_Response } from '$lib/models/footer/types';

// [❗] critical
import Bull from 'bull';
const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueFooter = new Bull('cacheQueueFooter', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    }
  }, 
  settings
);
const cacheTarget = "REDIS CACHE | league_list"
let logs = []

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`ℹ FRONTEND_SCORES_REDIS_footer_trigerred at: ${new Date().toDateString()}`)

  // [ℹ] producers [JOBS]
  const job = await cacheQueueFooter.add({});

  return {
    status: 200,
    body: { 
      job_id: job.id,
      message: '✅ Success \nfooter cache data updated!'
    }
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
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

  /* 
  do stuff
  */

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

  done();
});