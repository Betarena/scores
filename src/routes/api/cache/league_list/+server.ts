
import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

import type { 
  REDIS_CACHE_SINGLE_league_list_geo_data_response, 
  REDIS_CACHE_SINGLE_league_list_seo_t_response 
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

  return json(null)    
}

/**
 * [ℹ] Featured Match CACHEING ACTIONS METHODS
*/

async function getCacheLeagueListForGeoPos (geoPos: string): Promise < REDIS_CACHE_SINGLE_league_list_geo_data_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('league_list_geo', geoPos);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_league_list_geo_data_response = JSON.parse(cached);
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ league_list_geo cache MISS", geoPos, e);
    return
  }
}

async function getLeagueListForLang (lang: string): Promise < REDIS_CACHE_SINGLE_league_list_seo_t_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('league_list_t', lang);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_league_list_seo_t_response = JSON.parse(cached);
      return parsed;
    }
    return
  } 
  catch (e) {
    console.debug("❌ league_list_t cache MISS", lang, e);
    return
  }
}