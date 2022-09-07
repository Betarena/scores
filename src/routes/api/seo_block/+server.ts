// [ℹ] import $app `modules`
import { dev } from '$app/env'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

import type { 
  Cache_Single_Homepage_SEO_Block_Translation_Response 
} from '$lib/models/seo_block/types';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET(req: { url: { [x: string]: { get: (arg0: string) => string; }; }; }, res: any): Promise< unknown > {

  const lang: string = req.url['searchParams'].get('lang');

  const response_cache = await getCacheSEOblock (lang)

  if (response_cache) {
    return json(response_cache)
  }

  throw error(400, 'error');
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getCacheSEOblock ()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheSEOblock (lang: string): Promise < Cache_Single_Homepage_SEO_Block_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('seo_block_t', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: Cache_Single_Homepage_SEO_Block_Translation_Response = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ seo_block_t cache HIT", lang);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ seo_block_t cache MISS", lang, e);
    return
  }
}