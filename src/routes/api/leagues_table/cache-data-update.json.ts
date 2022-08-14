import { dev } from '$app/env'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import { performance } from 'perf_hooks';
import Bull from 'bull';

import type { 
  Cache_Single_Geo_Leagues_Table_Translation_Response, 
  Cache_Single_Lang_Leagues_Table_Translation_Response, 
  Hasura_Complete_Leagues_Table_Type, 
  Leagues_Table_Cache_Ready, 
  Leagues_Table_SEO_Cache_Ready, 
  Single_League_Table_Data, 
  Single_Team_Object_Data 
} from '$lib/models/leagues_table/types'
import { GET_LEAGUES_TABLE_DATA } from '$lib/graphql/leagues_table/query'
import { GET_HREFLANG_DATA } from '$lib/graphql/query'

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueLeaguesTable = new Bull (
  'cacheQueueLeaguesTable', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    },
    settings: settings
  }
);
const cacheTarget = "REDIS CACHE | leagues_table"
let logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`
    ℹ ${cacheTarget} 
    at: ${new Date().toDateString()}
  `);

  // [ℹ] producers [JOBS]
  const job = await cacheQueueLeaguesTable.add({});

  console.log(`
    job_id: ${job.id}
  `)

  return {
    status: 200,
    body: { 
      job_id: job.id
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheLeaguesTableGeoPos (geoPos: string, json_cache: Cache_Single_Geo_Leagues_Table_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('leagues_table_geo', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.log('❌ unable to cache leagues_table_geo for ', geoPos, e);
  }
}

async function cacheLeaguesTableLang (lang: string, json_cache: Cache_Single_Lang_Leagues_Table_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('leagues_table_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ leagues_table_t lang ', lang, 'cached')
  } 
  catch (e) {
    console.error('❌ unable to cache leagues_table_t for ', lang, e);
  }
}

async function deleteLeaguesTableGeoPos () {
  await redis.del('leagues_table_geo')
  return
}

async function deleteLeaguesTableLang () {
  await redis.del('leagues_table_t')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueLeaguesTable.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  await leagueTableGeoDataGeneration()
  await leagueTableLangDataGeneration(langArray)

  const t1 = performance.now();

  if (dev) console.log(`
    ${cacheTarget} updated!
    completed in: ${(t1 - t0) / 1000} sec
  `)

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function leagueTableGeoDataGeneration () {

  // await deleteLeaguesTableGeoPos ()

  const response: Array < Cache_Single_Geo_Leagues_Table_Translation_Response > = await mainGeo()

  // [ℹ] iterate over EACH LEAGUE OBJECT, lang, by lang;
  for await (const season_data_league of response) {
    const userGeo = season_data_league.lang
    // [ℹ] cache-response;
    await cacheLeaguesTableGeoPos (userGeo, season_data_league);
  }

}

async function leagueTableLangDataGeneration (langArray: string[]) {

  const finalCacheObj: Cache_Single_Lang_Leagues_Table_Translation_Response = {
    top_leagues_table_data: undefined,
    translations: undefined
  }

  // [ℹ] ℹ generate best goal scorers data by GEO;
  const response: Leagues_Table_SEO_Cache_Ready = await mainLang()

  // deleteLeaguesTableLang ()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.top_leagues_table_data = response.top_leagues_table_data;
    finalCacheObj.translations = response.translations.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheLeaguesTableLang (lang_, finalCacheObj);
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function mainGeo(): Promise < Array < Cache_Single_Geo_Leagues_Table_Translation_Response >> {

  const response: Hasura_Complete_Leagues_Table_Type = await initGrapQLClient().request(GET_LEAGUES_TABLE_DATA);

  const finalObj: Array < Cache_Single_Geo_Leagues_Table_Translation_Response > = []

  // [ℹ] for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {

    // [ℹ] select-top-8-leagues;
    const season_league_cache: Cache_Single_Geo_Leagues_Table_Translation_Response = {
      lang: undefined,
      top_leagues_table_data: [],
    }

    // [ℹ] declare language (GEO);
    season_league_cache.lang = country_leagues.lang

    // [ℹ] iterate over each country-league;
    for await (const country_league of country_leagues.leagues) {

      // [ℹ] iterate over each top-goal-scorer;
      for (const season_league of response.scores_football_standings) {

        // [ℹ] match_league_ids && match correct-lang;
        if (season_league.id.toString() === country_league.league_id.toString()) {

          // [ℹ] iterate over the "season_league" [filtered] data;
          for (const season_type of season_league.data) {

            // [ℹ] and select the "Regular Season" only!
            if (season_type.name.toString() === "Regular Season") {

              // [ℹ] instantiate the SEASON-LEAGUE OBJECT CACHE;
              const season_league_obj: Single_League_Table_Data = {
                season_league_id: undefined,
                season_league_name: undefined,
                season_league_logo: undefined,
                season_league_teams: []
              }

              // [ℹ] populate data;
              season_league_obj.season_league_id = season_league.id.toString()
              season_league_obj.season_league_name = season_league.name.toString()

              // [ℹ] iterate over leagues-seasons for "logo-target";
              for (const league_season of response.scores_football_leagues) {
                // [ℹ] validate for equality of "league_ids":
                if (season_league_obj.season_league_id.toString() === league_season.id.toString()) {
                  // [ℹ] assign:
                  season_league_obj.season_league_logo = league_season.data.logo_path.toString() // ✅ exists...
                }
              }
              
              // [ℹ] iterate over THIS standing "teams";
              for (const team of season_type.standings.data) {

                // [ℹ] instantiate the TEAM OBJECT CACHE;
                const team_obj: Single_Team_Object_Data = {
                  position: undefined,
                  team_logo:  undefined,
                  team_name: undefined,
                  games_played: undefined,
                  points: undefined,
                  color_code: undefined
                }

                // [ℹ] iterate over TEAMS DATA for EXTRA INFO;
                for (const info_team of response.scores_football_teams) {
                  // [ℹ] identify target team;
                  if (info_team.id.toString() === team.team_id.toString()) {
                    // [ℹ] add extra info;
                    team_obj.team_logo = info_team.data.logo_path
                  }
                }
                
                // [ℹ] get TEAM COLOR CODE;
                if (team.result != null && team.result != undefined) {
                  // [ℹ] iterate over "sport" color codes;
                  for (const sport of response.color_codes_league_standings_positions) {
                    // [ℹ] validate;
                    if (sport.sports === "football") {
                      // [ℹ] assign;
                      team_obj.color_code = sport.color_codes[team.result.toString()];
                    }
                  }
                } else {
                  team_obj.color_code = 'transparent';
                }

                // [ℹ] populate data;
                team_obj.position = parseInt(team.position.toString());
                team_obj.team_name = team.team_name;
                team_obj.games_played = team.overall.games_played.toString();
                team_obj.points = team.overall.points.toString();
                // [ℹ] add team to list of THIS SEASON-LEAGUE;
                season_league_obj.season_league_teams.push(team_obj)
              }
                
              // [ℹ] add to the gloabal cache data:
              season_league_cache.top_leagues_table_data.push(season_league_obj)
            }
          }
        }
        
        // [ℹ] terminating condition;
        if (season_league_cache.top_leagues_table_data != undefined && 
          season_league_cache.top_leagues_table_data.length > 7) {
            break;
        }
      }

      // [ℹ] terminating condition;
      if (season_league_cache.top_leagues_table_data != undefined && 
        season_league_cache.top_leagues_table_data.length > 7) {
          break;
      }
    }

    // [ℹ] push to final object;
    finalObj.push(season_league_cache);
  }

  return finalObj
}

async function mainLang(): Promise < Leagues_Table_SEO_Cache_Ready > {

  const response: Hasura_Complete_Leagues_Table_Type = await initGrapQLClient().request(GET_LEAGUES_TABLE_DATA);

  const season_league_cache_main: Leagues_Table_SEO_Cache_Ready = {
    top_leagues_table_data: [],
    translations: []
  }

  // [ℹ] assign translations;
  season_league_cache_main.translations = response.scores_standings_home_widget_translations

  // [ℹ] for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {

    // [ℹ] select-top-8-leagues;
    const season_league_cache: Leagues_Table_Cache_Ready = {
      lang: undefined,              // ... ❌ not used;
      top_leagues_table_data: [],
      translations: []              // ... ❌ not used;
    }

    // [ℹ] declare language (GEO);
    season_league_cache.lang = country_leagues.lang

    if (season_league_cache.lang == 'en') {

      // [ℹ] iterate over each country-league;
      for await (const country_league of country_leagues.leagues) {

        // [ℹ] iterate over each top-goal-scorer;
        for (const season_league of response.scores_football_standings) {
          
          // [ℹ] match_league_ids && match correct-lang;
          if (season_league.id.toString() === country_league.league_id.toString()) {

            // [ℹ] iterate over the "season_league" [filtered] data;
            for (const season_type of season_league.data) {

              // [ℹ] and select the "Regular Season" only!
              if (season_type.name.toString() === "Regular Season") {

                // [ℹ] instantiate the SEASON-LEAGUE OBJECT CACHE;
                const season_league_obj: Single_League_Table_Data = {
                  season_league_id: undefined,
                  season_league_name: undefined,
                  season_league_teams: []
                }

                // [ℹ] populate data;
                season_league_obj.season_league_id = season_league.id.toString()
                season_league_obj.season_league_name = season_league.name.toString()

                // [ℹ] iterate over THIS standing "teams";
                for (const team of season_type.standings.data) {

                  // [ℹ] instantiate the TEAM OBJECT CACHE;
                  const team_obj: Single_Team_Object_Data = {
                    position: undefined,
                    team_logo:  undefined,
                    team_name: undefined,
                    games_played: undefined,
                    points: undefined
                  }

                  // [ℹ] iterate over TEAMS DATA for EXTRA INFO;
                  for (const info_team of response.scores_football_teams) {

                    // [ℹ] identify target team;
                    if (info_team.id.toString() === team.team_id.toString()) {
                      // [ℹ] add extra info;
                      team_obj.team_logo = info_team.data.logo_path
                    }

                  }

                  // [ℹ] populate data;
                  team_obj.position = parseInt(team.position.toString());
                  team_obj.team_name = team.team_name;
                  team_obj.games_played = team.overall.games_played.toString();
                  team_obj.points = team.overall.points.toString();
                  // [ℹ] add team to list of THIS SEASON-LEAGUE;
                  season_league_obj.season_league_teams.push(team_obj)

                }
                
                // [ℹ] add to the gloabal cache data:
                season_league_cache.top_leagues_table_data.push(season_league_obj)
              }
            }
          }

          // [ℹ] terminating condition;
          if (season_league_cache.top_leagues_table_data != undefined && 
            season_league_cache.top_leagues_table_data.length > 7) {
              break;
          }
        }
        // [ℹ] terminating condition;
        if (season_league_cache.top_leagues_table_data != undefined && 
          season_league_cache.top_leagues_table_data.length > 7) {
          break;
        }
      }
      
      // [ℹ] add to main list;
      season_league_cache_main.top_leagues_table_data = [...season_league_cache_main.top_leagues_table_data, ...season_league_cache.top_leagues_table_data];
    }
  }

  return season_league_cache_main
}