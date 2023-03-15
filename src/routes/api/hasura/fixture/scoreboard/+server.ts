//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';


import { B_FS_compile_data, B_FS_generate_historic_fixtures_map, B_FS_generate_leagues_tournaments_map, B_FS_get_target_leagues, B_SF_get_target_fixture } from '@betarena/scores-lib/dist/functions/func.scoreboard.js';
import type { SF_Info } from '@betarena/scores-lib/types/scoreboard';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
// const logs = [];

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

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
 * @description [MAIN] method - relying on Fixture Id;
 * @param _fixture_id 
 * @returns Promise<SF_Info | null>
 */
async function main(
	_fixture_id: string
): Promise<SF_Info | null> {

	const FIXTURE_ID = parseInt(_fixture_id);

	const h_fixtures_arr = await B_SF_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID
	);
	// [ℹ] exit
	if (h_fixtures_arr == undefined) {
		return null;
	}

  const historic_fixtures_map = await B_FS_generate_historic_fixtures_map(
    h_fixtures_arr
  )

	const league_id = h_fixtures_arr[0]?.league_id;

	const [
    league_data, 
    tournaments_data
  ] =
		await B_FS_get_target_leagues(
    graphQlInstance,
    [league_id]
	);
  
  const [
    league_map,
    tournaments_map
  ] = await B_FS_generate_leagues_tournaments_map(
    league_data,
    tournaments_data
  )

  const cache_data_arr = await B_FS_compile_data(
    historic_fixtures_map,
    league_map,
    tournaments_map
  )

	return cache_data_arr[0];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]