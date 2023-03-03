import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { json } from '@sveltejs/kit';

import {
  breakdownWeeksAndRounds,
  fixturesGroupByLeague,
  generate_historic_fixtures_map,
  get_target_historic_fixtures,
  get_target_season_details,
  merge_weeks_rounds_to_league
} from '@betarena/scores-lib/dist/functions/func.fixture-odds.js';
import { BETARENA_CACHE_FIXTURES_ODDS_DATA_5 } from '@betarena/scores-lib/dist/graphql/query.fixture-odds.js';
import type { B_H_HF_FO_Q, FO_Season } from '@betarena/scores-lib/types/fixture-odds';
import type { B_H_SFSD } from '@betarena/scores-lib/types/hasura';

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise<unknown> {
  const LEAGUE_ID: string = req.url['searchParams'].get('league_id');
  const SEASON_ID: string = req.url['searchParams'].get('season_id');
	const target_season_fixtures = await main(LEAGUE_ID, SEASON_ID);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description [MAIN] Method relying on Season Id
 * to get ALL Fixtures, for target SEASON-ID
 * @param {string} _league_id
 * @param {string} _seasonId
 * @returns Promise<Tournament_Season_Fixtures_Odds | null>
 */
async function main(
  _league_id: string,
  _seasonId: string
): Promise<FO_Season[] | null> {

  let SEASON_ID: number

  if (_seasonId == undefined) {
    const LEAGUE_ID = parseInt(_league_id);
    const target_current_season_arr = await get_league_current_seasons(LEAGUE_ID);
    // [ℹ] exit
    if (target_current_season_arr == undefined || target_current_season_arr.length == 0) {
      return null;
    }
	  SEASON_ID = target_current_season_arr[0].id;
  }
  else {
    SEASON_ID = parseInt(_seasonId);
  }

  console.log('SEASON_ID', SEASON_ID)

	const h_fixtures_arr = await get_target_historic_fixtures(
    graphQlInstance, 
    [SEASON_ID]
  );
	// [ℹ] exit;
	if (h_fixtures_arr == undefined
    || h_fixtures_arr.length == 0) {
		return null;
	}

	const season_details_data = await get_target_season_details(
    graphQlInstance, 
    [SEASON_ID]
  );

	const historic_fixtures_map = await generate_historic_fixtures_map(
    h_fixtures_arr
  );

	// [🐞]
	/*
    if (dev) {
      const data = JSON.stringify(h_fixtures_arr, null, 4)
      fs.writeFile('./datalog/h_fixtures_arr.json', data, err => {
        if (err) {
          console.error(err);
        }
      });
    }
  */

	/*
    const mainArrIds = []
    for (const i of h_fixtures_arr) {
      mainArrIds.push(i.id)
    }
    const duplicates = mainArrIds.filter((e, i, a) => a.indexOf(e) !== i) // [2, 4]
    logs.push(`duplicates: ${duplicates.length}`)
  */

	/*
    if (dev) {
      const data = JSON.stringify(duplicates, null, 4)
      await fs.writeFile(`./datalog/duplicates_local_main.json`, data);
    }
  */

	const season_week_round_ranges_map = await breakdownWeeksAndRounds(
		[SEASON_ID],
		season_details_data,
		historic_fixtures_map
	);
	// [ℹ] exit;
	if (season_week_round_ranges_map == undefined) {
		return null;
	}

  let historic_fixtures_by_league = await fixturesGroupByLeague(
    historic_fixtures_map
  );
  
  historic_fixtures_by_league = await merge_weeks_rounds_to_league(
    historic_fixtures_by_league,
    season_week_round_ranges_map
  )

	return historic_fixtures_by_league.get(parseInt(_league_id));

  // IF (LEAGUE_ID) returns:
  // [ℹ] return fixtures for THIS
	// [ℹ] target season
	// return {
	// 	league_id: parseInt(_leagueId),
	// 	seasons: [historic_fixtures_season_arr]
	// };
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description get_league_current_seasons
 * @param {number} league_id 
 * @returns 
 */
async function get_league_current_seasons(
	league_id: number
): Promise<B_H_SFSD[]> {
	const t0 = performance.now();
	const queryName = 'REDIS_CACHE_FIXTURES_ODDS_DATA_5';
	const VARIABLES = {
		league_id
	};
	const response: B_H_HF_FO_Q = await initGrapQLClient().request(
		BETARENA_CACHE_FIXTURES_ODDS_DATA_5,
		VARIABLES
	);
	const t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.scores_football_seasons_details;
}