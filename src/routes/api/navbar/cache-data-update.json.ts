// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_NAVBAR_DATA } from '$lib/graphql/header/query';
import type { Cache_Single_Lang_Header_Translation_Response, Hasura_Header_Translation_Response } from '$lib/models/navbar/types';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function post(): Promise< any > {
  
	// [ℹ] get HASURA-DB response;
	const response: Hasura_Header_Translation_Response = await initGrapQLClient().request(GET_NAVBAR_DATA);

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
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
    scores_header_links: undefined,
    scores_header_translations: undefined,
    scores_top_bar_messages: undefined
  }

  deleteCacheNavBar()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_;

    finalCacheObj.scores_header_fixtures_information = response.scores_header_fixtures_information.find(( { lang } ) => lang_ === lang);  // [ℹ] single bottom-row-header-info
    finalCacheObj.scores_header_links = response.scores_header_links.find(( { lang } ) => lang_ === lang);                        // [ℹ] single lang-translated-links-terms
    finalCacheObj.scores_header_translations = response.scores_header_translations.find(( { lang } ) => lang_ === lang);          // [ℹ] single-translated-LANG-terms
    finalCacheObj.scores_top_bar_messages = response.scores_top_bar_messages.find(( { lang } ) => lang_ === lang);                // [ℹ] platform-top-ALERT-system
    finalCacheObj.langArray = langArray;  // [ℹ] languages available for PLATFORM

    // [ℹ] persist-cache-response;
    await cacheNavBar(lang_, finalCacheObj);
  }

	// [ℹ] return, RESPONSE;
	return {
    status: 200,
    body: '✅ Success \nnavbar/header cache data updated!'
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheNavBar(lang, json_cache)
// - deleteCacheNavBar()
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