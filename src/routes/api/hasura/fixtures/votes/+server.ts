//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import { VOT_F_data_main, VOT_F_get_target_fixture } from '@betarena/scores-lib/dist/functions/func.votes.js';

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
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
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

	const fixtureArray = await VOT_F_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID
	);
	// [ℹ] exit
	if (fixtureArray == undefined) {
		return null;
	}

	const cache_data_arr = await VOT_F_data_main(
    fixtureArray
  )

	return cache_data_arr[0];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]