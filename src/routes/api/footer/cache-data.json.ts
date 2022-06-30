// [ℹ] import $app `modules`
import { dev } from '$app/env'
import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/footer/types';

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise< any > {

  const lang: string = req.url['searchParams'].get('lang');

  const response_cache = await getCacheFooter(lang)

  if (response_cache) {
    return {
      status: 200,
      body: response_cache
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
// - getCacheFooter()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheFooter(lang: string): Promise < Cache_Single_Lang_Footer_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('footer_t', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: any = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ footer_t cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! footer_t cache error", e);
    return
  }
}