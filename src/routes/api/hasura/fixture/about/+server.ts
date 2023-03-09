//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { ABT_F_get_target_fixture } from '@betarena/scores-lib/dist/functions/func.about.js';
import type { B_ABT_D } from '@betarena/scores-lib/types/about';

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
): Promise<unknown | null> {

	const FIXTURE_ID = parseInt(_fixture_id);
	const LANG = _lang;

	const fixture = await ABT_F_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID
	);
	// [ℹ] exit
	if (fixture == undefined) {
		return null;
	}

	const fixture_data = fixture[0];

	const data_point_root =
		LANG == 'en'
			? 'seo_fixtures'
			: `seo_fixtures_${LANG}`;

	// [ℹ] exit
	if (
		fixture_data[data_point_root] == undefined
	) {
		return null;
	}

	// [ℹ] generate [final] fixture object
	const fixture_object: B_ABT_D =
		{
			seo_data: fixture_data[data_point_root]
		};

	return fixture_object;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]