import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import { REDIS_CACHE_FIXTURE_STATISTICS_DATA_4 } from '$lib/graphql/fixtures/statistics/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import type {
  BETARENA_HASURA_statistics_query,
  BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures,
  Fixture_Statistics,
  Incident_Team,
  REDIS_CACHE_SINGLE_statistics_data
} from '$lib/models/fixtures/statistics/types';

// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req, res): Promise<unknown> {
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
	const target_season_fixtures = await main(fixture_id);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(_fixture_id: string): Promise<REDIS_CACHE_SINGLE_statistics_data | null> {
	// [ℹ] relying on Fixture Id
	// [ℹ] to get Target Fixture
	// [ℹ] and return

	const FIXTURE_ID = parseInt(_fixture_id);

	/**
	 * [ℹ] obtain target historic_fixtures [fixture_id]
  */

	const fixture = await get_target_fixture(FIXTURE_ID);
	// [ℹ] exit
	if (fixture == undefined) {
		return null;
	}

	const fixture_data = fixture[0];

	/**
	 * [ℹ] generate FIXTURE data
  */

  const fixture_id = fixture_data?.id;
  const status = fixture_data?.status_j;
  const stats = 
    fixture_data?.stats_j == undefined
      ? []
      : fixture_data?.stats_j
  ;

  // [ℹ] home-team
  const home_team_id = fixture_data?.localteam_id_j;
  const home_team_name = fixture_data?.home_team_name || null;
  const home_team_logo = fixture_data?.home_team_logo || null; 

  // [ℹ] away-team
  const away_team_id = fixture_data?.visitorteam_id_j;
  const away_team_name = fixture_data?.away_team_name;
  const away_team_logo = fixture_data?.away_team_logo;

  const home_team_obj: Incident_Team = {
    team_name: home_team_name || null,
    team_logo: home_team_logo || null,
    team_id: home_team_id
  }

  const away_team_obj: Incident_Team = {
    team_name: away_team_name || null,
    team_logo: away_team_logo || null,
    team_id: away_team_id
  }

  // [ℹ] generate [final] fixture object
  const fixture_object: Fixture_Statistics = {
    id:      fixture_id || null,
    status:  status,
    home:    home_team_obj,
    away:    away_team_obj,
    stats:   stats
  }

  // [ℹ] return fixture
	return fixture_object;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_fixture(
	fixture_id: number
): Promise<BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]> {
	// [ℹ] obtain target historic_fixtures [fixture_id]
	const queryName = 'REDIS_CACHE_FIXTURE_STATISTICS_DATA_4';
	const t0 = performance.now();
	const VARIABLES = {
		fixture_id: fixture_id
	};
	const response: BETARENA_HASURA_statistics_query = await initGrapQLClient().request(
		REDIS_CACHE_FIXTURE_STATISTICS_DATA_4,
		VARIABLES
	);
	const t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}