import { json } from '@sveltejs/kit';
import { performance } from 'perf_hooks';

import { REDIS_CACHE_FIXTURE_PROBABILITIES_0, REDIS_CACHE_FIXTURE_PROBABILITIES_1 } from '$lib/graphql/fixtures/probabilities/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

import type {
  BETARENA_HASURA_probabilities_query, BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures, Fixture_Probabilities, REDIS_CACHE_SINGLE_probabilities_translation
} from '$lib/models/fixtures/probabilities/types';

// [ℹ] debug info
const logs = [];

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

async function main (
  _fixture_id: string
): Promise < unknown | null > {
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
  const probabilites_data = fixture_data?.probabilities

  // [ℹ] generate [final] fixture object
  const fixture_object: Fixture_Probabilities = {
    id:             fixture_id || null,
    probabilites:   probabilites_data || null
  }

  // [ℹ] return fixture
	return fixture_object;
}

async function main_trans_and_seo (
  LANG: string
) {

  const response = await get_widget_translations(
    LANG
  )

  /**
   * [ℹ] MAIN 
  */

  const object: REDIS_CACHE_SINGLE_probabilities_translation = {}
  object.lang = LANG

  const objectFixOdds = response.scores_fixture_probabilities_translations
    .find(({ lang }) => lang === LANG)

  const objectFixGeneralTranslation = response.scores_general_translations
    .find(({ lang }) => lang === LANG)

  const mergedObj = {
    ...object, 
    ...objectFixOdds?.data,
    ...objectFixGeneralTranslation?.widgets_no_data_available
  }

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

  return mergedObj
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_fixture(
	fixture_id: number
): Promise<BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]> {
	// [ℹ] obtain target historic_fixtures [fixture_id]
	const queryName = 'REDIS_CACHE_FIXTURE_PROBABILITIES_0';
	const t0 = performance.now();
	const VARIABLES = {
		fixture_id
	};
	const response: BETARENA_HASURA_probabilities_query = await initGrapQLClient().request(
		REDIS_CACHE_FIXTURE_PROBABILITIES_0,
		VARIABLES
	);
	const t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}

async function get_widget_translations (
  lang: string
): Promise < BETARENA_HASURA_probabilities_query > {

  const queryName = "REDIS_CACHE_FIXTURE_PROBABILITIES_1";
  const t0 = performance.now();
  const VARIABLES = {
		lang
	};
  const response: BETARENA_HASURA_probabilities_query = await initGrapQLClient().request (
    REDIS_CACHE_FIXTURE_PROBABILITIES_1,
    VARIABLES
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}