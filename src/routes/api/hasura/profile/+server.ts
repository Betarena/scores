import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { SCORES_PROFILE_TRANSLATIONS_DATA_1 } from '$lib/graphql/profile/query';
import type { BETARENA_HASURA_profile_query, REDIS_CACHE_SINGLE_profile_translation } from '$lib/models/profile/account-setting/types';

// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
  const lang: string = req.url['searchParams'].get('lang');
	const response = await main(lang);
	return json(response);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main (
  _lang: string
): Promise < REDIS_CACHE_SINGLE_profile_translation | null > {

	// [ℹ] relying on Fixture Id & Lang
	// [ℹ] to get Target Content
  const LANG = _lang
	/**
	 * [ℹ] obtain target historic_fixtures [fixture_id]
  */
	const translation = await get_target_fixture(LANG);
	// [ℹ] exit
	if (translation == undefined) {
		return null;
	}
  const translation_data = translation.profile_translations[0]

  const mergedObj = {
    ...translation_data.data
  }

	return mergedObj;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_fixture (
	lang: string
): Promise < BETARENA_HASURA_profile_query > {
	// [ℹ] obtain target external_content [fixture_id based]
	const queryName = 'SCORES_PROFILE_TRANSLATIONS_DATA_1';
	const t0 = performance.now();
	const VARIABLES = {
		lang
	};
	const response: BETARENA_HASURA_profile_query = await initGrapQLClient().request(
		SCORES_PROFILE_TRANSLATIONS_DATA_1,
		VARIABLES
	);
	const t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response;
}