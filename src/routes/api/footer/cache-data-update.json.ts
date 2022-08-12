// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_FOOTER_DATA } from '$lib/graphql/query';
import type { Cache_Single_Lang_Footer_Translation_Response, Hasura_Footer_Translation_Response } from '$lib/models/footer/types';

// [❗] critical
import Bull from 'bull';
const cacheQueueFooter = new Bull('cacheQueueFooter', import.meta.env.VITE_REDIS_CONNECTION_URL.toString())

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`ℹ FRONTEND_SCORES_REDIS_footer_trigerred at: ${new Date().toDateString()}`)

  // [ℹ] producers [JOBS]
  const job = await cacheQueueFooter.add();

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
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  // [🐛] debug
  if (dev) console.debug("langArray", langArray)

  const finalCacheObj: Cache_Single_Lang_Footer_Translation_Response = {
    lang: undefined,
    scores_footer_translations: undefined,
    scores_footer_links: undefined,
  }

  // deleteCacheFooter()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_;
    finalCacheObj.scores_footer_translations = response.scores_footer_translations.find(( { lang } ) => lang_ === lang);
    finalCacheObj.scores_footer_links = response.scores_footer_links.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheFooter(lang_, finalCacheObj);
  }

  done();
});