import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/footer/types';

/** @type {import('./$types').RequestHandler} */
export async function GET(req, res): Promise< any > {

  const lang: string = req.url['searchParams'].get('lang');

  const response_cache = await getCache (lang)

  if (response_cache) {
    return json(response_cache)
  }

  return json(null)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCache (lang: string): Promise < Cache_Single_Lang_Footer_Translation_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('footer_t', lang);

    if (cached) {
      const parsed: any = JSON.parse(cached);
      if (dev) console.info(`✅ footer_t cache data`);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! footer_t cache error", e);
    return
  }
}