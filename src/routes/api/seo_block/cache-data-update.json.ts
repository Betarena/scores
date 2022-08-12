// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import { GET_HREFLANG_DATA } from '$lib/graphql/query';
import { GET_COMPLETE_PAGES_AND_SEO_DATA } from '$lib/graphql/pages_and_seo/query';

import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from '$lib/models/seo_block/types';
import type { Hasura_Complete_Pages_SEO } from '$lib/models/pages_and_seo/types';

import { performance } from 'perf_hooks';

// [❗] critical
import Bull from 'bull';
const cacheQueueSeoBlock = new Bull('cacheQueueSeoBlock', import.meta.env.VITE_REDIS_CONNECTION_URL.toString())

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise< any > {

  // [🐛] debug
  if (dev) console.log(`ℹ FRONTEND_SCORES_REDIS_seo_block_trigerred at: ${new Date().toDateString()}`)

  // [ℹ] producers [JOBS]
  const job = await cacheQueueSeoBlock.add();

  return {
    status: 200,
    body: { 
      job_id: job.id,
      message: '✅ Success \nSEO_Block cache data updated!'
    }
  }

}

/**
 * [ℹ] SEO Block CACHEING ACTIONS METHODS
*/

async function cacheSEOblock(lang: string, json_cache: Cache_Single_Homepage_SEO_Block_Translation_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('seo_block_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ navbar-data cached')
  } 
  catch (e) {
    console.error("❌ unable to cache", 'navbar-data', e);
  }
}

async function deleteSEOblock() {
  await redis.del('seo_block_t')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueSeoBlock.process (async (job, done) => {
  // console.log(job.data.argumentList);

  /* 
  do stuff
  */

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
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

  // deleteSEOblock()

  const response_data: Hasura_Complete_Pages_SEO = await initGrapQLClient().request(GET_COMPLETE_PAGES_AND_SEO_DATA)

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_;

    finalCacheObj.html = response_data.scores_seo_block_homepage_dev.find(( { lang } ) => lang_ === lang).html;
    finalCacheObj.title = response_data.scores_seo_block_homepage_dev.find(( { lang } ) => lang_ === lang).title;

    // [ℹ] persist-cache-response;
    await cacheSEOblock(lang_, finalCacheObj);
  }

  return "done";
});