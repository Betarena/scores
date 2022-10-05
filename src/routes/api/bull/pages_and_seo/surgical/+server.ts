import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import { removeDiacritics } from '$lib/utils/languages'
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { SitemapStream, streamToPromise, simpleSitemapAndIndex, SitemapIndexStream } = require('sitemap');
const { Readable } = require('stream')
const format = require('xml-formatter');
const { createGzip } = require('zlib');

import { 
  REDIS_CACHE_PAGES_AND_SEO 
} from '$lib/graphql/pages_and_seo/query'

import type { 
  Cache_Single_Homepage_SEO_Translation_Response, 
  Cache_Single_Tournaments_Data_Page_Translation_Response, 
  Cache_Single_Tournaments_SEO_Translation_Response, 
  BETARENA_HASURA_QUERY_pages_and_seo, 
  REDIS_CACHE_SINGLE_fixtures_seo_response,
  REDIS_CACHE_SINGLE_fixtures_page_info_response
} from '$lib/models/pages_and_seo/types'

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueuePageSeo = new Bull (
  'cacheQueuePageSeo', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    },
    settings: settings
  }
);
const cacheQueueProcessName = "cacheQueuePageSeo"
const cacheTarget = "REDIS CACHE | pages & seo"
let logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST (
  { request }
): Promise < unknown > {

  const body = await request.json();
  if (dev) console.log(body);
  const dataSurgical = JSON.parse(JSON.stringify(body));

  console.log("dataSurgical", dataSurgical)

  // "payload": {
  //   "data": {
  //     "id": 18457751,
  //     "publish_status": "string"
  //     "urls": {
  //       "br": "https://scores.betarena.com/br/futebol/atk-mohun-bagan-odisha-fc-18457751",
  //       "en": "https://scores.betarena.com/football/atk-mohun-bagan-odisha-fc-18457751",
  //       "es": "https://scores.betarena.com/es/futbol/atk-mohun-bagan-odisha-fc-18457751",
  //       "it": "https://scores.betarena.com/it/calcio/atk-mohun-bagan-odisha-fc-18457751",
  //       "pt": "https://scores.betarena.com/pt/futebol/atk-mohun-bagan-odisha-fc-18457751",
  //       "ro": "https://scores.betarena.com/ro/fotbal/atk-mohun-bagan-odisha-fc-18457751",
  //       "se": "https://scores.betarena.com/se/fotboll/atk-mohun-bagan-odisha-fc-18457751"
  //     }
  //   },
  //   "table": {
  //     "name": "historic_fixtures",
  //     "schema": "public"
  //   }

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    await main(dataSurgical)

    for (const log of logs) {
      console.log(log)
    }

    console.log("done!")

    return json({
      job_id: cacheTarget + " done!"
    })
  }
  // [ℹ] otherwise prod.
  else {
    // [ℹ] producers [JOBS]
    const job = await cacheQueuePageSeo.add(dataSurgical, { timeout: 120000 });
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_sitemap_url (
  url: string
) {
  try {
    //[ℹ] store (cache) league_list response,
    await redis.hset('sitemap', url, true);
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / sitemap', e);
  }
}

async function cache_fixtures_page_info (
  url: string, 
  json_cache: any
) {
  try {
    await redis.hset('fixtures_page_info', url, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / tournaments page', e);
  }
}

async function del_target_sitemap_url (
  url: string
) {
  await redis.hdel('fixtures_page_info', url)
  return
}

async function del_target_fixture_page_url (
  url: string
) {
  await redis.hdel('tournaments_page_info', url)
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueuePageSeo.process (async function (job, done) {
  // console.log(job.data.argumentList);
  console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  // await main(job.data)
  const t1 = performance.now();

  if (dev) console.log(`
    ${cacheTarget} updated!
    completed in: ${(t1 - t0) / 1000} sec
  `)

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

interface Links {
  url:    string
  links:  Alt_Links[]
} interface Alt_Links {
  lang: string
  url:  string
}

async function main(
  data
) {

  // [ℹ] get HASURA-DB response;
  // const response: BETARENA_HASURA_QUERY_pages_and_seo = await initGrapQLClient().request(
  //   REDIS_CACHE_PAGES_AND_SEO_FIXTURE_TARGET
  // )

  // // [ℹ] get-all-exisitng-lang-translations;
  // const langArray: string [] = response.scores_hreflang
  // .filter(a => a.link)         /* filter for NOT "null" */
  // .map(a => a.link)            /* map each LANG */ 
  // langArray.push('en')
  
  // // [ℹ] platform
  // await sitemap_generation(response)
  // // [ℹ] fixtures-pages
  // await fixtures_page_generation(response)
}

async function sitemap_generation(
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG - URL]
  // [ℹ] no-cache-deletion-required
  // [ℹ] TTL of 24h [?]

  let urlsArray: Links[] = []

  // [ℹ] use fixtures urls to generate
  // [ℹ] additional URL combninations
  const fixtures_links = new Map <number, Links> ()
  for (const iterator of data.historic_fixtures) {

    // [ℹ] [depreceated] domestic ONLY check
    // [ℹ] [new] published ONLY check - 14/09/2022
    if (
      iterator.publish_status == "draft" || 
      iterator.urls == undefined
    ) {
      continue
    }

    const fixture_id = iterator?.id;

    for (let [key, value] of Object.entries(iterator.urls)) {
      value = value.replace('https://scores.betarena.com', '');
      if (fixtures_links.has(fixture_id)) {
        const existing_links = fixtures_links.get(fixture_id)
        // [ℹ] EN is main
        if (key == 'en') {
          existing_links.url = value
        }
        const link: Alt_Links = {
          url: value,
          lang: key
        }
        existing_links.links.push(link)
        fixtures_links.set(fixture_id, existing_links)
      }
      else {
        const link: Alt_Links = {
          lang: key,
          url: value
        }
        const links_: Links = {
          url:    undefined,
          links:  []
        }
        links_.links.push(link)
        // [ℹ] EN is main
        if (key == 'en') {
          links_.url = value
        }
        fixtures_links.set(fixture_id, links_)
      }
    }
  }

  urlsArray = [
    ...urlsArray,
    ...Array.from(fixtures_links.values())
  ]

  if (dev) console.log(`fixtures_links size: ${fixtures_links.size}`)
  if (dev) console.log(`urlsArray length: ${urlsArray.length}`)

  let cache_unique_arr = []
  for (const urls of urlsArray) {
    for (const links of urls.links) {
      cache_unique_arr.push(links?.url)
    }
  }
  cache_unique_arr = [...new Set(cache_unique_arr)];

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(cache_unique_arr, null, 4)
    fs.writeFile(`./datalog/cache_unique_arr.json`, data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  await sitemapSave(cache_unique_arr)

  for (const url of cache_unique_arr) {
    cache_sitemap_url(url)
  }
}

async function fixtures_page_generation(
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG - URL]
  // [ℹ] no-cache-deletion-required

  for (const iterator of data.historic_fixtures) {

    // [ℹ] [depreceated] domestic ONLY check
    // [ℹ] [new] published ONLY check - 14/09/2022
    if (
      iterator?.publish_status == "draft" || 
      iterator?.urls == undefined
    ) {
      continue
    }

    // [ℹ] /{sport}/{fixture}
    // [ℹ] /{lang}/{sport}/{fixture}

    const fixture_id = iterator?.id;
    const tournament_id = iterator?.league_id;
    const league_name = iterator?.league_name;

    for (const [key, value] of Object.entries(iterator.urls)) {

      const finalCacheObj: REDIS_CACHE_SINGLE_fixtures_page_info_response = {}

      const url_value = value.replace('https://scores.betarena.com', '');
      const lang_ = key

      const country =
        iterator?.country_id_j == undefined
          ? undefined
          : data?.scores_football_countries.find( ({ id }) => id == iterator?.country_id_j)?.name

      const country_t =
         country == undefined
          ? undefined
          : data?.scores_endpoints_translations.find( ({lang}) => lang == lang_)?.countries_translation[country]

      const sport =
        data?.scores_endpoints_translations.find( ({lang}) => lang == lang_)?.sports_translation['football']

      finalCacheObj.lang = lang_
      finalCacheObj.url = url_value
      finalCacheObj.data = {
        sport: sport,
        country: country_t,
        league_name: league_name,
        widgets: [],
        home_team_name: iterator?.home_team_name,
        away_team_name: iterator?.away_team_name,
        id: fixture_id,
        fixture_day: iterator?.fixture_day,
        venue_city: iterator?.venue_city_j,
        venue_name: iterator?.venue_name_j,
      }
      finalCacheObj.alternate_data = iterator?.urls
      
      await cache_fixtures_page_info(url_value, finalCacheObj);
    }

  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function sitemapSave(
  uniqArray: string[]
) {

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
  const sitemapData = await streamToPromise(
  Readable.from(urlSitemapObjArr).pipe(stream))
  .then((data) =>
    data.toString()
  )

  const formattedXml = format(sitemapData);

  // [ℹ] persist to sitemap.xml;
  fs.writeFile('./static/sitemap.xml', formattedXml, err => {
    if (err) {
      console.error(err);
    }
  });
  
}