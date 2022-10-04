import { dev } from '$app/environment'
import redis from "$lib/redis/init_dev"
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

export async function POST(): Promise < unknown > {

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    // [ℹ] get HASURA-DB response;
    const response: BETARENA_HASURA_QUERY_pages_and_seo = await initGrapQLClient().request(
      REDIS_CACHE_PAGES_AND_SEO
    )

    // [ℹ] get-all-exisitng-lang-translations;
    const langArray: string [] = response.scores_hreflang
      .filter(a => a.link)         /* filter for NOT "null" */
      .map(a => a.link)            /* map each LANG */ 
    // [ℹ] push "EN"
    langArray.push('en')
    
    // [ℹ] platform
    await sitemap_generation(response)
    // [ℹ] homepage
    // await homepage_seo(langArray, response)
    // [ℹ] tournaments-pages
    // await tournaments_page_generation(response)
    // await tournaments_page_seo(langArray, response)
    // [ℹ] fixtures-pages
    await fixtures_page_seo(langArray, response)
    await fixtures_page_generation(response)

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
    const job = await cacheQueuePageSeo.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheHomepageSEOData (
  lang: string, 
  json_cache: Cache_Single_Homepage_SEO_Translation_Response
) {
  try {
    //[ℹ] store (cache) league_list response,
    await redis.hset('homepage_seo', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / homepage', e);
  }
}

async function cacheTournamentsPageSEOData (
  lang: string, 
  json_cache: any
) {
  try {
    //[ℹ] store (cache) league_list response,
    await redis.hset('tournaments_page_seo', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / tournaments page', e);
  }
}

async function cache_fixtures_seo (
  lang: string, 
  json_cache: any
) {
  try {
    await redis.hset('fixtures_seo', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / tournaments page', e);
  }
}

async function cacheSitemapURLs (
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

async function cache_tournaments_page_info (
  url: string, 
  json_cache: any
) {
  try {
    //[ℹ] store (cache) league_list response,
    await redis.hset('tournaments_page_info', url, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / tournaments page', e);
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

async function deleteCacheTournamentsPageData () {
  await redis.del('tournaments_page_info')
  return
}

async function deleteCacheSitemapURLs () {
  await redis.del('sitemap')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueuePageSeo.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();

  // [ℹ] get HASURA-DB response;
	const response: BETARENA_HASURA_QUERY_pages_and_seo = await initGrapQLClient().request(
    REDIS_CACHE_PAGES_AND_SEO
  )

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')
  
  await sitemap_generation(response)
  await homepage_seo(langArray, response)
  await tournaments_page_seo(langArray, response)
  await tournaments_page_generation(response)

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

async function sitemap_generation(
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG - URL]
  // [ℹ] no-cache-deletion-required
  // [ℹ] TTL of 24h

  let urlsArray: Links[] = []

  const lang_links = new Map<string, Links>()
  const sport_links = new Map<string, Links>()
  const country_links = new Map<string, Links>()

  // [ℹ] use tournaments urls to generate
  // [ℹ] MAIN URL combninations
  for (const iterator of data.scores_endpoints_translations) {
    
    let url: string
    const lang_ = iterator?.lang
    const sport_ = iterator?.sport
    let sport_t = iterator?.sports_translation[sport_]
    sport_t = removeDiacritics(sport_t.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    /*
      [ℹ] /or /{lang}/
    */
    url = 
      lang_ == 'en'
        ? '/'
        : '/' + lang_
    ;
    if (lang_links.has('en')) {
      const existing_links = lang_links.get('en')
        // FIXME: precautionary validation
        // TODO: update backend "scores_tournaments"
        // TODO: to make single rows for each tournament
        // TODO: as URLS contain necesary translations
        // TODO: and make the ID unique in that case
        const lang_exists = existing_links.links.find( ({lang}) => lang === lang_)
        if (lang_exists) {
          continue;
        }
        // [ℹ] EN is main
        if (lang_ == 'en') {
          existing_links.url = url
        }
        const link: Alt_Links = {
          lang: lang_,
          url: url
        }
        existing_links.links.push(link)
        lang_links.set('en', existing_links)
    }
    else {
      const link: Alt_Links = {
        lang: lang_,
        url: url
      }
      const links_: Links = {
        url:    undefined,
        links:  []
      }
      links_.links.push(link)
      // [ℹ] EN is main
      if (lang_ == 'en') {
        links_.url = url
      }
      lang_links.set('en', links_)
    }

    /*
      [ℹ] sports generation
      [ℹ] /{sport} or /{lang}/{sport}
    */
    url = 
      lang_ == 'en'
        ? '/' + sport_t
        : '/' + lang_ + '/' + sport_t
    ;
    if (sport_links.has(sport_)) {
      const existing_links = sport_links.get(sport_)
        // FIXME: precautionary validation
        // TODO: update backend "scores_tournaments"
        // TODO: to make single rows for each tournament
        // TODO: as URLS contain necesary translations
        // TODO: and make the ID unique in that case
        const lang_exists = existing_links.links.find( ({lang}) => lang === lang_)
        if (lang_exists) {
          continue;
        }
        // [ℹ] EN is main
        if (lang_ == 'en') {
          existing_links.url = url
        }
        const link: Alt_Links = {
          lang: lang_,
          url: url
        }
        existing_links.links.push(link)
        sport_links.set(sport_, existing_links)
    }
    else {
      const link: Alt_Links = {
        lang: lang_,
        url: url
      }
      const links_: Links = {
        url:    undefined,
        links:  []
      }
      links_.links.push(link)
      // [ℹ] EN is main
      if (lang_ == 'en') {
        links_.url = url
      }
      sport_links.set(sport_, links_)
    }

    // [ℹ] countires generation
    for (const country_item of data.scores_football_countries) {
      const country = country_item?.name
      let country_t = iterator?.countries_translation[country]
      country_t = 
        country_t == undefined
          ? removeDiacritics(country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '')
          : removeDiacritics(country_t.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
      ;

      url = 
      lang_ == 'en'
        ? '/' + sport_t + '/' + country_t
        : '/' + lang_ + '/' + sport_t + '/' + country_t
      ;

      if (country_links.has(country)) {
        const existing_links = country_links.get(country)
          // FIXME: precautionary validation
          // TODO: update backend "scores_tournaments"
          // TODO: to make single rows for each tournament
          // TODO: as URLS contain necesary translations
          // TODO: and make the ID unique in that case
          const lang_exists = existing_links.links.find( ({lang}) => lang === lang_)
          if (lang_exists) {
            continue;
          }
          // [ℹ] EN is main
          if (lang_ == 'en') {
            existing_links.url = url
          }
          const link: Alt_Links = {
            lang: lang_,
            url: url
          }
          existing_links.links.push(link)
          country_links.set(country, existing_links)
      }
      else {
        const link: Alt_Links = {
          lang: lang_,
          url: url
        }
        const links_: Links = {
          url:    undefined,
          links:  []
        }
        links_.links.push(link)
        // [ℹ] EN is main
        if (lang_ == 'en') {
          links_.url = url
        }
        country_links.set(country, links_)
      }
    }

  }

  const tournaments_links = new Map <number, Links>()

  // [ℹ] use tournaments urls to generate
  // [ℹ] additional URL combninations
  for (const iterator of data.scores_tournaments) {

    /*
      [ℹ] /{sport}/{country}/{league_name} or /{lang}/{sport}/{country}/{league_name}
    */
   
    // [ℹ] [depreceated] domestic ONLY check
    // [ℹ] [new] published ONLY check - 14/09/2022
    if (
      iterator.status == "draft" || 
      iterator.urls == undefined
    ) {
      continue
    }
  
    const league_id: number = iterator?.tournament_id

    for (let [key, value] of Object.entries(iterator.urls)) {
      value = value.replace('https://scores.betarena.com', '');
      if (tournaments_links.has(league_id)) {
        const existing_links = tournaments_links.get(league_id)
        // FIXME: precautionary validation
        // TODO: update backend "scores_tournaments"
        // TODO: to make single rows for each tournament
        // TODO: as URLS contain necesary translations
        // TODO: and make the ID unique in that case
        const lang_exists = existing_links.links.find( ({lang}) => lang === key)
        if (lang_exists) {
          continue;
        }
        // [ℹ] EN is main
        if (key == 'en') {
          existing_links.url = value
        }
        const link: Alt_Links = {
          url: value,
          lang: key
        }
        existing_links.links.push(link)
        tournaments_links.set(league_id, existing_links)
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
        tournaments_links.set(league_id, links_)
      }
    }
  }

  const fixtures_links = new Map <number, Links> ()

  // [ℹ] use fixtures urls to generate
  // [ℹ] additional URL combninations
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
    ...Array.from(lang_links.values()),
    ...Array.from(sport_links.values()),
    ...Array.from(country_links.values()),
    ...Array.from(tournaments_links.values()),
    ...Array.from(fixtures_links.values())
  ]

  if (dev) console.log(`lang_links size: ${lang_links.size}`)
  if (dev) console.log(`sport_links size: ${sport_links.size}`)
  if (dev) console.log(`country_links size: ${country_links.size}`)
  if (dev) console.log(`tournaments_links size: ${tournaments_links.size}`)
  if (dev) console.log(`fixtures_links size: ${fixtures_links.size}`)
  if (dev) console.log(`urlsArray length: ${urlsArray.length}`)

  await sitemapSave_2(urlsArray)

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

  // deleteCacheSitemapURLs();
  for (const url of cache_unique_arr) {
    cacheSitemapURLs(url)
  }
}

async function tournaments_page_generation(
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG - URL]
  // [ℹ] no-cache-deletion-required

  const finalCacheObj: Cache_Single_Tournaments_Data_Page_Translation_Response = {
    lang: undefined,
    url: undefined,
    data: undefined,
    alternate_data: undefined,
  }

  for (const iterator of data.scores_tournaments) {

    const tournament_id = iterator.tournament_id;

    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    // [ℹ] [depreceated] domestic ONLY check
    // [ℹ] [new] published ONLY check - 14/09/2022
    if (iterator.status == "draft") {
      continue
    }

    // [ℹ] /{sport}/{country}/{league_name}
    // [ℹ] /{lang}/{sport}/{country}/{league_name}
    const url = iterator.lang == 'en' 
    ? '/' + sport + '/' + country + '/' + league_name
    : '/' + lang  + '/' + sport + '/' + country + '/' + league_name
    
    finalCacheObj.lang = lang
    finalCacheObj.url = url
    finalCacheObj.data = iterator

    // [ℹ] identify url alternate-copies (translations) 
    finalCacheObj.alternate_data = data.scores_tournaments.filter(t => t.tournament_id === tournament_id)

    await cache_tournaments_page_info(url, finalCacheObj);
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

      console.log("iterator?.country_id_j", iterator?.country_id_j)

      const country =
        iterator?.country_id_j == undefined
          ? undefined
          : data?.scores_football_countries.find( ({ id }) => id == iterator?.country_id_j)?.name

      console.log("country", country)

      const country_t =
         country == undefined
          ? undefined
          : data?.scores_endpoints_translations.find( ({lang}) => lang == lang_)?.countries_translation[country]

      console.log("country_t",   country_t)

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

async function homepage_seo(
  langArray: string[], 
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG]
  // [ℹ] no-cache-deletion-required
 
  const finalCacheObj: Cache_Single_Homepage_SEO_Translation_Response = {
    lang: undefined,
    main_data: undefined,
    twitter_card: undefined,
    opengraph: undefined,
    hreflang: undefined
  }

  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_
    finalCacheObj.main_data = data.scores_seo_homepage.find(( { lang } ) => lang_ === lang).main_data;
    finalCacheObj.twitter_card = data.scores_seo_homepage.find(( { lang } ) => lang_ === lang).twitter_card;
    finalCacheObj.opengraph = data.scores_seo_homepage.find(( { lang } ) => lang_ === lang).opengraph;
    finalCacheObj.hreflang = data.scores_hreflang

    await cacheHomepageSEOData(lang_, finalCacheObj);
  }

}

async function tournaments_page_seo(
  langArray: string[], 
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG]
  // [ℹ] no-cache-deletion-required

  const finalCacheObj: Cache_Single_Tournaments_SEO_Translation_Response = {
    lang: undefined,
    main_data: undefined,
    twitter_card: undefined,
    opengraph: undefined,
    hreflang: undefined
  }

  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_
    finalCacheObj.main_data = data.scores_seo_tournaments.find(( { lang } ) => lang_ === lang).main_data;
    finalCacheObj.twitter_card = data.scores_seo_tournaments.find(( { lang } ) => lang_ === lang).twitter_card;
    finalCacheObj.opengraph = data.scores_seo_tournaments.find(( { lang } ) => lang_ === lang).opengraph;
    finalCacheObj.hreflang = data.scores_hreflang

    await cacheTournamentsPageSEOData(lang_, finalCacheObj);
  }

}

async function fixtures_page_seo(
  langArray: string[], 
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {
  // [ℹ] per [LANG]
  // [ℹ] no-cache-deletion-required

  const finalCacheObj: REDIS_CACHE_SINGLE_fixtures_seo_response = {
    lang: undefined,
    hreflang: undefined,
    main_data: undefined,
    twitter_card: undefined,
    opengraph: undefined
  }

  for (const lang_ of langArray) {
    
    finalCacheObj.lang = lang_
    finalCacheObj.main_data = data.scores_seo_fixtures.find(( { lang } ) => lang_ === lang).main_data;
    finalCacheObj.twitter_card = data.scores_seo_fixtures.find(( { lang } ) => lang_ === lang).twitter_card;
    finalCacheObj.opengraph = data.scores_seo_fixtures.find(( { lang } ) => lang_ === lang).opengraph;
    finalCacheObj.hreflang = data.scores_hreflang

    await cache_fixtures_seo(lang_, finalCacheObj);
  }

  return
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

async function sitemapSave_2(
  uniqArray: Links[]
) {

  const urlSitemapObjArr: {
    url: string
    changefreq: 'daily'
    priority: number
  }[] = []

  for (const link of uniqArray) {
    urlSitemapObjArr.push({
      ...link,
      changefreq: 'daily',
      priority: 0.3
    })
  }

  const limit = 50000;
  let offset = 0;
  let count = 0;
  const sitemapArrLoc: string[] = []
  const host = 'https://scores.betarena.com/'

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const tempSitemapUrls = urlSitemapObjArr.slice(offset, offset + limit);

    // [ℹ] exit
    if (tempSitemapUrls.length == 0) {
      if (dev) console.log(`exiting loop 1`);
      break;
    }

    const stream = new SitemapStream({ 
      hostname: host,
      xmlns: { // trim the xml namespace
        news: false, // flip to false to omit the xml namespace for news
        xhtml: true,
        image: false,
        video: false,
        custom: [
          'xmlns:xhtml="http://www.w3.org/TR/xhtml11/xhtml11_schema.html"'
        ]
      }
    })

    // TODO: Find a way to get the ".gz" compression working
    // FIXME: 

    // NOTE: not working "sitemap" with "links" fields
    // for (const iterator of tempSitemapUrls) {
    //   stream.write(iterator)
    // }
    // stream
    //   .pipe(createGzip())
    //   .pipe(fs.createWriteStream(`./static/sitemaps/sitemap-${count}.xml.gz`));

    // NOTE: alternative method
    // [ℹ] return a promise that resolves with your XML string
    const sitemapData = await streamToPromise(
      Readable.from(tempSitemapUrls).pipe(stream))
      .then((data) =>
        data.toString()
      )
    stream.end()
  
    const formattedXml = format(sitemapData);
  
    // [ℹ] persist to sitemap.xml;
    fs.writeFile(`./static/sitemaps/sitemap-${count}.xml`, formattedXml, err => {
      if (err) {
        console.error(err);
      }
    });

    sitemapArrLoc.push(`sitemaps/sitemap-${count}.xml`)
    offset = offset + limit;
    count++;
  }

  // [ℹ] generate sitemap-index's
  const smis = new SitemapIndexStream({level: 'warn'})
  for (const iterator of sitemapArrLoc) {
    smis.write({url: host +iterator})
  }
  smis
    .pipe(createGzip())
    .pipe(fs.createWriteStream('./static/sitemaps/sitemap-index.xml.gz'));
  smis.end()
}