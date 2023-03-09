//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';

import { LIN_F_data_main, LIN_F_generate_historic_fixtures_map, LIN_F_generate_players_map, LIN_F_get_target_fixture, LIN_F_get_target_player_data } from '@betarena/scores-lib/dist/functions/func.lineups.js';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
const logs = [];

//#endregion ➤ [VARIABLES] Imports

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise<unknown> {
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
	const target_season_fixtures = await main(
		fixture_id
	);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description [MAIN] method - obtains target
 * data on a specific fixture-id of its statistics
 * information;
 * @version 1.0
 * @param {string} _fixture_id 
 * @returns Promise < unknown | null >
 */
async function main(
	_fixture_id: string
): Promise<unknown | null> {

	const FIXTURE_ID = parseInt(_fixture_id);

	const h_fixtures_arr = await LIN_F_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID
	);
	// [ℹ] (validation) exit;
	if (h_fixtures_arr == undefined) {
		return null;
	}

  const historic_fixtures_map = await LIN_F_generate_historic_fixtures_map(
    h_fixtures_arr
  )

  // [ℹ] obtain target football_players ID's
  let football_player_ids: number[] = []
  for (const fixture of historic_fixtures_map.values()) {
    const lineup_ids = fixture?.lineup_j.map(p => p?.player_id)
    const bench_ids = fixture?.bench_j.map(p => p?.player_id)
    // const subs_ids = [
    //   ...fixture.substitutions_j.map(p => p.player_in_id),
    //   ...fixture.substitutions_j.map(p => p.player_out_id)
    // ]
    football_player_ids = [
      ...new Set(football_player_ids.concat(lineup_ids.concat(bench_ids)))
    ]
  }
  
  const player_data = await LIN_F_get_target_player_data(
    graphQlInstance,
    football_player_ids
  )
  const players_map = await LIN_F_generate_players_map(
    player_data
  )

  const cache_data_arr = await LIN_F_data_main(
    historic_fixtures_map,
    players_map
  )

  return cache_data_arr[0]
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]