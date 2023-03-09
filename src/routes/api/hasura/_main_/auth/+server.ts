import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import { initGrapQLClient } from '$lib/graphql/init';

import { BETARENA_SCORES_AUTH_TRANSLATION } from '$lib/graphql/_main_/auth/query';
import type { BETARENA_HASURA_auth_translations } from '$lib/models/hasura';
import type {
  BETARENA_HASURA_auth_query,
  REDIS_CACHE_SINGLE_auth_translation
} from '$lib/models/_main_/auth/types';

// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
	const lang: string =
		req.url['searchParams'].get('lang');
	const target_translations = await main(lang);
	return json(target_translations);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(
	_lang: string
): Promise<REDIS_CACHE_SINGLE_auth_translation | null> {
	// [ℹ] relying on lang
	// [ℹ] to get Target Translation

	const LANG = _lang;

	/**
	 * [ℹ] obtain target historic_fixtures [fixture_id]
	 */

	const data = await get_auth_translation(LANG);
	// [ℹ] exit
	if (data == undefined) {
		return null;
	}

	/**
	 * [ℹ] generate CONTENT data
	 * [ℹ] return FIXTURE-CONTENT
	 */

	const object: REDIS_CACHE_SINGLE_auth_translation =
		{};
	object.lang = LANG;

	const objectAuthTrans = data.find(
		({ lang }) => lang === LANG
	);

	const mergedObj = {
		...object,
		...objectAuthTrans?.translation
	};

	return mergedObj;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_auth_translation(
	lang: string
): Promise<BETARENA_HASURA_auth_translations[]> {
	// [ℹ] obtain target external_content [fixture_id based]
	const queryName =
		'REDIS_CACHE_FIXTURE_CONTENT_DATA_3';
	const t0 = performance.now();
	const VARIABLES = {
		lang
	};
	const response: BETARENA_HASURA_auth_query =
		await initGrapQLClient().request(
			BETARENA_SCORES_AUTH_TRANSLATION,
			VARIABLES
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response.auth_translations;
}
