import { performance } from 'perf_hooks';
import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { REDIS_CACHE_FIXTURE_CONTENT_DATA_3 } from '$lib/graphql/fixtures/content/query';

import type { BETARENA_HASURA_content_query, REDIS_CACHE_SINGLE_content_data } from '$lib/models/fixtures/content/types';
import type { BETARENA_HASURA_external_content } from '$lib/models/hasura';

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
): Promise< REDIS_CACHE_SINGLE_content_data[] | null > {

	// [ℹ] relying on Fixture Id & Lang
	// [ℹ] to get Target Content

	const FIXTURE_ID = parseInt(_fixture_id);
  const LANG = _lang

	/**
	 * [ℹ] obtain target historic_fixtures [fixture_id]
  */

	const fixture = await get_target_content(FIXTURE_ID, LANG);
	// [ℹ] exit
	if (fixture == undefined) {
		return null;
	}

	/**
	 * [ℹ] generate CONTENT data
   * [ℹ] return FIXTURE-CONTENT
  */

	return fixture;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_content (
	fixture_id: number,
  lang: string
): Promise< BETARENA_HASURA_external_content[] > {
	// [ℹ] obtain target external_content [fixture_id based]
	const queryName = 'REDIS_CACHE_FIXTURE_CONTENT_DATA_3';
	t0 = performance.now();
	const VARIABLES = {
		gameId: fixture_id,
    lang: lang
	};
	const response: BETARENA_HASURA_content_query = await initGrapQLClient().request(
		REDIS_CACHE_FIXTURE_CONTENT_DATA_3,
		VARIABLES
	);
	t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.external_content;
}