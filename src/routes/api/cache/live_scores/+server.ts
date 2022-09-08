import {
  dev
} from '$app/environment';
import {
  error,
  json
} from '@sveltejs/kit';

import redis from "$lib/redis/init"

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(req: {
  url: {
    [x: string]: {
      get: (arg0: string) => string;
    };
  };
}, res: any): Promise < unknown > {

  const lang = req.url['searchParams'].get('lang');
  const type: 'translations' | 'geo' = req.url['searchParams'].get('type');

  if (lang) {
    const response_seo = await getLiveScoresFootball(lang)
    if (response_seo) {
      return json(response_seo)
    }
  }

  if (type == 'geo') {
    const response_usergeo = await getLiveScoresFootballLeagues()
    if (response_usergeo) {
      return json(response_usergeo)
    }
  }

  if (type == 'translations') {
    const response_translations = await getLiveScoresFootballTranslations()
    if (response_translations) {
      return json(response_translations)
    }
  }

  // ... should never happen;
  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getFeaturedMatchForGeoPosFromCache(geoPos)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLiveScoresFootballLeagues(): Promise < any | Record < string, never > > {
  try {
    const cached: string = await redis.get('live_scores_leagues');
    if (cached) {
      const parsed: any = JSON.parse(cached);
      if (dev) console.info(`Found seo - live_scores_leagues - in cache`);
      return parsed;
    }
  } catch (e) {
    console.debug("Unable to retrieve from cache", 'live_scores_leagues', e);
  }
  return
}

async function getLiveScoresFootball(
  lang: string
): Promise < LiveScore_SEO_Game_Scoped_Lang[] | Record < string, never > > {
  try {
    const cached: string = await redis.hget('live_scores', lang);
    if (cached) {
      const parsed: LiveScore_SEO_Game_Scoped_Lang[] = JSON.parse(cached);
      if (dev) console.info(`Found seo - live_scores - in cache`);
      return parsed;
    }
  } catch (e) {
    console.debug("Unable to retrieve from cache", 'live_scores', lang, e);
  }
  return
}

async function getLiveScoresFootballTranslations(): Promise < any | Record < string, never > > {
  try {
    const cached: string = await redis.get('live_scores_football_translations');
    if (cached) {
      const parsed: any = JSON.parse(cached);
      if (dev) console.info(`Found seo - live_scores_football_translations - in cache`);
      return parsed;
    }
  } catch (e) {
    console.debug("Unable to retrieve from cache", 'live_scores_football_translations', e);
  }
  return
}