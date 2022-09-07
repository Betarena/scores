
import { dev } from '$app/env'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

import type { 
  Cache_Single_Geo_LeagueList_Translation_Response, 
  Cache_Single_Lang_LeagueList_Translation_Response 
} from '$lib/models/league_list/types';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET(req: { url: { [x: string]: { get: (arg0: string) => string; }; }; }, res: any): Promise < unknown > {

  const geoPos: string = req.url['searchParams'].get('geoPos');
  const lang: string = req.url['searchParams'].get('lang');

  // [ℹ] widget data
  if (geoPos) {
    // [ℹ] check for cache-existance [IN THE USER-GEO-POS];
    const response_usergeo = await getCacheLeagueListForGeoPos (geoPos)
    if (response_usergeo) {
      return json(response_usergeo)
    }

    // [ℹ] otherwise, return the "EN" version - default;
    const response_en = await getCacheLeagueListForGeoPos ('en')
    if (response_en) {
      return json(response_en)
    }

    // [ℹ] otherwise, there is NO MATCHES available;
    return json(null)
  }
  
  // [ℹ] translation (also SEO)
  if (lang) {
    const response_cache = await getLeagueListForLang (lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  throw error(400, 'error');    
}

/**
 * [ℹ] Featured Match CACHEING ACTIONS METHODS
*/

async function getCacheLeagueListForGeoPos (geoPos: string): Promise < Cache_Single_Geo_LeagueList_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('league_list_geo', geoPos);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: Cache_Single_Geo_LeagueList_Translation_Response = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ league_list_geo cache HIT", geoPos);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ league_list_geo cache MISS", geoPos, e);
    return
  }
}

async function getLeagueListForLang (lang: string): Promise < Cache_Single_Lang_LeagueList_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('league_list_t', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from `string` to `JSON`
      const parsed: Cache_Single_Lang_LeagueList_Translation_Response = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info("✅ league_list_t cache HIT", lang);
      // [ℹ] return, cached data;
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ league_list_t cache MISS", lang, e);
    return
  }
}