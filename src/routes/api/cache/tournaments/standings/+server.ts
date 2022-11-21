import { dev } from '$app/environment'

import { error, json } from '@sveltejs/kit';

import type { 
  REDIS_CACHE_SINGLE_tournament_standings_data, 
  REDIS_CACHE_SINGLE_tournament_standings_translation 
} from '$lib/models/tournaments/standings/types';

import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET (req, res): Promise< any > {

  const lang: string = req.url['searchParams'].get('lang');
  const league_id: string = req.url['searchParams'].get('league_id');

  if (lang) {
    const response_cache = await getStandingsTranslation (lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (league_id) {
    const response_cache = await getStandingsData (league_id)
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [ℹ] should never happen;
  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getStandingsData (league_id: string): Promise < REDIS_CACHE_SINGLE_tournament_standings_data | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_standings_data', league_id);

    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_tournament_standings_data = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_data cache error", e);
    return
  }
}

async function getStandingsTranslation (lang: string): Promise < REDIS_CACHE_SINGLE_tournament_standings_translation | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_standings_t', lang);

    if (cached) {
      const parsed: REDIS_CACHE_SINGLE_tournament_standings_translation = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_t cache error", e);
    return
  }
}