// [ℹ] import $app `modules`
import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { error, json } from '@sveltejs/kit';

import type { 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response, 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response 
} from '$lib/models/tournaments/top_players/types';

const cacheDataAddr = "tour_fix_odds_data"
const cacheTransAddr = "tour_fix_odds_t"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET (req, res): Promise < unknown > {

  const lang: string = req.url['searchParams'].get('lang');
  const league_id: string = req.url['searchParams'].get('league_id');

  if (lang) {
    const response_cache = await getCacheTranslationData (lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (league_id) {
    const response_cache = await getCacheData (league_id)
    if (response_cache) {
      return json(response_cache)
    }
  }

  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheData (league_id: string): Promise < REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cacheDataAddr, league_id);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cacheDataAddr} cache error`, e);
    return
  }
}

async function getCacheTranslationData (lang: string): Promise < REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget(cacheTransAddr, lang);
    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${cacheTransAddr} cache error`, e);
    return
  }
}