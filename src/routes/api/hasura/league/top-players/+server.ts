//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { extract_playerId_and_teamId, generateTeamsAndPlayersMap, generate_top_players_data, getTargetSeasonPlayersInfo, get_target_teams_players_data } from '@betarena/scores-lib/dist/functions/func.top-players.js';
import type { TP_Season_Top_Player } from '@betarena/scores-lib/types/top-players';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
const logs = [];

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise<unknown> {
	const seasonId: string = req.url['searchParams'].get('seasonId');
	const target_season_top_players = await main(
		seasonId
	);
	return json(target_season_top_players);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(
	_seasonId: string
): Promise<TP_Season_Top_Player | null> {

	// [ℹ] relying on Season_ID
	// [ℹ] to get ALL TOP PLAYERS
	// [ℹ] for THIS season
	// [ℹ] and return

	const SEASON_ID = parseInt(_seasonId);

  // [ℹ] [GET] target [CURRENT] seasons / league
  // [⚠] warning, heavy query, pagination based
  const season_details_map = await getTargetSeasonPlayersInfo(
    graphQlInstance,
    [SEASON_ID]
  )

  // [ℹ] exit, condition
  if (season_details_map.size == 0) {
    console.log("No current seasons to update");
    console.log("Exiting")
    return;
  }

  const [
    unique_teamIdsArr, 
    unique_playerIdsArr
  ] = await extract_playerId_and_teamId(
    season_details_map
  )

  const players_teams_data = await get_target_teams_players_data(
    graphQlInstance,
    unique_teamIdsArr, 
    unique_playerIdsArr
  );

  // [ℹ] JSON-ARRAY => HASHMAP conversions
  const [
    players_map, 
    teams_map
  ] = await generateTeamsAndPlayersMap(
    players_teams_data
  )

  const final_obj_array = await generate_top_players_data(
    season_details_map,
    players_map, 
    teams_map
  )

	// [ℹ] return top-players data for (THIS) target season
	return final_obj_array[0];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]