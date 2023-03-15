//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';

import { dev } from '$app/environment';

import {
  H2H_F_get_target_fixture,
  H2H_F_get_target_h2h,
  H2H_F_get_target_past_fixtures,
  H2H_F_get_widget_translations,
  H2H_F_translations_main
} from '@betarena/scores-lib/dist/functions/func.head-2-head.js';
import type { H2H_Fixture } from '@betarena/scores-lib/types/head-2-head';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient();
// [ℹ] debug info
// const logs = [];

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
	const lang: string = req.url['searchParams'].get('lang');
	const fixture_id: string = req.url['searchParams'].get('fixture_id');

	// [ℹ] target widget [data]
	if (fixture_id) {
		const response_hasura = await main(fixture_id);
		if (response_hasura) {
			return json(response_hasura);
		}
	}

	// [ℹ] target widget [translation]
	if (lang) {
		const response_hasura = await main_trans_and_seo(lang);
		if (response_hasura) {
			return json(response_hasura);
		}
	}

	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(
  _fixture_id: string
): Promise<unknown | null> {

	const FIXTURE_ID = parseInt(_fixture_id);

	const fixture = await H2H_F_get_target_fixture(
    graphQlInstance,
    FIXTURE_ID
  );
	// [ℹ] (validation) exit;
	if (fixture == undefined || fixture.length == 0) {
		// [🐞]
		console.log(`fixture with id ${FIXTURE_ID} not found`);
		console.log(`exiting...`);
		return null;
	}

	const fixture_data = fixture[0];

	const fixture_id = fixture_data?.id;
	const team_1 = fixture_data?.localteam_id_j;
	const team_2 = fixture_data?.visitorteam_id_j;

	// [ℹ] (validation) exit;
	if (team_1 == undefined || team_2 == undefined) {
		// [🐞]
		console.log(`fixture has no team_1 / team_2 id's`);
		console.log(`exiting...`);
		return null;
	}

	// NOTE: has to be smallest_team_id (first) in
	// NOTE: an "team_1,team_2" string
	const team_ids = team_1 > team_2 ? `${team_2},${team_1}` : `${team_1},${team_2}`;
	const team_ids_arr = [team_1, team_2];
	team_ids_arr.sort().reverse();
	// [🐞]
	if (dev) console.log('team_ids_arr', team_ids_arr);

	const football_h2h = await H2H_F_get_target_h2h(
    graphQlInstance,
    team_ids, 
    team_ids_arr
  );
	// [ℹ] (validation) exit;
	if (
		football_h2h == undefined ||
		football_h2h.football_h2h.length == 0 ||
		football_h2h.scores_football_teams.length == 0
	) {
		// [🐞]
		console.log(`football_h2h has no data on ${team_ids}`);
		console.log(`exiting...`);
		return null;
	}

	const football_h2h_data = football_h2h.football_h2h[0];
	const football_teams_data = football_h2h.scores_football_teams;

	const team_1_data = football_teams_data.find(({ id }) => id == team_ids_arr[0]);
	const team_2_data = football_teams_data.find(({ id }) => id == team_ids_arr[1]);

	const fixture_ids = football_h2h_data?.last_5_data.map((a) => a.id);
	// [🐞]
	if (dev) console.log(`fixture_ids`, fixture_ids);

	const last_5_fixtures = await H2H_F_get_target_past_fixtures(
    graphQlInstance,
    fixture_ids
  );
	const last_5_data_urls = last_5_fixtures.map(({ id, urls }) => ({ id, urls }));
	// [🐞]
	if (dev) console.log(`last_5_data_urls`, last_5_data_urls);

	// [ℹ] calc for corners-avg
	let corner_avg = 0;
	for (const match of football_h2h_data.last_5_data) {
		// [🐞]
		if (dev) console.log('match?.corners?.data?.length', match?.corners?.data?.length);
		corner_avg = corner_avg + match?.corners?.data?.length;
	}

	const fixture_object: H2H_Fixture = {
		id: fixture_id || null,
		data: football_h2h_data || null,
		teams_data: [
			{
				team_logo: team_1_data?.data?.logo_path,
				team_name: team_1_data?.data?.name,
				team_short: team_1_data?.data?.short_code || team_1_data?.data?.name.slice(0, 3).toUpperCase() || null,
				team_id: team_ids_arr[0]
			},
			{
				team_logo: team_2_data?.data?.logo_path,
				team_name: team_2_data?.data?.name,
				team_short: team_2_data?.data?.short_code || team_2_data?.data?.name.slice(0, 3).toUpperCase() || null,
				team_id: team_ids_arr[1]
			}
		],
		corner_avg,
		last_5_data_urls
	};

	// [ℹ] return fixture
	return fixture_object;
}

async function main_trans_and_seo(LANG: string) {
	const res = await H2H_F_get_widget_translations(graphQlInstance, [LANG]);
	const fix_odds_translation_map = await H2H_F_translations_main(res, [LANG]);
	return fix_odds_translation_map.get(LANG);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]
