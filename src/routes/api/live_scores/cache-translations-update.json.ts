
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import { GET_LIVESCORES_TRANSLATIONS } from '$lib/graphql/query';


/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('-- updating livescores_data --')
    
    // ... clear the cache data for `livescores_data`
    await deleteTranslations()
    // ... get all of the SELECTED FIXTURES from HASURA;
    const response:any = await getTranslations()

  
    cacheTranslations(response);

   
    return {
        status: 200,
        body: 'Success! LiveScores Football Translations Data has been Cached and Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheLeaguesOrder(geoPos, json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheTranslations(json_cache: any) {
    // ... TRY;
    try {
      //... store (cache) featured_match response,
      await redis.set('live_scores_football_translations',  JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", e);
    }
}

async function deleteTranslations() {
    await redis.del('live_scores_football_translations')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getLeaguesOrder()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTranslations(): Promise <any> {

    return  initGrapQLClient().request(GET_LIVESCORES_TRANSLATIONS).then(x=>{
     
      if (dev) console.info('live_scores translations',x);

      return x.scores_livescore_football_translations_dev;
    });

}