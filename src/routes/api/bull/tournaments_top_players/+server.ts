import { dev } from '$app/env'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { 
  REDIS_CACHE_TOP_PLAYERS_DATA_1, REDIS_CACHE_TOP_PLAYERS_DATA_2, REDIS_CACHE_TOP_PLAYERS_DATA_3 
} from '$lib/graphql/tournaments/top_players/query';
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_top_players_query, 
  BETARENA_HASURA_top_players_season_details_query, 
  BETARENA_HASURA_top_players_t_query, 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response, 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response, 
  Top_player_assits, 
  Top_player_goalscorers, 
  Top_player_ratings, 
  Top_player_total_shots,
  Tournament_Season_Top_Player 
} from '$lib/models/tournaments/top_players/types';

import type { 
  BETARENA_HASURA_scores_football_players, 
  BETARENA_HASURA_scores_football_seasons_details, 
  BETARENA_HASURA_scores_football_teams 
} from '$lib/models/hasura';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourTopPlayAll = new Bull (
  'cacheQueueTourTopPlayAll', 
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
const cacheQueueProcessName = "cacheQueueTourTopPlayAll"
const cacheTarget = "REDIS CACHE | tournament top_players (all)"
let logs = []


// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST(): Promise < unknown > {

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    await tournamentsTopPlayersDataGeneration ()
    await tournamentsTopPlayersTGeneration ()
    
    for (const log of logs) {
      console.log(log)
    }

    return {
      status: 200,
      body: { 
        job_id: cacheTarget + " done!"
      }
    }
  }
  // [ℹ] otherwise prod.
  else {
    // [ℹ] producers [JOBS]
    const job = await cacheQueueTourTopPlayAll.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return {
      status: 200,
      body: { 
        job_id: job.id
      }
    }
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheData (
  league_id: number, 
  json_cache: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response
) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('tournament_top_players_data', league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache tournament_top_players_data', e);
  }
}

async function cacheTranslationData (
  lang: string, 
  json_cache: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response
) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('tournament_top_player_t', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache tournament_top_player_t', e);
  }
}

// [ℹ] DEPRECEATED CACHE DELETE (13/07/2022)

async function deleteCacheTournamentsStandingsData () {
  await redis.del('tournament_top_players_data')
  return
}

