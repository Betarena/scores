import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import {
	REDIS_CACHE_FIXTURE_HEAD_2_HEAD_0,
	REDIS_CACHE_FIXTURE_HEAD_2_HEAD_1,
	REDIS_CACHE_FIXTURE_HEAD_2_HEAD_2,
	REDIS_CACHE_FIXTURE_HEAD_2_HEAD_3
} from '$lib/graphql/fixtures/head-2-head/query';

import { dev } from '$app/environment';
import type {
	BETARENA_HASURA_head_2_head_query,
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures,
	Fixture_Head_2_Head,
	REDIS_CACHE_SINGLE_h2h_translation
} from '$lib/models/fixtures/head-2-head/types';

// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
	const lang: string =
		req.url['searchParams'].get('lang');
	const fixture_id: string =
		req.url['searchParams'].get('fixture_id');

	// [ℹ] target widget [data]
	if (fixture_id) {
		const response_hasura = await main(
			fixture_id
		);
		if (response_hasura) {
			return json(response_hasura);
		}
	}

	// [ℹ] target widget [translation]
	if (lang) {
		const response_hasura =
			await main_trans_and_seo(lang);
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
	// [ℹ] relying on Fixture Id
	// [ℹ] to get Target Fixture
	// [ℹ] and return

	const FIXTURE_ID = parseInt(_fixture_id);

	/**
	 * [ℹ] obtain target historic_fixtures [fixture_id]
	 */

	const fixture = await get_target_fixture(
		FIXTURE_ID
	);
	// [ℹ] exit
	if (
		fixture == undefined ||
		fixture.length == 0
	) {
		// [🐞]
		console.log(
			`fixture with id ${FIXTURE_ID} not found`
		);
		console.log(`exiting...`);
		return null;
	}

	const fixture_data = fixture[0];

	/**
	 * [ℹ] generate HEAD-2-HEAD data
	 */

	const fixture_id = fixture_data?.id;
	const team_1 = fixture_data?.localteam_id_j;
	const team_2 = fixture_data?.visitorteam_id_j;

	// [ℹ] exit
	if (
		team_1 == undefined ||
		team_2 == undefined
	) {
		// [🐞]
		console.log(
			`fixture has no team_1 / team_2 id's`
		);
		console.log(`exiting...`);
		return null;
	}

	// NOTE: has to be smallest_team_id (first) in
	// NOTE: an "team_1,team_2" string
	const team_ids =
		team_1 > team_2
			? `${team_2},${team_1}`
			: `${team_1},${team_2}`;
	const team_ids_arr = [team_1, team_2];
	team_ids_arr.sort().reverse();
	// [🐞]
	if (dev)
		console.log('team_ids_arr', team_ids_arr);

	/**
	 * [ℹ] obtain target football_h2h [team_ids]
	 */
	const football_h2h = await get_target_head2head(
		team_ids,
		team_ids_arr
	);
	// [ℹ] exit
	if (
		football_h2h == undefined ||
		football_h2h.football_h2h.length == 0 ||
		football_h2h.scores_football_teams.length == 0
	) {
		// [🐞]
		console.log(
			`football_h2h has no data on ${team_ids}`
		);
		console.log(`exiting...`);
		return null;
	}

	const football_h2h_data =
		football_h2h.football_h2h[0];
	const football_teams_data =
		football_h2h.scores_football_teams;

	const team_1_data = football_teams_data.find(
		({ id }) => id == team_ids_arr[0]
	);
	const team_2_data = football_teams_data.find(
		({ id }) => id == team_ids_arr[1]
	);

	const fixture_ids =
		football_h2h_data?.last_5_data.map(
			(a) => a.id
		);
	// [🐞]
	if (dev)
		console.log(`fixture_ids`, fixture_ids);

	/**
	 * [ℹ] obtain target [last 5 fixtures] football_h2h [historic_fixtures]
	 */
	const last_5_fixtures =
		await get_target_past_fixtures(fixture_ids);
	const last_5_data_urls = last_5_fixtures.map(
		({ id, urls }) => ({ id, urls })
	);
	// [🐞]
	if (dev)
		console.log(
			`last_5_data_urls`,
			last_5_data_urls
		);

	// [ℹ] calc for corners-avg
	let corner_avg = 0;
	for (const match of football_h2h_data.last_5_data) {
		// [🐞]
		if (dev)
			console.log(
				'match?.corners?.data?.length',
				match?.corners?.data?.length
			);
		corner_avg =
			corner_avg + match?.corners?.data?.length;
	}

	// [ℹ] generate [final] fixture object
	const fixture_object: Fixture_Head_2_Head = {
		id: fixture_id || null,
		data: football_h2h_data || null,
		teams_data: [
			{
				team_logo: team_1_data?.data?.logo_path,
				team_name: team_1_data?.data?.name,
				team_short:
					team_1_data?.data?.short_code ||
					team_1_data?.data?.name
						.slice(0, 3)
						.toUpperCase() ||
					null,
				team_id: team_ids_arr[0]
			},
			{
				team_logo: team_2_data?.data?.logo_path,
				team_name: team_2_data?.data?.name,
				team_short:
					team_2_data?.data?.short_code ||
					team_2_data?.data?.name
						.slice(0, 3)
						.toUpperCase() ||
					null,
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
	const response = await get_widget_translations(
		LANG
	);

	/**
	 * [ℹ] MAIN
	 */

	const object: REDIS_CACHE_SINGLE_h2h_translation =
		{};
	object.lang = LANG;

	const objectFixOdds =
		response.scores_fixtures_h2h_translations.find(
			({ lang }) => lang === LANG
		);

	const objectFixGeneralTranslation =
		response.scores_general_translations.find(
			({ lang }) => lang === LANG
		);

	const mergedObj = {
		...object,
		...objectFixOdds?.translations,
		...objectFixGeneralTranslation?.widgets_no_data_available
	};

	// [🐞]
	/*
    if (dev) {
      const data = JSON.stringify(fix_odds_translation_map.values(), null, 4)
      fs.writeFile('./datalog/main_trans_and_seo.json', data, err => {
        if (err) {
          console.error(err);
        }
      });
    }
  */

	return mergedObj;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_fixture(
	fixture_id: number
): Promise<
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
> {
	// [ℹ] obtain target historic_fixtures [fixture_id]
	const queryName =
		'REDIS_CACHE_FIXTURE_HEAD_2_HEAD_0';
	const t0 = performance.now();
	const VARIABLES = {
		fixture_id
	};
	const response: BETARENA_HASURA_head_2_head_query =
		await initGrapQLClient().request(
			REDIS_CACHE_FIXTURE_HEAD_2_HEAD_0,
			VARIABLES
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response.historic_fixtures;
}

async function get_target_head2head(
	team_ids: string,
	team_ids_arr: number[]
): Promise<BETARENA_HASURA_head_2_head_query> {
	// [ℹ] obtain target historic_fixtures [fixture_id]
	const queryName =
		'REDIS_CACHE_FIXTURE_HEAD_2_HEAD_1';
	const t0 = performance.now();
	const VARIABLES = {
		team_ids,
		team_ids_arr
	};
	const response: BETARENA_HASURA_head_2_head_query =
		await initGrapQLClient().request(
			REDIS_CACHE_FIXTURE_HEAD_2_HEAD_1,
			VARIABLES
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response;
}

async function get_target_past_fixtures(
	fixture_ids: number[]
): Promise<
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
> {
	// [ℹ] obtain target historic_fixtures [fixture_id]
	const queryName =
		'REDIS_CACHE_FIXTURE_HEAD_2_HEAD_3';
	const t0 = performance.now();
	const VARIABLES = {
		fixture_ids
	};
	const response: BETARENA_HASURA_head_2_head_query =
		await initGrapQLClient().request(
			REDIS_CACHE_FIXTURE_HEAD_2_HEAD_3,
			VARIABLES
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response.historic_fixtures;
}

async function get_widget_translations(
	lang: string
): Promise<BETARENA_HASURA_head_2_head_query> {
	const queryName =
		'REDIS_CACHE_FIXTURE_HEAD_2_HEAD_2';
	const t0 = performance.now();
	const VARIABLES = {
		lang
	};
	const response: BETARENA_HASURA_head_2_head_query =
		await initGrapQLClient().request(
			REDIS_CACHE_FIXTURE_HEAD_2_HEAD_2,
			VARIABLES
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response;
}
