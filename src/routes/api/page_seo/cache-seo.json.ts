// [ℹ] import $app `modules`;
import { dev } from '$app/env';
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_Pages_SEO } from '$lib/models/page_seo/types';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
*/

export async function get(): Promise < any > {

  // [ℹ] check for cache-existance [IN THE USER-GEO-POS];
  const response_usergeo = await getCacheHomepageSEODataResponse()

  // [ℹ] return RESPONSE;
  if (response_usergeo) {
    return {
      body: response_usergeo
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
// - getCacheLeagueListSEOResponse(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheHomepageSEODataResponse(): Promise < Hasura_Complete_Pages_SEO | Record < string, never > > {
  // [ℹ] TRY;
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('seo', 'pages');
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: Hasura_Complete_Pages_SEO = JSON.parse(cached);
      // [🐛] debug
      if (dev) console.info("✅ Found seo - League List - in cache");
      // [ℹ] return, cached data
      return parsed;
    }
  } 
  // [ℹ] CATCH, ERROR;
  catch (e) {
    console.debug("❌ Unable to retrieve from cache", 'seo', 'pages', e);
  }
  return
}