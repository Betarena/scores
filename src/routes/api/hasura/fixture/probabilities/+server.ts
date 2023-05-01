//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';

import { PR_F_get_target_fixture, PR_F_get_widget_translations, PR_F_translations_main } from '@betarena/scores-lib/dist/functions/func.probabilities.js';
import type { B_PR_T, PR_Fixture } from '@betarena/scores-lib/types/probabilities';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
// const logs = [];

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise <unknown> {
	const lang: string = req?.url?.searchParams?.get('lang');
	const fixture_id: string = req?.url?.searchParams?.get('fixture_id');

	// [ℹ] target widget [data]
	if (fixture_id) {
		const response_hasura = await main_data(
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

  // IMPORTANT - fallback to NULL
	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description [MAIN] method - obtains target
 * data on a specific fixture-id of its probability
 * information;
 * @version 1.0
 * @param {string} _fixture_id 
 * @returns Promise < unknown | null >
 */
async function main_data(
	_fixture_id: string
): Promise < unknown | null > {

	const FIXTURE_ID = parseInt(_fixture_id);

	const fixture = await PR_F_get_target_fixture(
    graphQlInstance,
		FIXTURE_ID
	)
	// [ℹ] (validation) exit;
	if (fixture == undefined) {
		return null;
	}

	const fixture_data = fixture[0];
	const fixture_id = fixture_data?.id;
	const probabilites_data = fixture_data?.probabilities;

	const FINAL_OBJECT: PR_Fixture = {
		id: fixture_id || null,
		probabilites: probabilites_data || null
	};

	return FINAL_OBJECT;
}

/**
 * @description [MAIN] method - obtains target
 * data on a target langauge for Probabilities Fixture (widget);
 * @version 1.0 - past versions: []
 * @param {string} LANG 
 * @returns Promise < B_PR_T > 
 */
async function main_trans_and_seo(
  LANG: string
): Promise < B_PR_T > {

  const res = await PR_F_get_widget_translations(
    graphQlInstance,
    [LANG]
  )

  const fix_odds_translation_map = await PR_F_translations_main(
    res,
    [LANG]
  )

	return fix_odds_translation_map.get(LANG);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]