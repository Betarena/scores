import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

const cache_sitemap_urls_key      = "sitemap"
const cache_homepage_seo_key      = "homepage_seo"
const cache_tournaments_seo_key   = "tournaments_seo"
const cache_tournaments_info_key  = "tournaments_page_info"
const cache_fixtures_seo_key      = "fixtures_seo"
const cache_fixtures_info_key     = "fixtures_page_info"

/** @type {import('./$types').RequestHandler} */
export async function GET (req, res): Promise < any > {

  const url:  string = req.url['searchParams'].get('url');
  const lang: string = req.url['searchParams'].get('lang');
  const page: 'homepage' | 'tournaments' | 'fixtures' = req.url['searchParams'].get('page');

  // [sitemap-check V2]
  if (url && !page && !lang) {
    const response_cache = 
      await get_target_set_cache_data (
        cache_sitemap_urls_key,
        url
    );
    if (response_cache == 1) {
      return json(response_cache)
    }
    return json(null);
  }

  // [home-page-SEO-GET]
  if (lang && page === 'homepage') {
    const response_cache = 
      await get_target_hset_cache_data (
        cache_homepage_seo_key,
        lang
    );
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [tournament-page-INFO-GET]
  if (url && page === 'tournaments') {
    const response_cache = 
      await get_target_hset_cache_data (
        cache_tournaments_info_key,
        url
    );
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [tournament-page-SEO-GET]
  if (lang && page === 'tournaments') {
    const response_cache = 
      await get_target_hset_cache_data (
        cache_tournaments_seo_key,
        lang
    );
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [fixture-page-INFO-GET]
  if (url && page === 'fixtures') {
    const response_cache = 
      await get_target_hset_cache_data (
        cache_fixtures_info_key,
        url
    );
    if (response_cache) {
      return json(response_cache)
    }
  }

  // [fixture-page-SEO-GET]
  if (lang && page === 'fixtures') {
    const response_cache = 
      await get_target_hset_cache_data (
        cache_fixtures_seo_key,
        lang
    );
    if (response_cache) {
      return json(response_cache)
    }
  }

  return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHE [GET] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_hset_cache_data (
  key: string,
  id:  string
): Promise < unknown > {
  try {
    const cached: string = await redis.hget(key, id);
    if (cached) {
      const parsed: unknown = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${key} cache error`, e);
    return
  }
}

async function get_target_set_cache_data (
  key: string,
  id:  string
): Promise < unknown > {
  try {
    const cached: number = await redis.sismember(key, id);
    console.log(id, cached)
    return cached;
  } 
  catch (e) {
    console.error(`❌ uh-oh! ${key} cache error`, e);
    return
  }
}