
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import { getAllLiveScoresFootball } from '$lib/firebase/livescores_football'
import type { LiveScore_SEO_Game, All_SportBook_Details_Data, LiveScore_SEO_Game_Scoped_Lang, Scores_Featured_Betting_Sites_Hasura } from '$lib/model/featured_betting_sites/firebase-real-db-interface'

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('-- updating livescores_data --')
    let langs:string[] = ['br','en','es','it','pt','ro'];
    
    // ... clear the cache data for `livescores_data`
    await deleteLiveScores()
    // ... get all of the SELECTED FIXTURES from HASURA;
    const response:LiveScore_SEO_Game[] = await getLiveScores()

    //Aggregate games by language
    for(var l in langs){
      let lang:string = langs[l];
      let langDate: LiveScore_SEO_Game_Scoped_Lang[] = [];
        for(var p in response){
          let day = response[p];
          for(var g in day){
            var game = day[g];
            const newGame:  LiveScore_SEO_Game_Scoped_Lang={             
              visitorteam: game.visitorteam,
              localteam: game.localteam,
              tip: (game.tips && game.tips[lang]) ? game.tips[lang].link :"",
              link:(game.links && game.links[lang]) ? game.links[lang] :"" ,
            }
            langDate.push(newGame);            
          }
        }
        cacheFeaturedBettingSiteGeoPos(lang,langDate);
    }

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
// - cacheFeaturedBettingSiteGeoPos(geoPos, json_cache)
// - deleteFeaturedBettingSite()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheFeaturedBettingSiteGeoPos(geoPos: string, json_cache: LiveScore_SEO_Game_Scoped_Lang[]) {
    // ... TRY;
    try {
      //... store (cache) featured_match response,
      await redis.hset('live_scores', geoPos, JSON.stringify(json_cache));
      console.log("Caching live_scores"+ geoPos );
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", geoPos, e);
    }
}

async function deleteLiveScores() {
    await redis.del('live_scores')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getLiveScores()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLiveScores(): Promise <LiveScore_SEO_Game[] > {
    // ...
    const liveScores: LiveScore_SEO_Game[] = await getAllLiveScoresFootball();
    // ... DEBUGGING;
    if (dev) console.info('live_scores',Object.keys(liveScores));

    // ... return;
    return liveScores;
}