import { performance } from 'perf_hooks';
import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { REDIS_CACHE_FIXTURE_ABOUT_DATA_3 } from '$lib/graphql/fixtures/about/query';
import type { BETARENA_HASURA_about_query, REDIS_CACHE_SINGLE_about_data } from '$lib/models/fixtures/about/types';
import type { BETARENA_HASURA_historic_fixtures } from '$lib/models/hasura';

// [ℹ] debug info
const logs = [];
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req, res): Promise<unknown> {
  const lang: string = req.url['searchParams'].get('lang');
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
	const target_season_fixtures = await main(fixture_id, lang);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main (
  _fixture_id: string,
  _lang: string
): Promise < REDIS_CACHE_SINGLE_about_data | null > {

	// [ℹ] relying on Fixture Id & Lang
	// [ℹ] to get Target Content

	const FIXTURE_ID = parseInt(_fixture_id);
  const LANG = _lang

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

  const data_point_root = 
    LANG == "en"
      ? "seo_fixtures"
      : `seo_fixtures_${LANG}`

	// [ℹ] exit
  if (fixture_data[data_point_root] == undefined) {
		return null;
  }

  // [ℹ] generate [final] fixture object
  const fixture_object: REDIS_CACHE_SINGLE_about_data = {
    seo_data: fixture_data[data_point_root]
  }

	return fixture_object;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_fixture (
	fixture_id: number
): Promise < BETARENA_HASURA_historic_fixtures[] > {
	// [ℹ] obtain target external_content [fixture_id based]
	const queryName = 'REDIS_CACHE_FIXTURE_ABOUT_DATA_3';
	t0 = performance.now();
	const VARIABLES = {
		fixture_id: fixture_id
	};
	const response: BETARENA_HASURA_about_query = await initGrapQLClient().request(
		REDIS_CACHE_FIXTURE_ABOUT_DATA_3,
		VARIABLES
	);
	t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}