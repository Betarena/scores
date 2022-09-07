
import { dev } from '$app/env'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

import type { 
  All_SportBook_Details_Data, 
  Cache_Single_Lang_Featured_Betting_Site_Translation_Response 
} from '$lib/models/featured_betting_sites/firebase-real-db-interface';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET(req: { url: { [x: string]: { get: (arg0: string) => string; }; }; }, res: any): Promise < unknown > {

  const geoPos: string = req.url['searchParams'].get('geoPos');
  const lang: string = req.url['searchParams'].get('lang');

  // [ℹ] widget data
  if (geoPos) {
    // [ℹ] check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheFeaturedBettingSiteForGeoPos(geoPos)
    if (response_usergeo) {
      return json(response_usergeo)
    }

    // [ℹ] otherwise, return the "EN" version - default;
    const response_en = await getCacheFeaturedBettingSiteForGeoPos('en')
    if (response_en) {
      return json(response_en)
    }

    // [ℹ] otherwise, there is NO MATCHES available;
    return json(null)
  }
  
  // [ℹ] translation (also SEO)
  if (lang) {
    const response_cache = await getCacheFeaturedBettingSiteForLang(lang)
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

async function getCacheFeaturedBettingSiteForGeoPos (geoPos: string): Promise < All_SportBook_Details_Data | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('featured_betting_sites_geo', geoPos);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: All_SportBook_Details_Data = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ featured_betting_sites_geo cache HIT", geoPos);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ featured_betting_sites_geo cache MISS", geoPos, e);
    return
  }
}

async function getCacheFeaturedBettingSiteForLang (lang: string): Promise < Cache_Single_Lang_Featured_Betting_Site_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('featured_betting_sites_t', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: Cache_Single_Lang_Featured_Betting_Site_Translation_Response = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ featured_betting_sites_t cache HIT", lang);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ featured_betting_sites_t cache MISS", lang, e);
    return
  }
}