//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';

import { INC_F_data_main, INC_F_generate_historic_fixtures_map, INC_F_get_target_fixture } from '@betarena/scores-lib/dist/functions/func.incidents.js';

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

export async function GET(req): Promise<unknown> {
	const fixture_id: string =	req?.url?.searchParams?.get('fixture_id');
	const target_season_fixtures = await main(
		fixture_id
	);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(
	_fixture_id: string
): Promise<unknown | null> {

	const FIXTURE_ID = parseInt(_fixture_id);

	const h_fixtures_arr = await INC_F_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID
	);
	// [ℹ] (validation) exit;
	if (h_fixtures_arr == undefined) {
		return null;
	}

  const historic_fixtures_map = await INC_F_generate_historic_fixtures_map(
    h_fixtures_arr
  )

  const cache_data_arr = await INC_F_data_main(
    historic_fixtures_map
  )

	return cache_data_arr[0];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]