async function deleteStandingsTranslationData () {
  await redis.del('tournament_top_player_t')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueTourTopPlayAll.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  await tournamentsTopPlayersDataGeneration ()
  await tournamentsTopPlayersTGeneration ()
  const t1 = performance.now();

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function tournamentsTopPlayersDataGeneration () {

  const response = await getTarget ();

  // [ℹ] JSON-ARRAY => HASHMAP conversions
  const [players_map, teams_map] = await generateTeamsAndPlayersMap (response)

  const final_obj_array = new Map <number, REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response> ()

  const season_details_map = await getTargetSeasonPlayersInfo ()

  /**
   * [ℹ] MAIN
   * [ℹ] generate per LeagueId
  */

  for (const iterator of response.scores_football_leagues_dev) {

    // [ℹ] per LEAGUE

    const finalCacheObj: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = { }
    finalCacheObj.seasons = []
    finalCacheObj.league_id = iterator.id;

    // [ℹ] get all seasons for (this) league (tournament-id)
    for (const season_main of iterator.seasons) {

      const season_sub = season_details_map.get(season_main.id);

      if (season_sub == undefined ||
          season_sub == null) {
        continue;
      }

      const season_top_player_obj: Tournament_Season_Top_Player = { }
      season_top_player_obj.season_id = season_main.id;
      season_top_player_obj.top_players_rating = []  
      season_top_player_obj.top_players_goals = []
      season_top_player_obj.top_players_assists = []
      season_top_player_obj.top_players_total_shots = []

      if (season_sub.squad !== null &&
        season_sub.squad.length != 0) {
          
        for (const season_team of season_sub.squad) {
          for (const season_team_player of season_team.squad.data) {

            // [ℹ] ignore those players with "NaN" rating
            if (season_team_player?.rating == null || season_team_player?.rating == undefined) {
              continue;
            }

            const top_player: Top_player_ratings = { }

            const target_player: BETARENA_HASURA_scores_football_players = players_map.get(season_team_player.player_id);
            const target_team: BETARENA_HASURA_scores_football_teams = teams_map.get(season_team.id);  // [ℹ] unecessary [?];
            
            top_player.avatar = 
              target_player === undefined ||
              target_player === null 
                ? null
                : target_player.data?.image_path;

            top_player.rating =
              parseFloat(season_team_player.rating.toString());

            top_player.position =
              target_player === undefined ||
              target_player === null
                ? null
                : target_player.data?.position_id;

            top_player.player_name =
              season_team_player.player_name;
            
            top_player.team_logo = 
              target_team === undefined ||
              target_team === null
                ? null
                : target_team.data?.logo_path;
              
            top_player.rank =
              1;

            // [ℹ] ignore those players with "NaN" data
            if (top_player?.player_name == null || top_player?.position == null) {
              continue;
            }

            season_top_player_obj.top_players_rating.push(top_player);
          }

          season_top_player_obj.top_players_rating.sort((a, b) => parseFloat(b.rating.toString()) - parseFloat(a.rating.toString()));
          season_top_player_obj.top_players_rating.splice(50);
        }
      }

      if (season_sub.goalscorers !== null &&
        season_sub.goalscorers.length != 0) {

        for (const season_goalscorer of season_sub.goalscorers) {

          // [ℹ] ignore those players with "NaN" goals
          if (season_goalscorer?.goals == null || season_goalscorer?.goals == undefined) {
            continue;
          }
          
          const top_player: Top_player_goalscorers = { }

          const target_player: BETARENA_HASURA_scores_football_players = players_map.get(season_goalscorer.player_id);
          const target_team: BETARENA_HASURA_scores_football_teams = teams_map.get(season_goalscorer.team_id);  // [ℹ] unecessary [?];

          top_player.avatar = 
            target_player === undefined ||
            target_player === null 
              ? null
              : target_player.data?.image_path;

          top_player.goals =
            season_goalscorer.goals

          top_player.position =
            target_player === undefined ||
            target_player === null
              ? null
              : target_player.data?.position_id;

          top_player.player_name =
            season_goalscorer.player_name;
          
          top_player.team_logo = 
            target_team === undefined ||
            target_team === null
              ? null
              : target_team.data?.logo_path;
            
          top_player.rank =
            season_goalscorer.position;

          // [ℹ] ignore those players with "NaN" data
          if (top_player?.player_name == null || top_player?.position == null) {
            continue;
          }

          season_top_player_obj.top_players_goals.push(top_player);
        }

        season_top_player_obj.top_players_goals.sort((a, b) => parseFloat(b.goals.toString()) - parseFloat(a.goals.toString()));
        season_top_player_obj.top_players_goals.splice(50);
      }

      if (season_sub.assistscorers !== null &&
        season_sub.assistscorers.length != 0) {
        
        for (const season_assistscorer of season_sub.assistscorers) {

          // [ℹ] ignore those players with "NaN" assists
          if (season_assistscorer?.assists == null || season_assistscorer?.assists == undefined) {
            continue;
          }
        
          const top_player: Top_player_assits = { }

          const target_player: BETARENA_HASURA_scores_football_players = players_map.get(season_assistscorer.player_id);
          const target_team:  BETARENA_HASURA_scores_football_teams  = teams_map.get(season_assistscorer.team_id);  // [ℹ] unecessary [?];

          top_player.avatar = 
            target_player === undefined ||
            target_player === null 
              ? null
              : target_player.data?.image_path;

          top_player.assists =
            season_assistscorer.assists

          top_player.position =
            target_player === undefined ||
            target_player === null
              ? null
              : target_player.data?.position_id;

          top_player.player_name =
            season_assistscorer.player_name;
          
          top_player.team_logo = 
            target_team === undefined ||
            target_team === null
              ? null
              : target_team.data?.logo_path;
            
          top_player.rank =
            season_assistscorer.position;

          // [ℹ] ignore those players with "NaN" data
          if (top_player?.player_name == null || top_player?.position == null) {
            continue;
          }

          season_top_player_obj.top_players_assists.push(top_player);
        }

        season_top_player_obj.top_players_assists.sort((a, b) => parseFloat(b.assists.toString()) - parseFloat(a.assists.toString()));
        season_top_player_obj.top_players_assists.splice(50);
      }

      if (season_sub.squad !== null &&
        season_sub.squad.length != 0) {
          
        for (const season_team of season_sub.squad) {
          for (const season_team_player of season_team.squad.data) {

            // [ℹ] ignore those players with "NaN" shots_total
            if (season_team_player?.shots?.shots_total == null || season_team_player?.shots?.shots_total == undefined) {
              continue;
            }

            const top_player: Top_player_total_shots = { }

            const target_player: BETARENA_HASURA_scores_football_players = players_map.get(season_team_player.player_id);
            const target_team: BETARENA_HASURA_scores_football_teams = teams_map.get(season_team.id);  // [ℹ] unecessary [?];
            
            top_player.avatar = 
              target_player === undefined ||
              target_player === null 
                ? null
                : target_player.data?.image_path;

            top_player.total_shots =
              season_team_player?.shots?.shots_total;

            top_player.position =
              target_player === undefined ||
              target_player === null
                ? null
                : target_player.data?.position_id;

            top_player.player_name =
              season_team_player.player_name;
            
            top_player.team_logo = 
              target_team === undefined ||
              target_team === null
                ? null
                : target_team.data?.logo_path;
              
            top_player.rank =
              1;

            // [ℹ] ignore those players with "NaN" data
            if (top_player?.player_name == null || top_player?.position == null) {
              continue;
            }

            season_top_player_obj.top_players_total_shots.push(top_player);
          }

          season_top_player_obj.top_players_total_shots.sort((a, b) => parseFloat(b.total_shots.toString()) - parseFloat(a.total_shots.toString()));
          season_top_player_obj.top_players_total_shots.splice(50);
        }
      }

      finalCacheObj.seasons.push(season_top_player_obj);
    }

    if (finalCacheObj.seasons.length == 0) {
      continue;
    }

    const leagueExistsBool: boolean = final_obj_array.has(finalCacheObj.league_id)
      
    if (leagueExistsBool) {

      const leagueTarget: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = final_obj_array.get(finalCacheObj.league_id)
      leagueTarget.seasons = [...leagueTarget.seasons , ...finalCacheObj.seasons];
      leagueTarget.seasons.sort((a, b) => parseFloat(b.season_id.toString()) - parseFloat(a.season_id.toString()));
      final_obj_array.set(finalCacheObj.league_id, leagueTarget);
      continue;
    }

    finalCacheObj.seasons.sort((a, b) => parseFloat(b.season_id.toString()) - parseFloat(a.season_id.toString()));

    final_obj_array.set(finalCacheObj.league_id, finalCacheObj);
  }

  // [ℹ] persist data
  const t0 = performance.now();
  logs.push(`total leagues: ${final_obj_array.size}`)
  for (const [key, value] of final_obj_array.entries()) {
    await cacheData(key, value);
  }
  const t1 = performance.now();
  logs.push(`data cache uplaoded completed in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  if (dev) {
    const values = Array.from(final_obj_array.values());
    const data = JSON.stringify(values, null, 4)
    fs.writeFile('./datalog/tournamentsTopPlayers.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return;
}

async function tournamentsTopPlayersTGeneration () {
  
	const response: BETARENA_HASURA_top_players_t_query = await initGrapQLClient().request(
    REDIS_CACHE_TOP_PLAYERS_DATA_3
  );

  const final_obj_array: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response[] = []

  // [ℹ] generate appropiate TRANSLATIONS
  for (const main_T of response.scores_widget_top_players_translations_dev) {

    // [ℹ] per LANG
    const main_lang = main_T.lang;

    // [ℹ] locate position-player translation;
    const pos_T = response.player_positions_translations_dev
      .find(( { lang } ) => lang === main_lang);

    const noData_T = response.scores_general_translations_dev
      .find( ({ lang }) => lang === main_lang);

    const top_players_view_opt: string[] = [ "Rating", "Goals", "Assists", "Total Shots"]

    const mergeObject: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response = {
      lang: main_lang,
      ...main_T.data,
      pos_t: pos_T?.position,
      pl_view_opt: top_players_view_opt,
      no_data_t: noData_T.widgets_no_data_available
    }

    await cacheTranslationData (main_lang, mergeObject);

    final_obj_array.push(mergeObject)
  }

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(final_obj_array, null, 4)
    fs.writeFile('./datalog/tournamentsTopPlayersTGeneration.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTarget (
): Promise < BETARENA_HASURA_top_players_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_TOP_PLAYERS_DATA_2";
  const response: BETARENA_HASURA_top_players_query = await initGrapQLClient().request(
    REDIS_CACHE_TOP_PLAYERS_DATA_2,
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function generateTeamsAndPlayersMap (
  data: BETARENA_HASURA_top_players_query
): Promise < [ Map < number, BETARENA_HASURA_scores_football_players >, Map < number, BETARENA_HASURA_scores_football_teams > ] > {

  const t0 = performance.now();
  const players_map = new Map < number, BETARENA_HASURA_scores_football_players > ()
  for (const p of data.scores_football_players_dev) {
    players_map.set(p.player_id, p)
  }
  const teams_map = new Map < number, BETARENA_HASURA_scores_football_teams > ()
  for (const t of data.scores_football_teams_dev) {
    teams_map.set(t.id, t)
  }
  const t1 = performance.now();
  logs.push(`players_map generated with size: ${players_map.size}`)
  logs.push(`teams_map generated with size: ${teams_map.size}`)
  logs.push(`hashmap conversion: ${(t1 - t0) / 1000} sec`);

  return [
    players_map,
    teams_map
  ]

}

async function getTargetSeasonPlayersInfo (
): Promise < Map < number, BETARENA_HASURA_scores_football_seasons_details > > {

  const limit = 100;
  let offset = 0;
  let total_limit;

  const season_details_map = new Map <number, BETARENA_HASURA_scores_football_seasons_details> ()
  let counter = 0

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_TOP_PLAYERS_DATA_1";
  // eslint-disable-next-line no-constant-condition
  while (true) {

    // [🐛] debug
    // if (dev) console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)
    
    const VARIABLES = {
      limit: limit,
      offset: offset
    }

    const response: BETARENA_HASURA_top_players_season_details_query = await initGrapQLClient().request (
      REDIS_CACHE_TOP_PLAYERS_DATA_1,
      VARIABLES
    );

    for (const season of response.scores_football_seasons_details_dev) {
      season_details_map.set(season.id, season);
    }

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`exiting loop!`)
      logs.push(`total limit: ${total_limit}`)
      logs.push(`seasons gathered: ${season_details_map.size}`)
      logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.scores_football_seasons_details_dev_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return season_details_map;
}