// [ℹ] import $app `modules`
import { dev } from '$app/environment'
import type { Cache_Single_Homepage_SEO_Translation_Response, Cache_Single_Tournaments_Data_Page_Translation_Response, Cache_Single_Tournaments_SEO_Translation_Response } from '$lib/models/pages_and_seo/types';
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')
const format = require('xml-formatter');

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req, res): Promise< any > {

  const response_cache = await getAllSitemapURLS ()
  const sitemap_cache = await sitemapServe (response_cache)
  if (response_cache) {
    return {
      status: 200,
      body: sitemap_cache,
      headers: {
        'Content-Type': 'text/xml'
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

async function getAllSitemapURLS (): Promise < any | Record < string, never > > {
  try {
    const cached: string = await redis.hgetall('sitemap');
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