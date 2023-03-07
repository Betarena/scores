import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { generate_historic_fixtures_day_group_map, generate_leagues_map, generate_tournaments_map, get_target_date_fixtures, get_target_leagues } from '@betarena/scores-lib/dist/functions/func.livescores-v2.js';
import type { B_LS2_D, LS2_C_FixtureDateGroup } from '@betarena/scores-lib/types/livescores-v2';

// [ℹ] debug info
// const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
	const date: string =
		req.url['searchParams'].get('date');
	const targetData = await main(
		date
	);
	return json(targetData);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description gathers target data for fixtures
 * from a target date supplied - straight from
 * hasura/historic-fixtures (db);
 * @param _date 
 * @returns {Promise < B_LS2_D | null >} Promise < B_LS2_D | null >
 */
async function main(
	_date: string
): Promise < B_LS2_D | null > {

  const graphQlInstance = initGrapQLClient()

	const FIXTURE_DATE = _date;

  const fixture_dates = [FIXTURE_DATE]

  const current_week_fixtures = await get_target_date_fixtures(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    graphQlInstance,
    fixture_dates
  )

  /**
   * [ℹ] organize (group)(map) fixtures by fixture day
   * [ℹ] -> generate (final) (array) data
   * [ℹ] organize (map) leagues by id's
   * [ℹ] -> generate (final) (array) data
  */
  const fixturesGroupedByDateMap = 
    await generate_historic_fixtures_day_group_map(
      current_week_fixtures?.historic_fixtures
  )
  let fixtures_by_date: LS2_C_FixtureDateGroup[] = []
  for (const [key, value] of fixturesGroupedByDateMap) {
    fixtures_by_date.push({
      date: key,
      fixtures: value
    })
  }
  fixtures_by_date = fixtures_by_date.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // eslint-disable-next-line prefer-const
  const leagues_ids_arr: number[] = current_week_fixtures?.historic_fixtures?.map(a => a.league_id)
  const [leagues_data, tournaments_data] = await get_target_leagues(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    graphQlInstance,
    leagues_ids_arr
  )
  const league_map = await generate_leagues_map(leagues_data)
  const tournaments_map = await generate_tournaments_map(tournaments_data)

  for await (const [, league] of league_map) {
    league.urls =
      tournaments_map.has(league?.id) == true
        ? tournaments_map.get(league?.id)?.urls
        : null
    ;
  }
  
  /**
   * [ℹ] cache (data) persist
  */
  const data: B_LS2_D = {
    fixtures_by_date,
    leagues: Array.from(league_map.values())
  }

  return data;
}