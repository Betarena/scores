import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import {
	REDIS_CACHE_SCOREBOARD_ODDS_DATA_2,
	REDIS_CACHE_SCOREBOARD_ODDS_DATA_3
} from '$lib/graphql/fixtures/scoreboard/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import type {
	BETARENA_HASURA_scoreboard_query,
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures,
	BETARENA_HASURA_SURGICAL_JSONB_scores_football_leagues,
	Fixture_Scoreboard_Info,
	Fixture_Scoreboard_Team,
	REDIS_CACHE_SINGLE_scoreboard_data
} from '$lib/models/fixtures/scoreboard/types';
import type { BETARENA_HASURA_scores_tournaments } from '$lib/models/hasura';

// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
	const fixture_id: string =
		req.url['searchParams'].get('fixture_id');
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
): Promise<REDIS_CACHE_SINGLE_scoreboard_data | null> {
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
	if (fixture == undefined) {
		return null;
	}

	const fixture_data = fixture[0];
	const league_id = fixture_data?.league_id;

	/**
	 * [ℹ] obtain target league
	 */

	const [league_data, tournaments_data] =
		await get_target_league_and_tournament_info([
			league_id
		]);
	const league_img = league_data[0]?.image_path_j;
	const tournament_urls =
		tournaments_data[0]?.urls;

	/**
	 * [ℹ] generate FIXTURE data
	 */

	// const fix_season_id = fixture_data?.data?.season_id;
	const fixture_id = fixture_data?.id;
	const home_team_id =
		fixture_data?.localteam_id_j;
	const away_team_id =
		fixture_data?.visitorteam_id_j;

	const round = fixture_data?.round_j?.data?.name;
	// const fixture_date = fixture_data?.fixture_day;
	const fixture_time = fixture_data?.time;
	const minutes = fixture_data?.time_j?.minute;
	const status = fixture_data?.time_j?.status;

	const ht_score =
		fixture_data?.scores_j?.ht_score;
	const et_score =
		fixture_data?.scores_j?.et_score;
	const ps_score =
		fixture_data?.scores_j?.ps_score;

	const home_team_name =
		fixture_data.home_team_name;
	const home_team_logo =
		fixture_data.home_team_logo;
	const home_team_score =
		fixture_data?.stats_j?.data?.find(
			({ team_id }) => team_id === home_team_id
		)?.goals;
	const home_team_short_code =
		fixture_data?.localteam_short_code_j;

	const away_team_name =
		fixture_data.away_team_name;
	const away_team_logo =
		fixture_data.away_team_logo;
	const away_team_score =
		fixture_data?.stats_j?.data?.find(
			({ team_id }) => team_id === away_team_id
		)?.goals;
	const away_team_short_code =
		fixture_data?.visitorteam_short_code_j;

	const home_team_obj: Fixture_Scoreboard_Team = {
		name: home_team_name,
		score: home_team_score || 0
	};

	const away_team_obj: Fixture_Scoreboard_Team = {
		name: away_team_name,
		score: away_team_score || 0
	};

	// [ℹ] generate [final] fixture object
	const fixture_object: Fixture_Scoreboard_Info =
		{
			id: fixture_id || null,
			round: round || null,
			home_team_name: home_team_name || null,
			home_team_logo: home_team_logo || null,
			home_team_short_code:
				home_team_short_code ||
				home_team_name
					.slice(0, 3)
					.toUpperCase() ||
				null,
			away_team_name: away_team_name || null,
			away_team_logo: away_team_logo || null,
			away_team_short_code:
				away_team_short_code ||
				away_team_name
					.slice(0, 3)
					.toUpperCase() ||
				null,
			minute: minutes || null,
			status: status || null,
			fixture_time: fixture_time || null,
			teams: {
				home: home_team_obj || null,
				away: away_team_obj || null
			},
			league_id,
			league_logo: league_img || null,
			league_urls: tournament_urls || null,
			score_post: {
				ht_score: ht_score || null,
				et_score: et_score || null,
				ps_score: ps_score || null
			}
		};

	// [ℹ] return fixture
	return fixture_object;
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
		'REDIS_CACHE_SCOREBOARD_ODDS_DATA_3';
	const t0 = performance.now();
	const VARIABLES = {
		fixture_id
	};
	const response: BETARENA_HASURA_scoreboard_query =
		await initGrapQLClient().request(
			REDIS_CACHE_SCOREBOARD_ODDS_DATA_3,
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

async function get_target_league_and_tournament_info(
	league_ids_arr: number[]
): Promise<
	[
		BETARENA_HASURA_SURGICAL_JSONB_scores_football_leagues[],
		BETARENA_HASURA_scores_tournaments[]
	]
> {
	const VARIABLES_1 = {
		league_ids_arr,
		league_ids_arr_2: league_ids_arr
	};

	const t0 = performance.now();
	const queryName =
		'REDIS_CACHE_SCOREBOARD_ODDS_DATA_2';
	const response: BETARENA_HASURA_scoreboard_query =
		await initGrapQLClient().request(
			REDIS_CACHE_SCOREBOARD_ODDS_DATA_2,
			VARIABLES_1
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return [
		response.scores_football_leagues,
		response.scores_tournaments
	];
}
