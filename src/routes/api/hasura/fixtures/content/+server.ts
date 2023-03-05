//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import { CONT_F_get_target_fixture } from '@betarena/scores-lib/dist/functions/func.content.js';

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

export async function GET(req): Promise<unknown> {
	const lang: string = req.url['searchParams'].get('lang');
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
	const target_season_fixtures = await main(
		fixture_id,
		lang
	);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(
	_fixture_id: string,
	_lang: string
): Promise< unknown[] | null> {

	const FIXTURE_ID = parseInt(_fixture_id);
	const LANG = _lang;

	const fixture = await CONT_F_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID,
		LANG
	);
	// [ℹ] exit
	if (fixture == undefined) {
		return null;
	}

	return fixture;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]