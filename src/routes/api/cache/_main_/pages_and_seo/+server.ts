import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import redis from "$lib/redis/init"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')
const format = require('xml-formatter');

import type { 
  Cache_Single_Homepage_SEO_Translation_Response, 
  Cache_Single_Tournaments_Data_Page_Translation_Response, 
  Cache_Single_Tournaments_SEO_Translation_Response 
} from '$lib/models/pages_and_seo/types';

/** @type {import('./$types').RequestHandler} */
export async function GET (req, res): Promise< any > {

  const url: string = req.url['searchParams'].get('url');
  const lang: string = req.url['searchParams'].get('lang');
  const page: 'homepage' | 'tournaments' | 'fixtures' = req.url['searchParams'].get('page');
  const sitemap: string = req.url['searchParams'].get('sitemap'); // [ℹ] can be whatever

  if (sitemap && !url && !page && !lang) {
    const response_cache = await getAllSitemapURLS ()
    const sitemap_cache = await sitemapServe (response_cache)
  }

  if (lang && page === 'homepage') {
    const response_cache = await getCacheHomepageSEOData(lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (url && page === 'tournaments') {
    const response_cache = await getCacheTournamentPageData(url)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (url && !page && !lang) {
    const response_cache = await getCacheSitemapURL(url)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (lang && page === 'tournaments') {
    const response_cache = await getCacheTournamentSEOData(lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (url && page === 'fixtures') {
    const response_cache = await get_cache_fixtures_info(url)
    if (response_cache) {
      return json(response_cache)
    }
  }

  if (lang && page === 'fixtures') {
    const response_cache = await get_cache_fixtures_seo(lang)
    if (response_cache) {
      return json(response_cache)
    }
  }

  return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getCacheHomepageSEOData (lang: string): Promise < Cache_Single_Homepage_SEO_Translation_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('homepage_seo', lang);
    if (cached) {
      const parsed: any = JSON.parse(cached);
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
    const cached: string = await redis.hget('tournaments_seo', lang);
    if (cached) {
      const parsed: any = JSON.parse(cached);
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
    const cached: string = await redis.hget('tournaments_page_info', url);
    if (cached) {
      const parsed: any = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournaments_page_info cache error", e);
    return
  }
}

async function get_cache_fixtures_seo (url: string): Promise < any | Record < string, never > > {
  try {
    const cached: string = await redis.hget('fixtures_seo', url);
    if (cached) {
      const parsed: any = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! fixtures_seo cache error", e);
    return
  }
}

async function get_cache_fixtures_info (url: string): Promise < any | Record < string, never > > {
  try {
    const cached: string = await redis.hget('fixtures_page_info', url);
    if (cached) {
      const parsed: any = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! cache_fixtures_page_info cache error", e);
    return
  }
}

async function getCacheSitemapURL (url: string): Promise < any | Record < string, never > > {
  try {
    const cached: string = await redis.hget('sitemap', url);
    if (cached) {
      const parsed: any = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! sitemap cache error", e);
    return
  }
}

async function getAllSitemapURLS (): Promise < any | Record < string, never > > {
  try {
    const cached: any = await redis.hgetall('sitemap');
    if (cached) {
      const parsed: any = cached; // [ℹ] already in JSON format
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! sitemap cache error", e);
    return
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  OTHER API METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function sitemapServe (urObj: Record <string, unknown> ) {

  const uniqArray = []
  
  for (const [key, value] of Object.entries(urObj)) {
    if (value == "true") {
      uniqArray.push(key);
    }
  }

  const urlSitemapObjArr: {
    url: string
    changefreq: 'daily'
    priority: number
  }[] = []

  for (const url of uniqArray) {
    urlSitemapObjArr.push({
      url: url,
      changefreq: 'daily',
      priority: 0.3
    })
  }

  // [ℹ] create a stream to write to
  const stream = new SitemapStream({ 
    hostname: 'https://scores.betarena.com/' 
  })

  // [ℹ] return a promise that resolves with your XML string
  const sitemapData = await streamToPromise(Readable.from(urlSitemapObjArr).pipe(stream)).then((data) =>
    data.toString()
  )

  const formattedXml = format(sitemapData);

  // [ℹ] return sitemap.xml;
  return formattedXml
}