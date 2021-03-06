
// [ℹ] import $app `modules`;
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import type { Cache_Single_Lang_Featured_Match_Translation_Response, FixtureResponse } from "$lib/models/featured_match/interface-fixture"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise < unknown > {

  const geoPos: string = req.url['searchParams'].get('geoPos');
  const lang: string = req.url['searchParams'].get('lang');

  // [ℹ] widget data
  if (geoPos) {
    // [ℹ] check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheFeaturedMatchForGeoPos(geoPos)
    if (response_usergeo) {
      return {
        status: 200,
        body: response_usergeo
      }
    }

    // [ℹ] otherwise, return the "EN" version - default;
    const response_en = await getCacheFeaturedMatchForGeoPos('en')
    if (response_en) {
      return {
        status: 200,
        body: response_en
      }
    }

    // [ℹ] otherwise, there is NO MATCHES available;
    return {
      status: 200,
      body: null
    }
  }
  
  // [ℹ] translation (also SEO)
  if (lang) {
    const response_cache = await getCacheFeaturedMatchForLang(lang)
    if (response_cache) {
      return {
        status: 200,
        body: response_cache
      }
    }
  }

  // [ℹ] should never happen;
  return {
    body: null
  }    
}

/**
 * [ℹ] Featured Match CACHEING ACTIONS METHODS
*/

async function getCacheFeaturedMatchForGeoPos(geoPos: string): Promise < FixtureResponse | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('featured_match_geo', geoPos);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: FixtureResponse = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ featured_match_geo cache HIT", geoPos);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ featured_match_geo cache MISS", geoPos, e);
    return
  }
}

async function getCacheFeaturedMatchForLang(lang: string): Promise < Cache_Single_Lang_Featured_Match_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('featured_match_t', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: Cache_Single_Lang_Featured_Match_Translation_Response = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ featured_match_t HIT", lang);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ featured_match_t cache MISS", lang, e);
    return
  }
}