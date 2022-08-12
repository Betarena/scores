// [ℹ] import $app `modules`
import { dev } from '$app/env'

import type { 
  Cache_Single_Tournaments_League_Standings_Info_Data_Response, 
  Cache_Single_Tournaments_League_Standings_Translation_Data_Response 
} from '$lib/models/tournaments/standings/types';

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise< any > {

  const lang: string = req.url['searchParams'].get('lang');
  const league_id: string = req.url['searchParams'].get('league_id');

  if (lang) {
    const response_cache = await getStandingsTranslation (lang)
    if (response_cache) {
      return {
        status: 200,
        body: response_cache
      }
    }
  }

  if (league_id) {
    const response_cache = await getStandingsData (league_id)
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

async function getStandingsData (league_id: string): Promise < Cache_Single_Tournaments_League_Standings_Info_Data_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_standings_data', league_id);

    if (cached) {
      // [🐛] debug;
      if (dev) console.info(`✅ tournament_standings_data cache data retrieved`);
      const parsed: Cache_Single_Tournaments_League_Standings_Info_Data_Response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_data cache error", e);
    return
  }
}

async function getStandingsTranslation (lang: string): Promise < Cache_Single_Tournaments_League_Standings_Translation_Data_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_standings_t', lang);

    if (cached) {
      // [🐛] debug;
      if (dev) console.info(`✅ tournament_standings_t cache data retrieved`);
      const parsed: Cache_Single_Tournaments_League_Standings_Translation_Data_Response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_t cache error", e);
    return
  }
}