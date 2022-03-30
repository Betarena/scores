
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_GoalScorers_Type, GoalScorers_Cache_Ready } from '$lib/models/best_goalscorer/types'
import { GET_BEST_GOALSCORERS_DATA } from '$lib/graphql/best_goalscorer/query'

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... 🐛 DEBUGGING;
    if (dev) console.debug('ℹ updating best_goalscorer data')
    // ... ℹ clear the cache data for `best_goalscorer`
    await delete_Best_Goalscorers_Data()
    // ... ℹ generate best goal scorers data by GEO;
    const response = await main()
    // ... ℹ iterate over EACH SELECTED FIXTURE, lang, by lang;
    for await (const best_goalscorer of response) {
        userGeo = best_goalscorer.lang
        // ... cache-response;
        await cache_Best_Goalscorers_Data_Geo_Pos(userGeo, best_goalscorer);
    }
    // ... DEBUGGING;
    // if (dev) console.info('-- featured-match.json --', response)
    // ... return, RESPONSE;
    return {
        status: 200,
        body: '✅ Success! Featured Betting Site Data has been Cached and Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cache_Best_Goalscorers_Data_Geo_Pos(geoPos, json_cache)
// - delete_Best_Goalscorers_Data()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_Best_Goalscorers_Data_Geo_Pos(geoPos: string, json_cache: GoalScorers_Cache_Ready) {
    // ... TRY;
    try {
      //... store (cache) best_goalscorer response,
      await redis.hset('best_goalscorer', geoPos, JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("❌ unable to cache best_goalscorer", geoPos, e);
    }
}

async function delete_Best_Goalscorers_Data() {
    await redis.del('best_goalscorer')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - get_Best_Goalscorers_Data()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Array < GoalScorers_Cache_Ready >> {
  // ...
  const response: Hasura_Complete_GoalScorers_Type = await get_Best_Goalscorers_Data()

  // ...
  const finalObj: Array < GoalScorers_Cache_Ready > = []

  // ... for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {
      // ... select-top-7-leagues;
      const goalscorerObj: GoalScorers_Cache_Ready = {
          lang: undefined,
          top_geo_goalscorer_players: [],
          translations: []
      }
      // ... ℹ declare language (GEO);
      goalscorerObj.lang = country_leagues.lang
      // ... 🐛 DEBUGGING;
      if (dev) console.debug('ℹ goalscorerObj.lang', goalscorerObj.lang)
      // ... ℹ iterate over each country-league;
      for await (const country_league of country_leagues.leagues) {
          // ... ℹ iterate over each top-goal-scorer;
          for (const player of response.scores_best_goalscorers) {
              // ... ℹ match_league_ids && match correct-lang;
              if (player.league_id.toString() === country_league.league_id.toString()) {
                  // ... 🐛 DEBUGGING;
                  if (dev) console.debug('ℹ player identified!', player.league_id, player.common_name)
                  // ... ℹ add player to the list of GEO players;
                  goalscorerObj.top_geo_goalscorer_players.push(player)
              }
              // ... ℹ terminating condition;
              if (goalscorerObj.top_geo_goalscorer_players != undefined && goalscorerObj.top_geo_goalscorer_players.length > 20) {
                  if (dev) console.debug('➤  exiting inner loop!', goalscorerObj.top_geo_goalscorer_players.length)
                  break;
              }
          }
          // ... ℹ terminating condition;
          if (goalscorerObj.top_geo_goalscorer_players != undefined && goalscorerObj.top_geo_goalscorer_players.length > 20) {
              if (dev) console.debug('➤  exiting main loop', goalscorerObj.top_geo_goalscorer_players.length)
              break;
          }
      }
      // ... ℹ sort data OBJECT [descending order];
      goalscorerObj.top_geo_goalscorer_players.sort((a, b) => b.goals - a.goals);
      // ... ℹ generate translations for OBJECT;
      for await (const pos_translation of response.player_positions_translations) {
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
      // ...
      let counterPos = 0;
      // ... ℹ add extra parameter;
      for await (const player of goalscorerObj.top_geo_goalscorer_players) {
        counterPos = counterPos + 1;
        player.pos_num = counterPos;
      }
      // ... ℹ push to final object;
      finalObj.push(goalscorerObj);
  }

  // ... 🐛 DEBUGING;
  if (dev) console.debug('finalObj', finalObj)

  return finalObj
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