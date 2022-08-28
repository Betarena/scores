// [ℹ] import $app `modules`
import { dev } from '$app/env'
import type { 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response, 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response 
} from '$lib/models/tournaments/top_players/types';

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise < unknown > {

  const lang: string = req.url['searchParams'].get('lang');
  const league_id: string = req.url['searchParams'].get('league_id');

  if (lang) {
    const response_cache = await getTopPlayersDataTranslation (lang)
    if (response_cache) {
      return {
        status: 200,
        body: response_cache
      }
    }
  }

  if (league_id) {
    const response_cache = await getTopPlayersData (league_id)
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTopPlayersData (league_id: string): Promise < REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_top_players_data', league_id);
    if (cached) {
      // [🐛] debug;
      if (dev) console.info(`✅ tournament_top_players_data cache data retrieved`);
      const parsed: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_data cache error", e);
    return
  }
}

async function getTopPlayersDataTranslation (lang: string): Promise < REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_top_player_t', lang);
    if (cached) {
      // [🐛] debug;
      if (dev) console.info(`✅ tournament_top_player_t cache data retrieved`);
      const parsed: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_t cache error", e);
    return
  }
}