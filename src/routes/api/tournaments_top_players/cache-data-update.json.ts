import { dev } from '$app/env'

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import fs from 'fs';

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
  REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_CONST_DATA, 
  REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_DYNAMIC_DATA 
} from '$lib/graphql/tournaments/top_players/query';

import type { 
  BETARENA_HASURA_scores_football_players, 
  BETARENA_HASURA_scores_football_teams 
} from '$lib/models/hasura';

// [❗] critical
import Bull from 'bull';

const cacheQueueTourTopPlay = new Bull('cacheQueueTourTopPlay', import.meta.env.VITE_REDIS_CONNECTION_URL_BULL.toString())

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`ℹ FRONTEND_SCORES_REDIS_tournamentsTopPlayers_trigerred at: ${new Date().toDateString()}`)

  // [ℹ] producers [JOBS]
  const job = await cacheQueueTourTopPlay.add();

  return {
    status: 200,
    body: { 
      job_id: job.id,
      message: '✅ Success \ntournaments_top_players cache data updated!'
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

async function cacheTranslationData (lang: string, json_cache: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response) {
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

cacheQueueTourTopPlay.process (async (job, done) => {
  // console.log(job.data.argumentList);

  /* 
  do stuff
  */

  await tournamentsTopPlayersDataGeneration ()
  await tournamentsTopPlayersTGeneration ()

  return "done";
});

/**
 * [ℹ] Tournaments Page Data Generation Methods
*/

async function tournamentsTopPlayersDataGeneration () {
  
  const final_obj_array = new Map <number, REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response> ()
  
  const limit = 100;
  let offset = 0;
  let total_limit;

  // [🐛] debug [prod-handy]
  if (dev) console.log(`ℹ obtaining main const data`)
  const response_const: BETARENA_HASURA_top_players_query = await initGrapQLClient().request(
    REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_CONST_DATA,
  );
  // [🐛] debug [prod-handy]
  if (dev) console.log(`ℹ main data gathered`)

  // [ℹ] JSON-ARRAY => HASHMAP conversion
  
  // [🐛] debug [prod-handy]
  console.log(`ℹ players_map is generating!`)
  const players_map = new Map()
  for (const p of response_const.scores_football_players_dev) {
    players_map.set(p.player_id, p)
  }
  // [🐛] debug [prod-handy]
  console.log(`ℹ players_map generated! With size: ${players_map.size}`)

  // [🐛] debug [prod-handy]
  console.log(`ℹ teams_map is generating!`)
  const teams_map = new Map()
  for (const t of response_const.scores_football_teams_dev) {
    teams_map.set(t.id, t)
  }
  // [🐛] debug [prod-handy]
  console.log(`ℹ teams_map generated! With size: ${teams_map.size}`)

  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset
    }
    // [🐛] debug
    // if (dev) console.log(`ℹ variables: ${VARIABLES.limit} ${VARIABLES.offset}`)
    
    const response_seasons: BETARENA_HASURA_top_players_season_details_query = await initGrapQLClient().request(
      REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_DYNAMIC_DATA,
      VARIABLES
    );

    total_limit = response_seasons.scores_football_seasons_details_dev_aggregate.aggregate.totalCount;
    offset += limit;

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`ℹ exiting loop!`)
      break;
    }

    for (const iterator of response_const.scores_football_leagues_dev) {

      // [ℹ] per LEAGUE

      const finalCacheObj: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = { }
      finalCacheObj.seasons = []
      finalCacheObj.league_id = iterator.id;

      // [ℹ] get all seasons for (this) league (tournament-id)
      for (const season_main of iterator.seasons) {

        const season_sub = response_seasons.scores_football_seasons_details_dev
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
  }

  // [🐛] debug
  console.log(`ℹ data gathered! total leagues: ${final_obj_array.size}`)
  // [ℹ] persist Data
  const arrayObj = []
  for (const [key, value] of final_obj_array.entries()) {
    await cacheData(key, value);
    // arrayObj.push(value);
  }

  // [🐛] debug
  const data = JSON.stringify(arrayObj, null, 4)
  fs.writeFile('./datalog/tournamentsTopPlayers.json', data, err => {
    if (err) {
      console.error(err);
    }
  });

  // [🐛] debug
  if (dev) console.log(`✔ FRONTEND_SCORES_REDIS_tournamentsTopPlayers complete!`)

  return
}

async function tournamentsTopPlayersTGeneration () {
  
	const response: BETARENA_HASURA_top_players_t_query = await initGrapQLClient().request(HASURA_BETARENA_QUERY_TOP_PLAYERS_T);

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
  const data = JSON.stringify(final_obj_array, null, 4)
  fs.writeFile('./datalog/tournamentsTopPlayersTGeneration.json', data, err => {
    if (err) {
      console.error(err);
    }
  });

  return
}