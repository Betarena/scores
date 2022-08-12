import { dev } from '$app/env'

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';


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

import { 
  HASURA_BETARENA_QUERY_TOP_PLAYERS_T,
  HASURA_GET_TARGET_LEAGUES,
  HASURA_GET_TARGET_SEASONS,
  HASURA_GET_TARGET_TEAMS_AND_PLAYERS,
  REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_CONST_DATA, 
  REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_DYNAMIC_DATA 
} from '$lib/graphql/tournaments/top_players/query';

import type { 
  BETARENA_HASURA_scores_football_players, 
  BETARENA_HASURA_scores_football_teams 
} from '$lib/models/hasura';

import { performance } from 'perf_hooks';
import fs from 'fs';

// [❗] critical
import Bull from 'bull';
import type { BACKEND_tournament_standings_surgical_update } from '$lib/models/tournaments/standings/types';
const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourTopPlay = new Bull('cacheQueueTourTopPlay', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    }
  }, 
  settings
);

const cacheTarget = "REDIS CACHE | tournament top_players surgical"
let logs = []

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post({ request }): Promise < unknown > {

  const body = await request.json();
  if (dev) console.log(body);
  const dataSurgical = JSON.parse(JSON.stringify(body));
  
  // [ℹ] job producers
  const job = await cacheQueueTourTopPlay.add(dataSurgical);

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
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheData (league_id: number, json_cache: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('tournament_top_players_data', league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache tournament_top_players_data', e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueTourTopPlay.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  await surgicalDataUpdate (job.data);
  const t1 = performance.now();

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

cacheQueueTourTopPlay.on('active', async (job) => {
  await sleep(600000);
  const completed: boolean = await job.isCompleted()
  const streamLogs: string = logs.toString().replace(/,/g," ");
  if (!completed) {
    await job.discard()
    await job.moveToFailed(new Error(streamLogs))
  }
});

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * [ℹ] Tournaments Page Data Generation Methods
*/

async function surgicalDataUpdate (dataUpdate: BACKEND_tournament_standings_surgical_update) {

  // [ℹ] debug info
  let t0;
  let t1;

  /*
    [ℹ] surgical data breakdown
  */

  const leagueIdsArr = dataUpdate.leagueSeasons.map(a => a.leagueId);

  logs.push(`num. of leagueIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of seasonIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of teamsIds: ${dataUpdate.teamsList.length}`);

  // [ℹ] [GET] target leagues

  const VARIABLES_1 = {
    leagueIds: leagueIdsArr
  }

  t0 = performance.now();
  const queryName = "HASURA_GET_TARGET_LEAGUES";
  const response: BETARENA_HASURA_top_players_query = await initGrapQLClient().request (
    HASURA_GET_TARGET_LEAGUES,
    VARIABLES_1
  );
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  // [ℹ] obtain target seasons []

  let seasonIdsArr: number[] = []
  for (const league of response.scores_football_leagues) {
    for (const season_main of league.seasons) {
      seasonIdsArr.push(season_main.id);
    }
  }
  // console.log(teamIdsArr.includes(undefined))
  seasonIdsArr = seasonIdsArr.filter(element => {
    return element !== undefined
  });
  seasonIdsArr = [...new Set(seasonIdsArr)]
  logs.push(`num. of seasonIdsArr: ${seasonIdsArr.length}`);

  // [ℹ] [GET] target seasons / league

  const VARIABLES_2 = {
    seasonIds: seasonIdsArr
  }

  t0 = performance.now();
  const queryName2 = "HASURA_GET_TARGET_SEASONS";
  const response2: BETARENA_HASURA_top_players_season_details_query = await initGrapQLClient().request (
    HASURA_GET_TARGET_SEASONS,
    VARIABLES_2
  );
  t1 = performance.now();
  logs.push(`${queryName2} completed in: ${(t1 - t0) / 1000} sec`);

  // [ℹ] obtain target teams[] + players[]

  let teamIdsArr: number[] = []
  let playerIdsArr: number[] = []
  for (const season of response2.scores_football_seasons_details) {
    // console.log(`season: ${season.id}`)
    if (season?.squad !== null) {
      for (const team of season.squad) {
        // console.log(`team: ${team.id}`)
        teamIdsArr.push(team.id)
        for (const player of team.squad.data) {
          playerIdsArr.push(player.player_id);
        }
      }
    }
  }
  playerIdsArr = playerIdsArr.filter(element => {
    return element !== undefined
  });
  teamIdsArr = teamIdsArr.filter(element => {
    return element !== undefined
  });
  playerIdsArr = [...new Set(playerIdsArr)]
  teamIdsArr = [...new Set(teamIdsArr)]
  logs.push(`num. of playerIdsArr: ${playerIdsArr.length}`);
  logs.push(`num. of teamIdsArr: ${teamIdsArr.length}`);

  // [ℹ] [GET] target teams / players

  const VARIABLES_3 = {
    teamIds: teamIdsArr,
    playerIds: playerIdsArr
  }

  t0 = performance.now();
  const queryName3 = "HASURA_GET_TARGET_TEAMS_AND_PLAYERS";
  const response3: BETARENA_HASURA_top_players_query = await initGrapQLClient().request (
    HASURA_GET_TARGET_TEAMS_AND_PLAYERS,
    VARIABLES_3
  );
  t1 = performance.now();
  logs.push(`${queryName3} completed in: ${(t1 - t0) / 1000} sec`);

  /*
    [ℹ] JSON-ARRAY => HASHMAP conversions
  */

  t0 = performance.now();
  const players_map = new Map()
  for (const p of response3.scores_football_players) {
    players_map.set(p.player_id, p)
  }
  const teams_map = new Map()
  for (const t of response3.scores_football_teams) {
    teams_map.set(t.id, t)
  }
  t1 = performance.now();
  logs.push(`players_map generated with size: ${players_map.size}`)
  logs.push(`teams_map generated with size: ${teams_map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  const final_obj_array = new Map <number, REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response> ()

  // [ℹ] MAIN
  // [ℹ] generate per LeagueId
  for (const iterator of response.scores_football_leagues) {

    const finalCacheObj: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = { }
    finalCacheObj.seasons = []
    finalCacheObj.league_id = iterator.id;

    // [ℹ] get all seasons for (this) league (tournament-id)
    for (const season_main of iterator.seasons) {

      const season_sub = response2.scores_football_seasons_details
        .find(( { id, league_id } ) =>
          league_id === season_main.league_id && 
          id === season_main.id
        )

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

  // [ℹ] persist cache data to redis
  const arrayObj = []
  t0 = performance.now();
  logs.push(`total leagues: ${final_obj_array.size}`)
  for (const [key, value] of final_obj_array.entries()) {
    await cacheData(key, value);
    // arrayObj.push(value);
  }
  t1 = performance.now();
  logs.push(`data cache uplaoded completed in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(arrayObj, null, 4)
    fs.writeFile('./datalog/tournamentsTopPlayers.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return;
}