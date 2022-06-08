
// [ℹ] import $app `modules`;
import { dev } from '$app/env'

// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import { removeDiacritics } from '$lib/utils/languages'

// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import { GET_COMPLETE_PAGES_AND_SEO_DATA } from '$lib/graphql/pages_and_seo/query'
import type { Hasura_Complete_Pages_SEO } from '$lib/models/pages_and_seo/types'

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
  // [ℹ] get all of the LEAGUE LIST DATA from HASURA;
  const response = await main()
  // [ℹ] cache;
  cacheHomepageSEOData(response)
  // [ℹ] return RESPONSE;
  if (response) {
    return {
      status: 200,
      body: '✅ Success! League list SEO cache data has been updated!'
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
// - cacheLeagueListSEO(json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheHomepageSEOData(json_cache: Hasura_Complete_Pages_SEO) {
  // [ℹ] TRY;
  try {
    //[ℹ] store (cache) league_list response,
    await redis.hset('seo', 'pages', JSON.stringify(json_cache));
  } 
  // [ℹ] CATCH, ERROR;
  catch (e) {
    console.debug('❌ unable to cache - seo / page_homepage', e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - getAllHomepageSEOtData()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Hasura_Complete_Pages_SEO > {

  const response: any = await getAllHomepageSEOData()

  const urlsArray: string[] = []

  // [ℹ] generate appropiate URLS
  for (const iterator of response.scores_tournaments_dev) {

    let url: string;
    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-');

    // [ℹ] /{lang} or / generation URL
    url = iterator.lang == 'en' 
    ? '/' 
    : '/' + lang;
    
    urlsArray.push(url)

    // [ℹ] /{lang}/{sport} or /{sport} generation URL
    url = iterator.lang == 'en' 
      ? '/' + sport 
      : '/' + lang + '/' + sport;

    urlsArray.push(url)

    // [ℹ] /{lang}/{sport}/{country} or /{sport}/{country} generation URL
    url = iterator.lang == 'en' 
      ? '/' + sport + '/' + country
      : '/' + lang  + '/' + sport + '/' + country
    
    urlsArray.push(url)

    // [ℹ] /{lang}/{sport}/{country}/{league_name} or /{sport}/{country}/{league_name} generation URL
    url = iterator.lang == 'en' 
      ? '/' + sport + '/' + country + '/' + league_name
      : '/' + lang  + '/' + sport + '/' + country + '/' + league_name
    
    urlsArray.push(url)
  }
  
  const uniqArray = [...new Set(urlsArray)];

  // console.log("uniqArray", uniqArray)
  response.scores_urls_dev = {
    urlsArr: undefined || []
  }
  response.scores_urls_dev.urlsArr = uniqArray;

  return response
}

async function getAllHomepageSEOData(): Promise < any > {
  // [ℹ] push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_COMPLETE_PAGES_AND_SEO_DATA)
  // [ℹ] reutrn response;
  return response
}