
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_Leagues_Table_Type, Leagues_Table_Cache_Ready, Single_League_Table_Data, Single_Team_Object_Data } from '$lib/models/leagues_table/types'
import { GET_LEAGUES_TABLE_DATA } from '$lib/graphql/leagues_table/query'

// ... server-variables;
let userGeo: string

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise < any > {
    // ... 🐛 DEBUGGING;
    if (dev) console.debug('ℹ updating leagues_table data')
    // ... ℹ clear the cache data for `leagues_table`
    await delete_League_Tables_Data()
    // ... ℹ generate best goal scorers data by GEO;
    const response = await main()
    // ... ℹ iterate over EACH SELECTED FIXTURE, lang, by lang;
    for await (const season_data_league of response) {
        userGeo = season_data_league.lang
        // ... cache-response;
        await cache_League_Table_Data_Geo_Pos(userGeo, season_data_league);
    }
    // ... 🐛 DEBUGGING;
    // if (dev) console.info('-- featured-match.json --', response)
    // ... return, RESPONSE;
    return {
        status: 200,
        body: '✅ Success! Season League Table Data has been Cached and Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cache_League_Table_Data_Geo_Pos(geoPos, json_cache)
// - delete_League_Tables_Data()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_League_Table_Data_Geo_Pos(geoPos: string, json_cache: Leagues_Table_Cache_Ready) {
    // ... TRY;
    try {
      //... store (cache) best_goalscorer response,
      await redis.hset('leagues_table', geoPos, JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("❌ unable to cache leagues_table", geoPos, e);
    }
}

async function delete_League_Tables_Data() {
    await redis.del('leagues_table')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - get_Best_Goalscorers_Data()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Array < Leagues_Table_Cache_Ready >> {
  // ...
  const response: Hasura_Complete_Leagues_Table_Type = await get_Leagues_Table_Data()

  // ...
  const finalObj: Array < Leagues_Table_Cache_Ready > = []

  // ... ℹ for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {
      // ... ℹ select-top-8-leagues;
      const season_league_cache: Leagues_Table_Cache_Ready = {
          lang: undefined,
          top_leagues_table_data: [],
          translations: []
      }

      // ... ℹ declare language (GEO);
      season_league_cache.lang = country_leagues.lang
      // ... 🐛 DEBUGGING;
      if (dev) console.debug('ℹ season_league.lang', season_league_cache.lang)
      // ... ℹ iterate over each country-league;
      for await (const country_league of country_leagues.leagues) {
          // ... ℹ iterate over each top-goal-scorer;
          for (const season_league of response.scores_football_standings) {
              // ... ℹ match_league_ids && match correct-lang;
              if (season_league.id.toString() === country_league.league_id.toString()) {
                  // ... ℹ iterate over the "season_league" [filtered] data;
                  for (const season_type of season_league.data) {
                      // ... ℹ and select the "Regular Season" only!
                      if (season_type.name.toString() === "Regular Season") {
                          // ... ℹ instantiate the SEASON-LEAGUE OBJECT CACHE;
                          const season_league_obj: Single_League_Table_Data = {
                            season_league_id: undefined,
                            season_league_name: undefined,
                            season_league_logo: undefined,
                            season_league_teams: []
                          }
                          // ... ℹ populate data;
                          season_league_obj.season_league_id = season_league.id.toString()
                          season_league_obj.season_league_name = season_league.name.toString()
                          // ... ℹ iterate over leagues-seasons for "logo-target";
                          for (const league_season of response.scores_football_leagues) {
                            // ... ℹ validate for equality of "league_ids":
                            if (season_league_obj.season_league_id.toString() === league_season.id.toString()) {
                              // ... ℹ assign:
                              season_league_obj.season_league_logo = league_season.data.logo_path.toString() // ✅ exists...
                            }
                          }
                          // ... ℹ iterate over THIS standing "teams";
                          for (const team of season_type.standings.data) {
                              // ... ℹ instantiate the TEAM OBJECT CACHE;
                              const team_obj: Single_Team_Object_Data = {
                                position: undefined,
                                team_logo:  undefined,
                                team_name: undefined,
                                games_played: undefined,
                                points: undefined,
                                color_code: undefined
                              }
                              // ... ℹ iterate over TEAMS DATA for EXTRA INFO;
                              for (const info_team of response.scores_football_teams) {
                                  // ... ℹ identify target team;
                                  if (info_team.id.toString() === team.team_id.toString()) {
                                      // ... ℹ add extra info;
                                      team_obj.team_logo = info_team.data.logo_path
                                  }
                              }
                              // ... ℹ get TEAM COLOR CODE;
                              if (team.result != null && team.result != undefined) {
                                // ... ℹ iterate over "sport" color codes;
                                for (const sport of response.color_codes_league_standings_positions) {
                                  // ... ℹ validate;
                                  if (sport.sports === "football") {
                                    // ... ℹ assign;
                                    team_obj.color_code = sport.color_codes[team.result.toString()];
                                  }
                                }
                              } else {
                                team_obj.color_code = 'transparent';
                              }
                              // ... ℹ populate data;
                              team_obj.position = parseInt(team.position.toString());
                              team_obj.team_name = team.team_name;
                              team_obj.games_played = team.overall.games_played.toString();
                              team_obj.points = team.overall.points.toString();
                              // ... ℹ add team to list of THIS SEASON-LEAGUE;
                              season_league_obj.season_league_teams.push(team_obj)
                          }
                          // ... ℹ add to the gloabal cache data:
                          season_league_cache.top_leagues_table_data.push(season_league_obj)
                      }
                  }
                  // ... 🐛 DEBUGGING;
                  // if (dev) console.debug('ℹ player identified!', player.league_id, player.common_name)
              }
              // ... ℹ terminating condition;
              if (season_league_cache.top_leagues_table_data != undefined && 
                  season_league_cache.top_leagues_table_data.length > 7) {
                  // ... 🐛 DEBUGGING;
                  if (dev) console.debug('➤  exiting inner loop! reached limited length of: ', season_league_cache.top_leagues_table_data.length)
                  // ... 🚀 exit;
                  break;
              }
          }
          // ... ℹ terminating condition;
          if (season_league_cache.top_leagues_table_data != undefined && 
            season_league_cache.top_leagues_table_data.length > 7) {
            // ... 🐛 DEBUGGING;
            if (dev) console.debug('➤  exiting final loop! reached limited length of: ', season_league_cache.top_leagues_table_data.length)
            // ... 🚀 exit;
            break;
        }
      }

      // ... ℹ sort data OBJECT [descending order];
      // season_league_cache.top_geo_goalscorer_players.sort((a, b) => b.goals - a.goals);

      // ... ℹ assign translations;
      season_league_cache.translations = response.scores_standings_home_widget_translations

      // ... ℹ push to final object;
      finalObj.push(season_league_cache);
  }

  // ... 🐛 DEBUGING;
  if (dev) console.debug('finalObj', finalObj)

  return finalObj
}

async function get_Leagues_Table_Data(): Promise < Hasura_Complete_Leagues_Table_Type > {
  // ... 🐛 DEBUGGING;
  if (dev) console.debug('➤  FETCH all leagues_table data')
  // ... ℹ push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_LEAGUES_TABLE_DATA);
  // ... 🐛 DEBUGGING;
  // if (dev) console.debug('➤ getAllLeagueList() response', response)
  // ... ℹ reutrn response;
  return response
}