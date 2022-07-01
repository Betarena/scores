
// [ℹ] import $app `modules`;
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import { getAllSportbookDetails } from '$lib/firebase/featured_betting_sites'
import type { All_SportBook_Details_Data, Cache_Single_Lang_Featured_Betting_Site_Translation_Response, Scores_Featured_Betting_Sites_Hasura } from '$lib/models/featured_betting_sites/firebase-real-db-interface'
import { GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES } from '$lib/graphql/featured_betting_sites/query'
import { GET_HREFLANG_DATA } from '$lib/graphql/query'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function post(): Promise < unknown > {

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  await featuredBettingSiteGeoDataGeneration()
  await featuredBettingSiteLangDataGeneration(langArray)

  // [ℹ] return, RESPONSE;
  return {
    status: 200,
    body: '✅ Success \nFeatured Betting Sites Updated!'
  }
}

/**
 * [ℹ] Featured Betting Sites CACHEING ACTIONS METHODS
*/

async function cacheFeaturedBettingSiteGeoPos (geoPos: string, json_cache: All_SportBook_Details_Data) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('featured_betting_sites_geo', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.log('❌ unable to cache featured_betting_sites_geo for ', geoPos, e);
  }
}

async function cacheFeaturedBettingSiteLang (lang: string, json_cache: Cache_Single_Lang_Featured_Betting_Site_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('featured_betting_sites_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ featured_betting_sites_t lang ', lang, 'cached')
  } 
  catch (e) {
    console.error('❌ unable to cache featured_betting_sites_t for ', lang, e);
  }
}

async function deleteFeaturedBettingSiteGeoPos () {
  await redis.del('featured_betting_sites_geo')
  return
}

async function deleteFeaturedBettingSiteLang () {
  await redis.del('featured_betting_sites_t')
  return
}

/**
 * [ℹ] Featured Betting Sites CACHE GENERATION
*/

async function featuredBettingSiteGeoDataGeneration () {
  
  await deleteFeaturedBettingSiteGeoPos()

  // [ℹ] get all of the SELECTED FIXTURES from HASURA;
  const response = await getAllFeaturedBettingSite()

  // [ℹ] iterate over EACH SELECTED FIXTURE 
  // [ℹ] & cache => geoPos-by-geoPos;
  for await (const featured_betting_site of response) {
    const userGeo = featured_betting_site.lang
    // [ℹ] cache-response;
    await cacheFeaturedBettingSiteGeoPos(userGeo, featured_betting_site);
  }

}

async function featuredBettingSiteLangDataGeneration (langArray: string[]) {

  let finalCacheObj: Cache_Single_Lang_Featured_Betting_Site_Translation_Response = undefined

  const response: Scores_Featured_Betting_Sites_Hasura = await initGrapQLClient().request(GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES)

  deleteFeaturedBettingSiteLang()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj = response.scores_featured_betting_sites_translations_dev.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheFeaturedBettingSiteLang(lang_, finalCacheObj);
  }

}

/**
 * [ℹ] Featured Match Methods
*/

async function getAllFeaturedBettingSite (): Promise < Array < All_SportBook_Details_Data > > {

  const sportBookDetails: any = await getAllSportbookDetails();

  // [ℹ] converting to JSON;
  const sportBookDetails_ObjArray: Array < All_SportBook_Details_Data > = Object.entries(sportBookDetails).map(function(entry) {

    // [ℹ] decrlare data;
    const key = entry[0];
    const value = entry[1];

    // [ℹ] secondary-key-inner-value-pair;
    const siteDetailsValue_ObjArray = Object.entries(value).map(function(entry_v1) {
      // let key_1 = entry_v1[0]; // [ℹ] ignore
      const value_1 = entry_v1[1];
      // [ℹ] dealing with nested values;
      let nested_object = [];
      nested_object = value_1
      return nested_object
    })

    // [ℹ] inner-parent-data;
    const nested_object: All_SportBook_Details_Data = {};
    // nested_object.translations = undefined;
    nested_object.data = siteDetailsValue_ObjArray;
    nested_object.lang = key;

    return nested_object;
  });

  // [ℹ] inject the translations data acoordingly into 1 single JSON Object to each sportbook_details;
  for await (const sportBookDetails_elem of sportBookDetails_ObjArray) {
    // [ℹ] sort positions;
    sportBookDetails_elem.data.sort((a, b) => parseInt(a.position) - parseInt(b.position))
  }

  return sportBookDetails_ObjArray;
}