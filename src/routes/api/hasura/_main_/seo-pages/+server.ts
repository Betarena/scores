//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';

import { SAP_GL_generate_page_players, SAP_GL_generate_seo_players, SAP_GL_get_target_player_page_data, SAP_GL_get_target_player_page_data_0, SAP_GL_get_target_player_page_data_1, SAP_GL_get_target_player_page_data_2, SAP_GL_get_target_player_page_seo } from '@betarena/scores-lib/dist/functions/func.seo-pages.js';
import type { B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/seo-pages';
import type { B_H_SFL, B_H_SFSD, B_H_SFT, B_H_ST } from 'node_modules/@betarena/scores-lib/types/hasura';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise<unknown> {

	const lang: string = req.url['searchParams'].get('lang');
  const page: 'player' | string = req.url['searchParams'].get('page');
	const player_id: string = req.url['searchParams'].get('player_id');

  // NOTE: player (page) data;
  if (player_id) {
    const _player_id: number = parseInt(player_id)
    const data = await main_player_page_data(
      _player_id
    );
    return json(data);
  }

  // NOTE: player (page) SEO;
  if (lang && page == 'player') {
    const data = await main_player_page_seo(
      lang
    );
    return json(data);
  }

	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description [MAIN] method - for players
 * page main initial data gather;
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} player_id
 * @returns Promise < B_SAP_PP_D >
 */
async function main_player_page_data (
  player_id: number
): Promise < B_SAP_PP_D > {


  // [ℹ] get target player & the team-id;
  const res = await SAP_GL_get_target_player_page_data (
    graphQlInstance, 
    player_id
  )
  res?.scores_football_players_v2[0]?.teams_j.sort((a,b) => b?.id - a?.id)
  const today = new Date();
  let team_id = res?.scores_football_players_v2[0]?.teams_j
    ?.find(({ end, start }) => 
      new Date(end).getTime() > today.getTime()
      && new Date(start).getTime() < today.getTime()
    )?.team_id
  ;
  // default (fallback) to first-available team-id
  if (team_id == undefined) team_id = res?.scores_football_players_v2[0]?.teams_j[0].team_id

  // console.log('team_id', team_id)

  // [ℹ] obtain target team & the current-season-id;
  const res_0 = await SAP_GL_get_target_player_page_data_0 (
    graphQlInstance, 
    team_id
  )
  const season_id = res_0[0]?.current_season_id_j

  // console.log('season_id', season_id)
  
  // [ℹ] obtain target season & the league-id;
  const res_1 = await SAP_GL_get_target_player_page_data_1 (
    graphQlInstance, 
    season_id
  )
  const league_id = res_1[0]?.league_id

  // console.log('league_id', league_id)
    
  // [ℹ] obtain target league;
  const [
    leagues_array,
    tournaments_array
  ] = await SAP_GL_get_target_player_page_data_2 (
    graphQlInstance, 
    [league_id]
  )

  // [ℹ] map of scores_football_teams
  const teams_map = new Map < number, B_H_SFT > ()
  for (const item of res_0) {
    teams_map.set(item?.id, item)
  }

  // [ℹ] map of scores_football_season_details
  const season_map = new Map < number, B_H_SFSD > ()
  for (const item of res_1) {
    season_map.set(item?.id, item)
  }

  // [ℹ] map of scores_leagues
  const leagues_map = new Map < number, B_H_SFL > ()
  for (const item of leagues_array) {
    leagues_map.set(item?.id, item)
  }
  
  // [ℹ] map of scores_tournaments
  const tournament_map = new Map < number, B_H_ST > ()
  for (const item of tournaments_array) {
    tournament_map.set(item?.tournament_id, item)
  }

  // const DATA2 = JSON.stringify(Array.from(tournament_map.values()), null, 4)
  // console.log('DATA2DATA', DATA2)
  
  // [ℹ] map of player data generation;
  const map = await SAP_GL_generate_page_players (
    res,
    teams_map,
    season_map,
    leagues_map,
    tournament_map
  )

  // const DATA = JSON.stringify(Array.from(map.values()), null, 4)
  // console.log('DATA', DATA)

  if (map.size == 0) {
    return null
  }
  
	return map.get(player_id);
}

/**
 * @description [MAIN] method - obtain target
 * player (page) SEO data for a target languages array;
 * @param {string} lang 
 * @returns Promise < B_SAP_PP_T >
 */
async function main_player_page_seo (
  lang: string
): Promise < B_SAP_PP_T > {

  const res = await SAP_GL_get_target_player_page_seo(
    graphQlInstance, 
    [lang]
  )

  const map = await SAP_GL_generate_seo_players(
    res,
    [lang]
  )

	return map.get(lang);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]