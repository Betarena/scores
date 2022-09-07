import { dev } from '$app/env'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { 
  REDIS_CACHE_TOP_PLAYERS_ST_DATA_1,
  REDIS_CACHE_TOP_PLAYERS_ST_DATA_3,
  REDIS_CACHE_TOP_PLAYERS_ST_DATA_2
} from '$lib/graphql/tournaments/top_players/query';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import fs from 'fs';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_top_players_query, 
  BETARENA_HASURA_top_players_season_details_query, 
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response, 
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
import type { 
  BACKEND_tournament_standings_surgical_update 
} from '$lib/models/tournaments/standings/types';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourTopPlay = new Bull (
  'cacheQueueTourTopPlay', 
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
const cacheQueueProcessName = "cacheQueueTourTopPlay"
const cacheTarget = "REDIS CACHE | tournament top_players surgical"
let logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST(
  { request }
): Promise < unknown > {

  const body = await request.json();
  if (dev) console.log(body);
  const dataSurgical = JSON.parse(JSON.stringify(body));

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    await surgicalDataUpdate(dataSurgical);

    for (const log of logs) {
      console.log(log)
    }

    return json({
      job_id: cacheTarget + " done!"
    })
  }
  // [ℹ] otherwise prod.
  else {
    // [ℹ] producers [JOBS]
    const job = await cacheQueueTourTopPlay.add(dataSurgical, { timeout: 300000 });
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function surgicalDataUpdate (
  dataUpdate: BACKEND_tournament_standings_surgical_update
) {

  /*
    [ℹ] surgical data breakdown
  */
  if (dataUpdate === undefined) {
    logs.push(`dataUpdate is undefined`)
    logs.push(`dataUpdate: ${dataUpdate}`)
    console.log("dataUpdate undefined!")
    return;
  }
  if (dataUpdate.leagueSeasons === undefined) {
    logs.push(`dataUpdate.leagueSeasons is undefined`)
    logs.push(`dataUpdate.leagueSeasons: ${dataUpdate?.leagueSeasons}`)
    console.log("dataUpdate.leagueSeasons undefined!")
    return;
  }
  const leagueIdsArr = dataUpdate.leagueSeasons.map(a => a.leagueId);

  logs.push(`num. of leagueIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of seasonIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of teamsIds: ${dataUpdate.teamsList.length}`);

  // [ℹ] [GET] target leagues
  const response = await getTargetLeagues (leagueIdsArr)

  // [ℹ] obtain target seasonsId[]
  const seasonIdsArr = await obtainTargetSeasonIds (response)

  // [ℹ] [GET] target seasons / league
  // [⚠] warning, heavy query, pagination based
  const response2 = await getTargetSeasonPlayersInfo (seasonIdsArr)

  // [ℹ] obtain target teamsId[] + playersId[]
  const [teamIdsArr, playerIdsArr] = await getTeamsAndPlayersIds (response2)

  // [ℹ] [GET] target teams / players
  const response3 = await getTargetTeamsAndPlayers (
    teamIdsArr, 
    playerIdsArr
  );

  // [ℹ] JSON-ARRAY => HASHMAP conversions
  const [players_map, teams_map] = await generateTeamsAndPlayersMap (response3)

  const final_obj_array = new Map <number, REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response> ()

  /**
   * [ℹ] MAIN
   * [ℹ] generate per LeagueId
  */

  for (const iterator of response.scores_football_leagues_dev) {

    const finalCacheObj: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = { }
    finalCacheObj.seasons = []
    finalCacheObj.league_id = iterator.id;

    // [ℹ] get all seasons for (this) league (tournament-id)
    for (const season_main of iterator.seasons) {

      const season_sub = response2
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

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTargetLeagues (
  leagueIdsArr: number[]
): Promise < BETARENA_HASURA_top_players_query > {

  const VARIABLES = {
    leagueIds: leagueIdsArr
  }

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_TOP_PLAYERS_ST_DATA_1";
  const response: BETARENA_HASURA_top_players_query = await initGrapQLClient().request (
    REDIS_CACHE_TOP_PLAYERS_ST_DATA_1,
    VARIABLES
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function obtainTargetSeasonIds (
  data: BETARENA_HASURA_top_players_query
): Promise < number[] > {
  
  let seasonIdsArr: number[] = []

  for (const league of data.scores_football_leagues_dev) {
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

  return seasonIdsArr;
}

async function getTargetSeasonPlayersInfo (
  seasonIdsArr: number[]
): Promise < BETARENA_HASURA_scores_football_seasons_details[] > {

  const limit = 100;
  let offset = 0;
  let total_limit;

  let season_details_arr: BETARENA_HASURA_scores_football_seasons_details[] = [] 
  // const historic_fixtures_map = new Map <number, BETARENA_HASURA_historic_fixtures> ()
  let counter = 0

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_TOP_PLAYERS_ST_DATA_2";
  // eslint-disable-next-line no-constant-condition
  while (true) {

    // [🐛] debug
    // if (dev) console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)
    
    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }

    const response: BETARENA_HASURA_top_players_season_details_query = await initGrapQLClient().request (
      REDIS_CACHE_TOP_PLAYERS_ST_DATA_2,
      VARIABLES
    );

    // [🐛] debug
    /*
      for (const fixture of response.historic_fixtures_dev) {
        if (fixture.id === 18535056) {
          console.log("Here! Found it!")
        }
      }
    */

    season_details_arr = season_details_arr.concat(response.scores_football_seasons_details_dev)

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`exiting loop!`)
      logs.push(`total limit: ${total_limit}`)
      logs.push(`fixtures gathered: ${season_details_arr.length}`)
      logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.scores_football_seasons_details_dev_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return season_details_arr;
}

async function getTeamsAndPlayersIds (
  data: BETARENA_HASURA_scores_football_seasons_details[]
): Promise < [ number[], number[] ] > {

  let teamIdsArr: number[] = []
  let playerIdsArr: number[] = []

  for (const season of data) {
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

  return [
    teamIdsArr,
    playerIdsArr
  ]
}

async function getTargetTeamsAndPlayers (
  teamIdsArr:   number[],
  playerIdsArr: number[]
): Promise < BETARENA_HASURA_top_players_query >  {

  const VARIABLES = {
    teamIds: teamIdsArr,
    playerIds: playerIdsArr
  }

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_TOP_PLAYERS_ST_DATA_3";
  const response: BETARENA_HASURA_top_players_query = await initGrapQLClient().request (
    REDIS_CACHE_TOP_PLAYERS_ST_DATA_3,
    VARIABLES
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