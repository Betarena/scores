// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Hasura_Complete_Leagues_Table_Type, Leagues_Table_Cache_Ready, Leagues_Table_SEO_Cache_Ready, Single_League_Table_Data, Single_Team_Object_Data } from '$lib/models/leagues_table/types';
import { GET_LEAGUES_TABLE_DATA } from '$lib/graphql/leagues_table/query';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ... ℹ ALWAYS POST - HASURA TRIGGER PAYLOAD;
export async function get(): Promise< any > {
	// ... ℹ get the critical SEO data;
	const response = await main();
	// ... 🐛 DEBUGGING;
	if (dev) console.info('ℹ updating leagues_table seo data', response);
	// ... ℹ cache-response;
	await cache_League_Table_SEOResponse(response)
	// ... ℹ return, RESPONSE;
	return {
        status: 200,
        body: '✅ Success! Best Leagues Table SEO Data has been updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cache_League_Table_SEOResponse(geoPos, json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_League_Table_SEOResponse(json_cache: Leagues_Table_SEO_Cache_Ready) {
    // ... ℹ TRY;
    try {
        //... ℹ store (cache) featured_betting_sites response;
        await redis.hset('seo', 'leagues_table', JSON.stringify(json_cache));
    } 
    // ... ℹ CATCH, ERROR;
    catch (e) {
      console.log("❌ unable to cache", 'seo - leagues_table', e);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - main()
// - get_Leagues_Table_Data()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(): Promise < Leagues_Table_SEO_Cache_Ready > {
  // ...
  const response: Hasura_Complete_Leagues_Table_Type = await get_Leagues_Table_Data()

  // ...
  const season_league_cache_main: Leagues_Table_SEO_Cache_Ready = {
      top_leagues_table_data: [],
      translations: []
  }

  // ... ℹ assign translations;
  season_league_cache_main.translations = response.scores_standings_home_widget_translations_dev

  // ... ℹ for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {
      // ... ℹ select-top-8-leagues;
      const season_league_cache: Leagues_Table_Cache_Ready = {
          lang: undefined,              // ... ❌ not used;
          top_leagues_table_data: [],
          translations: []              // ... ❌ not used;
      }

      // ... ℹ declare language (GEO);
      season_league_cache.lang = country_leagues.lang
      if (season_league_cache.lang == 'en') {
        // ... 🐛 DEBUGGING;
        // if (dev) console.debug('ℹ season_league.lang', season_league_cache.lang)
        // ... ℹ iterate over each country-league;
        for await (const country_league of country_leagues.leagues) {
            // ... ℹ iterate over each top-goal-scorer;
            for (const season_league of response.scores_football_standings_dev) {
                // if (dev) console.debug('ℹ season_league', season_league)
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
                              season_league_teams: []
                            }
                            // ... ℹ populate data;
                            season_league_obj.season_league_id = season_league.id.toString()
                            season_league_obj.season_league_name = season_league.name.toString()
                            // ... ℹ iterate over THIS standing "teams";
                            for (const team of season_type.standings.data) {
                                // ... ℹ instantiate the TEAM OBJECT CACHE;
                                const team_obj: Single_Team_Object_Data = {
                                  position: undefined,
                                  team_logo:  undefined,
                                  team_name: undefined,
                                  games_played: undefined,
                                  points: undefined
                                }
                                // ... ℹ iterate over TEAMS DATA for EXTRA INFO;
                                for (const info_team of response.scores_football_teams_dev) {
                                    // ... ℹ identify target team;
                                    if (info_team.id.toString() === team.team_id.toString()) {
                                        // ... ℹ add extra info;
                                        team_obj.team_logo = info_team.data.logo_path
                                    }
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
        // ... ℹ add to main list;
        season_league_cache_main.top_leagues_table_data = [...season_league_cache_main.top_leagues_table_data, ...season_league_cache.top_leagues_table_data];
      }
  }
 
  // ... 🐛 DEBUGING;
  if (dev) console.debug('ℹ final seo object', season_league_cache_main)

  return season_league_cache_main
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