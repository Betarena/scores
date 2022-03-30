// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_GoalScorers_Type, GoalScorers_Cache_SEO_Ready, GoalScorers_Cache_Ready } from '$lib/models/best_goalscorer/types';
import { GET_BEST_GOALSCORERS_DATA } from '$lib/graphql/best_goalscorer/query';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ... ℹ ALWAYS POST - HASURA TRIGGER PAYLOAD;
export async function get(): Promise< any > {
	// ... ℹ get the critical SEO data;
	const response = await main();
	// ... 🐛 DEBUGGING;
	if (dev) console.info('ℹ updating best_goalscorer seo data', response);
	// ... ℹ cache-response;
	await cache_Best_GoalScorer_SEOResponse(response)
	// ... ℹ return, RESPONSE;
	return {
        status: 200,
        body: '✅ Success! Best Goalscorer SEO Data has been updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cache_Best_GoalScorer_SEOResponse(geoPos, json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_Best_GoalScorer_SEOResponse(json_cache: GoalScorers_Cache_SEO_Ready) {
    // ... ℹ TRY;
    try {
        //... ℹ store (cache) featured_betting_sites response;
        await redis.hset('seo', 'best_goalscorer', JSON.stringify(json_cache));
    } 
    // ... ℹ CATCH, ERROR;
    catch (e) {
      console.log("❌ unable to cache", 'seo - best_goalscorer', e);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - get_Best_Goalscorers_Data()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < GoalScorers_Cache_SEO_Ready > {
  // ...
  const response: Hasura_Complete_GoalScorers_Type = await get_Best_Goalscorers_Data()

  // ...
  const goalscorerObj: GoalScorers_Cache_Ready = {
      lang: undefined,
      top_geo_goalscorer_players: [],
      translations: []
  }
  // ...
  goalscorerObj.top_geo_goalscorer_players = response.scores_best_goalscorers

  // ... ℹ generate translations for OBJECT;
  for (const pos_translation of response.player_positions_translations) {
    // ... ℹ generate new empty LANG object;
    const newObject = { }
    // ... ℹ add data correctly;
    newObject.lang = pos_translation.lang.toString()
    newObject.positions_translations = pos_translation.position
    // ... ℹ add in the new translation;
    for (const widget_translation of response.scores_best_goalscorers_translations) {
      // ... ℹ validation LANG;
      if (widget_translation.lang.toString() == newObject.lang) {
        // ... ℹ add the widget translation;
        newObject.widget_translations = widget_translation.translations
      }
    }
    // ... ℹ push to final object;
    goalscorerObj.translations.push(newObject)
  }
  // ... 🐛 DEBUGING;
  if (dev) console.debug('ℹ final seo object', goalscorerObj)

  return goalscorerObj
}

async function get_Best_Goalscorers_Data(): Promise < Hasura_Complete_GoalScorers_Type > {
  // ... 🐛 DEBUGGING;
  if (dev) console.debug('➤  FETCH all best goalscorers data')
  // ... ℹ push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_BEST_GOALSCORERS_DATA);
  // ... 🐛 DEBUGGING;
  // if (dev) console.debug('➤ getAllLeagueList() response', response)
  // ... ℹ reutrn response;
  return response
}