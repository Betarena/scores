
// [ℹ] import $app `modules`;
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import { GET_COMPLETE_PAGES_SEO_DATA } from '$lib/graphql/page_seo/query'
import type { Hasura_Complete_Pages_SEO } from '$lib/models/page_seo/types'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
  // [ℹ] get all of the LEAGUE LIST DATA from HASURA;
  const response = await main()
  // [ℹ] cache;
  cacheHomepageSEOData(response)
  // [ℹ] return RESPONSE;
  if (response) {
    return {
      status: 200,
      body: '✅ Success! League list SEO cache data has been updated!'
    }
  }
  // [ℹ] should never happen;
  return {
    body: null
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheLeagueListSEO(json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheHomepageSEOData(json_cache: Hasura_Complete_Pages_SEO) {
  // [ℹ] TRY;
  try {
    //[ℹ] store (cache) league_list response,
    await redis.hset('seo', 'pages', JSON.stringify(json_cache));
  } 
  // [ℹ] CATCH, ERROR;
  catch (e) {
    console.debug('❌ unable to cache - seo / page_homepage', e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - getAllHomepageSEOtData()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Hasura_Complete_Pages_SEO > {
  const response = await getAllHomepageSEOData()
  return response
}

async function getAllHomepageSEOData(): Promise < Hasura_Complete_Pages_SEO > {
  // [ℹ] push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_COMPLETE_PAGES_SEO_DATA)
  // [ℹ] reutrn response;
  return response
}