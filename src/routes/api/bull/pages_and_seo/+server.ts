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
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')
const format = require('xml-formatter');

import { 
  REDIS_CACHE_PAGES_AND_SEO 
} from '$lib/graphql/pages_and_seo/query'

import type { 
  Cache_Single_Homepage_SEO_Translation_Response, 
  Cache_Single_Tournaments_Data_Page_Translation_Response, 
  Cache_Single_Tournaments_SEO_Translation_Response, 
  BETARENA_HASURA_QUERY_pages_and_seo 
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
const cacheTarget = "REDIS CACHE | navbar"
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
    
    await sitemap_generation(response)
    await homepage_seo(langArray, response)
    await tournaments_seo(langArray, response)
    await tournaments_page_generation(response)

    for (const log of logs) {
      console.log(log)
    }

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
    await redis.hset('tournaments_seo', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.debug('❌ unable to cache - seo / tournaments page', e);
  }
}

async function cacheTournamentsPageData (
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
  await tournaments_seo(langArray, response)
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

async function sitemap_generation(
  data: BETARENA_HASURA_QUERY_pages_and_seo
) {

  // [ℹ] per [LANG - URL]
  // [ℹ] no-cache-deletion-required

  const urlsArray: string[] = []

  // [ℹ] use longest chain (scores_tournaments)
  // [ℹ] to generate all URL combinations
  for (const iterator of data.scores_tournaments) {

    let url: string;
    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    // [ℹ] [depreceated] domestic ONLY check
    // [ℹ] [new] published ONLY check - 14/09/2022
    if (iterator.status == "draft") {
      continue
    }

    // [🐛] debug
    /*
      if (iterator.tournament_id == 1505) {
        console.log(`
          Found it!
          url: ${'/' + lang  + '/' + sport + '/' + country + '/' + league_name}
        `)
        break
      }
    */

    /*
      [ℹ] / or /{lang}
      [ℹ] /{sport} or /{lang}/{sport}
      [ℹ] /{sport}/{country} or /{lang}/{sport}/{country}
      [ℹ] /{sport}/{country}/{league_name} or /{lang}/{sport}/{country}/{league_name}
    */
 
    url = iterator.lang == 'en' 
    ? '/' 
    : '/' + lang;
    urlsArray.push(url)

    url = iterator.lang == 'en' 
    ? '/' + sport 
    : '/' + lang + '/' + sport;
    urlsArray.push(url)

    url = iterator.lang == 'en' 
    ? '/' + sport + '/' + country
    : '/' + lang  + '/' + sport + '/' + country
    urlsArray.push(url)

    url = iterator.lang == 'en' 
    ? '/' + sport + '/' + country + '/' + league_name
    : '/' + lang  + '/' + sport + '/' + country + '/' + league_name
    urlsArray.push(url)
  }

  // [ℹ] use fixtures urls to generate
  // [ℹ] additional URL combninations


  const uniqArray = [...new Set(urlsArray)];
  sitemapSave(uniqArray)

  // deleteCacheSitemapURLs();
  for (const url of uniqArray) {
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

    await cacheTournamentsPageData(url, finalCacheObj);
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

async function tournaments_seo(
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
  const sitemapData = await streamToPromise(Readable.from(urlSitemapObjArr).pipe(stream)).then((data) =>
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