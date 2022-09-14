
import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"
import type { 
  Cache_Single_Lang_Featured_Match_Translation_Response, 
  FixtureResponse 
} from "$lib/models/featured_match/interface-fixture"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET(req, res): Promise < unknown > {

  const geoPos: string = req.url['searchParams'].get('geoPos');
  const lang: string = req.url['searchParams'].get('lang');

  // [ℹ] widget data
  if (geoPos) {
    // [ℹ] check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheFeaturedMatchForGeoPos(geoPos)
    if (response_usergeo) {
      return json(response_usergeo)
    }

    // [ℹ] otherwise, return the "EN" version - default;
    const response_en = await getCacheFeaturedMatchForGeoPos('en')
    if (response_en) {
      return json(response_en)
    }

    // [ℹ] otherwise, there is NO MATCHES available;
    return json(null)
  }
  
  // [ℹ] translation (also SEO)
  if (lang) {
    const response_cache = await getCacheFeaturedMatchForLang(lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [ℹ] should never happen;
  return json(null)
}

/**
 * [ℹ] Featured Match CACHEING ACTIONS METHODS
*/

async function getCacheFeaturedMatchForGeoPos(geoPos: string): Promise < FixtureResponse | Record < string, never > > {
  try {
    const cached: string = await redis.hget('featured_match_geo', geoPos);
    if (cached) {
      const parsed: FixtureResponse = JSON.parse(cached);
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
    const cached: string = await redis.hget('featured_match_t', lang);
    if (cached) {
      const parsed: Cache_Single_Lang_Featured_Match_Translation_Response = JSON.parse(cached);
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ featured_match_t cache MISS", lang, e);
    return
  }
}