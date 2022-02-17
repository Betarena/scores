
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import { GET_LIVESCORES_LEAGUES } from '$lib/graphql/query';


/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('-- updating livescores_data --')
    
    // ... clear the cache data for `livescores_data`
    await deleteLiveScores()
    // ... get all of the SELECTED FIXTURES from HASURA;
    const response:any = await getLeaguesOrder()

  
    cacheLeaguesOrder(response);

    // ... DEBUGGING;
    // if (dev) console.info('-- featured-match.json --', response)
    // ... return, RESPONSE;
    return {
        status: 200,
        body: 'Success! LiveScores Football Data has been Cached and Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheLeaguesOrder(geoPos, json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheLeaguesOrder(json_cache: any) {
    // ... TRY;
    try {
      //... store (cache) featured_match response,
      await redis.set('live_scores_leagues',  JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", e);
    }
}

async function deleteLiveScores() {
    await redis.del('live_scores_leagues')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getLeaguesOrder()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLeaguesOrder(): Promise <any> {
    // ...
    var leagueSort = {};

    return  initGrapQLClient().request(GET_LIVESCORES_LEAGUES).then(x=>{
      let leagues = x.leagues_filtered_country_dev;
      for(var k  = 0;  k < leagues.length;k++){
        if(leagues[k].lang == null) continue;
        for(var i = 0; i < leagues[k].leagues.length;i++)
        {
          leagues[k].leagues[i].index = i;
        }
        leagueSort[leagues[k].lang] = leagues[k].leagues;
      }
      if (dev) console.info('live_scores leagueSort',Object.keys(leagueSort));

      return leagueSort;
    });

}