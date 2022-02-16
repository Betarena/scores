
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import { getAllSportbookDetails } from '$lib/firebase/featured_betting_sites'
import type { All_SportBook_Details_Data, Scores_Featured_Betting_Sites_Hasura } from '$lib/models/featured_betting_sites/firebase-real-db-interface'
import { GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES } from '$lib/graphql/featured_betting_sites/query'

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('-- updating featured_betting_sites_data --')
    // ... clear the cache data for `featured_match_data`
    await deleteFeaturedBettingSite()
    // ... get all of the SELECTED FIXTURES from HASURA;
    const response = await getAllFeaturedBettingSite()
    // ... iterate over EACH SELECTED FIXTURE, lang, by lang;
    for await (const featured_betting_site of response) {
        userGeo = featured_betting_site.lang
        // ... cache-response;
        await cacheFeaturedBettingSiteGeoPos(userGeo, featured_betting_site);
    }
    // ... DEBUGGING;
    // if (dev) console.info('-- featured-match.json --', response)
    // ... return, RESPONSE;
    return {
        status: 200,
        body: 'Success! Featured Betting Site Data has been Cached and Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheFeaturedBettingSiteGeoPos(geoPos, json_cache)
// - deleteFeaturedBettingSite()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheFeaturedBettingSiteGeoPos(geoPos: string, json_cache: All_SportBook_Details_Data) {
    // ... TRY;
    try {
      //... store (cache) featured_match response,
      await redis.hset('featured_betting_sites', geoPos, JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", geoPos, e);
    }
}

async function deleteFeaturedBettingSite() {
    await redis.del('featured_betting_sites')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getAllFeaturedBettingSite()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getAllFeaturedBettingSite(): Promise < Array < All_SportBook_Details_Data > > {
    // ...
    const sportBookDetails: any = await getAllSportbookDetails();
    // ... DEBUGGING;
    if (dev) console.info('sportBookDetails', sportBookDetails);

    // ... converting data to appropiate JSON;
    const sportBookDetails_ObjArray: Array < All_SportBook_Details_Data > = Object.entries(sportBookDetails).map(function(entry) {

      // ... decrlare data;
      const key = entry[0];
      const value = entry[1];

      // ... secondary-key-inner-value-pair;
      const siteDetailsValue_ObjArray = Object.entries(value).map(function(entry_v1) {
        // let key_1 = entry_v1[0]; // ... ignore
        const value_1 = entry_v1[1];
        // ... dealing with nested values;
        let nested_object = [];
        nested_object = value_1
        return nested_object
      })

      // ... inner-parent-data;
      const nested_object: All_SportBook_Details_Data = {};
      nested_object.translations = undefined;
      nested_object.data = siteDetailsValue_ObjArray;
      nested_object.lang = key;
      // ...
      return nested_object;
    });
    // ... DEBUGGING;
    if (dev) console.info('my_array', sportBookDetails_ObjArray);

    // ... retrieve the appropiate translations information;
    const response: Scores_Featured_Betting_Sites_Hasura = await initGrapQLClient().request(GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES)
    // ... DEBUGGING;
    if (dev) console.info('-- widgetInit() --', response)
    
    // ... inject the translations data acoordingly into 1 single JSON Object to each sportbook_details;
    for await (const sportBookDetails_elem of sportBookDetails_ObjArray) {
      // ... retrieve the appropiate information from the DB;
      sportBookDetails_elem.translations = response.scores_featured_betting_sites_translations_dev
      // ... sort positions;
      sportBookDetails_elem.data.sort((a, b) => parseInt(a.position) - parseInt(b.position))
    }

    // ... return;
    return sportBookDetails_ObjArray;
}