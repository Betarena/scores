// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_NAVBAR_DATA } from '$lib/graphql/header/query';
import type { Cache_Single_Lang_Header_Translation_Response, Hasura_Header_Translation_Response } from '$lib/models/navbar/types';

// [❗] critical
import Bull from 'bull';
const cacheQueueNavbar = new Bull('cacheQueueNavbar', import.meta.env.VITE_REDIS_CONNECTION_URL.toString())

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`ℹ FRONTEND_SCORES_REDIS_navbar_trigerred at: ${new Date().toDateString()}`)

  // [ℹ] producers [JOBS]
  const job = await cacheQueueNavbar.add();

  return {
    status: 200,
    body: { 
      job_id: job.id,
      message: '✅ Success \nnavbar/header cache data updated!'
    }
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheNavBar(lang: string, json_cache: Cache_Single_Lang_Header_Translation_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('navbar_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ navbar-data cached')
  } 
  catch (e) {
    console.error("❌ unable to cache", 'navbar-data', e);
  }
}

async function deleteCacheNavBar() {
  await redis.del('navbar_t')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueNavbar.process (async (job, done) => {
  // console.log(job.data.argumentList);

  /* 
  do stuff
  */

	// [ℹ] get HASURA-DB response;
	const response: Hasura_Header_Translation_Response = await initGrapQLClient().request(GET_NAVBAR_DATA);

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  // [🐛] debug
  if (dev) console.debug("langArray", langArray)

  const finalCacheObj: Cache_Single_Lang_Header_Translation_Response = {
    lang: undefined,
    langArray: [],
    scores_header_fixtures_information: undefined,
    scores_header_links_dev: undefined,
    scores_header_translations_dev: undefined,
    scores_top_bar_messages_dev: undefined
  }

  deleteCacheNavBar()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_;

    finalCacheObj.scores_header_fixtures_information = response.scores_header_fixtures_information.find(( { lang } ) => lang_ === lang);  // [ℹ] single bottom-row-header-info
    finalCacheObj.scores_header_links_dev = response.scores_header_links_dev.find(( { lang } ) => lang_ === lang);                        // [ℹ] single lang-translated-links-terms
    finalCacheObj.scores_header_translations_dev = response.scores_header_translations_dev.find(( { lang } ) => lang_ === lang);          // [ℹ] single-translated-LANG-terms
    finalCacheObj.scores_top_bar_messages_dev = response.scores_top_bar_messages_dev.find(( { lang } ) => lang_ === lang);                // [ℹ] platform-top-ALERT-system
    finalCacheObj.langArray = langArray;  // [ℹ] languages available for PLATFORM

    // [ℹ] persist-cache-response;
    await cacheNavBar(lang_, finalCacheObj);
  }

  return "done";
});