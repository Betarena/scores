// [ℹ] import $app `modules`
import { dev } from '$app/env'
import type { Cache_Single_Homepage_SEO_Translation_Response, Cache_Single_Tournaments_Data_Page_Translation_Response, Cache_Single_Tournaments_SEO_Translation_Response } from '$lib/models/pages_and_seo/types';
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise< any > {

  const url: string = req.url['searchParams'].get('url');
  const lang: string = req.url['searchParams'].get('lang');
  const page: string = req.url['searchParams'].get('page');

  if (lang && page === 'homepage') {
    const response_cache = await getCacheHomepageSEOData(lang)
    if (response_cache) {
      return {
        status: 200,
        body: response_cache
      }
    }
  }

  if (url && page === 'tournaments') {
    const response_cache = await getCacheTournamentPageData(url)
    if (response_cache) {
      return {
        status: 200,
        body: response_cache
      }
    }
  }

  if (url && !page && !lang) {
    const response_cache = await getCacheSitemapURL(url)
    if (response_cache) {
      return {
        status: 200,
        body: response_cache
      }
    }
  }

  if (lang && page === 'tournaments') {
    const response_cache = await getCacheTournamentSEOData(lang)
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

async function getCacheHomepageSEOData (lang: string): Promise < Cache_Single_Homepage_SEO_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('homepage_seo', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: any = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ homepage_seo cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! homepage_seo cache error", e);
    return
  }
}

async function getCacheTournamentSEOData (lang: string): Promise < Cache_Single_Tournaments_SEO_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('tournaments_seo', lang);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: any = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ tournaments_seo cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournaments_seo cache error", e);
    return
  }
}

async function getCacheTournamentPageData (url: string): Promise < Cache_Single_Tournaments_Data_Page_Translation_Response | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('tournaments_page_info', url);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: any = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ tournaments_page_info cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournaments_page_info cache error", e);
    return
  }
}

async function getCacheSitemapURL (url: string): Promise < any | Record < string, never > > {
  try {
    // [ℹ] cached data retrival;
    const cached: string = await redis.hget('sitemap', url);
    // [ℹ] check for `cached` data
    if (cached) {
      // [ℹ] convert the data from its "string" to "JSON";
      const parsed: any = JSON.parse(cached);
      // [🐛] debug;
      if (dev) console.info(`✅ sitemap cache data`);
      // [ℹ] return, cached data;
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! sitemap cache error", e);
    return
  }
}