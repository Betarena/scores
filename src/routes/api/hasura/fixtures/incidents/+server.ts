import { dev } from '$app/environment';
import fs from 'fs';
import { performance } from 'perf_hooks';
import { error, json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { REDIS_CACHE_LINEUPS_DATA_3 } from '$lib/graphql/fixtures/lineups/query';

import type { 
  BETARENA_HASURA_incidents_query,
  BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures,
  Fixture_Incidents, 
  REDIS_CACHE_SINGLE_incidents_data 
} from '$lib/models/fixtures/incidents/types';

// [ℹ] debug info
const logs = [];
let t0;
let t1;

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

async function main(_fixture_id: string): Promise<REDIS_CACHE_SINGLE_incidents_data | null> {
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

  const events = fixture_data?.events_j

  const ht_score = fixture_data?.scores_j?.ht_score;
  const et_score = fixture_data?.scores_j?.et_score;
  const ps_score = fixture_data?.scores_j?.ps_score;

  // [ℹ] generate [final] fixture object
  const fixture_object: Fixture_Incidents = {
    id:               fixture_id || null,
    status:           status,
    score_post: {
      ht_score:       ht_score || null,
      et_score:       et_score || null,
      ps_score:       ps_score || null
    },
    events:           events
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
	const queryName = 'REDIS_CACHE_LINEUPS_DATA_3';
	t0 = performance.now();
	const VARIABLES = {
		fixture_id: fixture_id
	};
	const response: BETARENA_HASURA_incidents_query = await initGrapQLClient().request(
		REDIS_CACHE_LINEUPS_DATA_3,
		VARIABLES
	);
	t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}