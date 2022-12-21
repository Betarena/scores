import { dev } from '$app/environment';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import {
  REDIS_CACHE_TOP_PLAYERS_ST_DATA_2,
  REDIS_CACHE_TOP_PLAYERS_ST_DATA_3,
} from '$lib/graphql/tournaments/top_players/query';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import { performance } from 'perf_hooks';

import type { BETARENA_HASURA_scores_football_players, BETARENA_HASURA_scores_football_teams, BETARENA_HASURA_scores_football_seasons_details } from '$lib/models/hasura';
import type { Tournament_Season_Top_Player, Top_player_ratings, Top_player_goalscorers, Top_player_assits, Top_player_total_shots, BETARENA_HASURA_top_players_season_details_query, BETARENA_HASURA_top_players_query } from '$lib/models/tournaments/top_players/types';

// [ℹ] debug info
const logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise < unknown > {

  const seasonId: string = req.url['searchParams'].get('seasonId');

  const target_season_top_players = await main(seasonId)

  return json(target_season_top_players)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main (
  _seasonId: string
): Promise < Tournament_Season_Top_Player | null > {

  // [ℹ] relying on Season_ID
  // [ℹ] to get ALL TOP PLAYERS
  // [ℹ] for THIS season
  // [ℹ] and return

  const SEASON_ID = parseInt(_seasonId)

  /**
   * [ℹ] obtain target season top player data
  */

  // [ℹ] [GET] target [CURRENT] seasons / league
  // [⚠] warning, heavy query, pagination based
  const response = await getTargetSeasonPlayersInfo ([SEASON_ID])

  // [ℹ] exit (condition)
  if (response.length == 0 
    || response == undefined) {
    console.log(`Target season ${SEASON_ID} current seasons to update`);
    console.log(`Exiting`)
    return;
  }

  // [ℹ] obtain target teamsIds[] + playersIds[]
  const [teamIdsArr, playerIdsArr] = await getTeamsAndPlayersIds (
    response
  )
 
  // [ℹ] [GET] target teams / players
  const response3 = await getTargetTeamsAndPlayers (
    teamIdsArr, 
    playerIdsArr
  );
 
  // [ℹ] JSON-ARRAY to HASHMAP
  const [players_map, teams_map] = await generateTeamsAndPlayersMap (
    response3
  )
 
  /**
  * [ℹ] MAIN
  * [ℹ] for (THIS) season, generate data
  */

  const season_data = response[0];
 
  const season_top_player_obj: Tournament_Season_Top_Player = { }
  season_top_player_obj.season_id = season_data?.id
  season_top_player_obj.top_players_rating = []  
  season_top_player_obj.top_players_goals = []
  season_top_player_obj.top_players_assists = []
  season_top_player_obj.top_players_total_shots = []

  if (season_data.squad !== null
    && season_data.squad.length != 0) {
      
    for (const season_team of season_data.squad) {
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

  if (season_data.goalscorers !== null
    && season_data.goalscorers.length != 0) {

    for (const season_goalscorer of season_data.goalscorers) {

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

  if (season_data.assistscorers !== null
    && season_data.assistscorers.length != 0) {
    
    for (const season_assistscorer of season_data.assistscorers) {

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

  if (season_data.squad !== null
    && season_data.squad.length != 0) {
    for (const season_team of season_data.squad) {
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

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(season_top_player_obj, null, 4)
    fs.writeFile('./datalog/hasura-season_top_player_obj.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  // [ℹ] return top-players data for (THIS) target season
  return season_top_player_obj;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

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
  logs.push(`${queryName}`);
  // eslint-disable-next-line no-constant-condition
  while (true) {

    // [🐛] debug
    // if (dev) console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)
    
    const VARIABLES = {
      limit,
      offset,
      seasonIds: seasonIdsArr
    }

    const response: BETARENA_HASURA_top_players_season_details_query = await initGrapQLClient().request (
      REDIS_CACHE_TOP_PLAYERS_ST_DATA_2,
      VARIABLES
    );

    // [🐛] debug
    /*
      for (const fixture of response.historic_fixtures) {
        if (fixture.id === 18535056) {
          console.log("Here! Found it!")
        }
      }
    */

    season_details_arr = season_details_arr.concat(response.scores_football_seasons_details)

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`exiting loop!`)
      logs.push(` ↳ total limit: ${total_limit}`)
      logs.push(` ↳ total seasons: ${season_details_arr.length}`)
      logs.push(` ↳ exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.scores_football_seasons_details_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  const t1 = performance.now();
  logs.push(` ↳ ${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return season_details_arr;
}

async function getTeamsAndPlayersIds (
  data: BETARENA_HASURA_scores_football_seasons_details[]
): Promise < [ number[], number[] ] > {

  const methodName = "getTeamsAndPlayersIds"
  logs.push(`${methodName}`);

  let teamIdsArr: number[] = []
  let playerIdsArr: number[] = []

  for await (const season of data) {
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
  logs.push(` ↳ num. of playerIdsArr: ${playerIdsArr.length}`);
  logs.push(` ↳ num. of teamIdsArr: ${teamIdsArr.length}`);

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
  logs.push(`${queryName}`);
  const response: BETARENA_HASURA_top_players_query = await initGrapQLClient().request (
    REDIS_CACHE_TOP_PLAYERS_ST_DATA_3,
    VARIABLES
  );
  const t1 = performance.now();
  logs.push(` ↳ ${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function generateTeamsAndPlayersMap (
  data: BETARENA_HASURA_top_players_query
): Promise < [ Map < number, BETARENA_HASURA_scores_football_players >, Map < number, BETARENA_HASURA_scores_football_teams > ] > {

  const methodName = "generateTeamsAndPlayersMap"
  logs.push(`${methodName}`);

  const t0 = performance.now();
  const players_map = new Map < number, BETARENA_HASURA_scores_football_players > ()
  for await (const p of data.scores_football_players) {
    players_map.set(p.player_id, p)
  }
  const teams_map = new Map < number, BETARENA_HASURA_scores_football_teams > ()
  for await (const t of data.scores_football_teams) {
    teams_map.set(t.id, t)
  }
  const t1 = performance.now();
  logs.push(` ↳ players_map generated with size: ${players_map.size}`)
  logs.push(` ↳ teams_map generated with size: ${teams_map.size}`)
  logs.push(` ↳ hashmap conversion: ${(t1 - t0) / 1000} sec`);

  return [
    players_map,
    teams_map
  ]
}