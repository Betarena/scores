//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { PSTAT_PP_ENTRY, PSTAT_PP_ENTRY_1, PSTAT_PP_ENTRY_2 } from "@betarena/scores-lib/dist/functions/func.player.statistics.js";

import type { B_PSTAT_D, B_PSTAT_T, PSTAT_C_Fixture } from '@betarena/scores-lib/types/player-statistics.js';

//#endregion ➤ Package Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET
(
  req
): Promise <unknown>
{

  // query (url) data
	const lang: string = req?.url?.searchParams?.get('lang');
	const player_id: string = req?.url?.searchParams?.get('player_id');
	const league_id: string = req?.url?.searchParams?.get('league_id');
	const season_id: string = req?.url?.searchParams?.get('season_id');
  const hasura: string = req?.url?.searchParams?.get('hasura');

  // NOTE: player (statistics) data; [fallback]
  const if_M_0 =
    player_id
    && !league_id
    && !season_id
    && !lang
  ;
  if (if_M_0)
  {
    const _player_id: number = parseInt(player_id)
    let data;
    let loadType = "cache";
    // NOTE: check in cache;
    if (!hasura)
    {
      data =
        await new _Redis().rHGET
        (
          RedisKeys.PSTAT_C_D_A,
          player_id
        )
      ;
    }
    // NOTE: (default) fallback;
		if (!data || hasura)
    {
      data = await fallbackMainData
      (
        _player_id
      )
      loadType = 'HASURA'
		}
    console.log(`📌 loaded [PFIX] with: ${loadType}`)
    return json(data);
  }

  // NOTE: player (statistics) target season fixtures; [fallback]
  const if_M_1 =
    player_id
    && league_id
    && season_id
    && !lang
  ;
  if (if_M_1)
  {
    const _player_id: number = parseInt(player_id)
    const _league_id: number = parseInt(league_id)
    const _season_id: number = parseInt(season_id)
    let data;
    let loadType = "cache";
    // NOTE: (default) fallback;
		if (!data || hasura)
    {
      data = await fallbackMainData_2
      (
        _player_id,
        _league_id,
        _season_id
      )
      loadType = 'HASURA'
		}
    console.log(`📌 loaded [PFIX] with: ${loadType}`)
    return json(data);
  }

  // [ℹ] target widget [translation]
	if (lang)
  {
		const response_hasura =	await fallbackMainData_1(lang);
    return json(response_hasura);
	}

  // IMPORTANT - fallback to NULL
	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @summary [MAIN] [FALLBACK] [#0] method
 * page main initial data gather;
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} _player_id
 * @returns Promise < B_PSTAT_D >
 */
async function fallbackMainData
(
  _player_id: number
): Promise < B_PSTAT_D >
{

  const dataRes0 = await PSTAT_PP_ENTRY
  (
    [_player_id]
  )

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(_player_id);
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} lang
 * @returns Promise < B_PSTAT_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PSTAT_T >
{
  const dataRes0 = await PSTAT_PP_ENTRY_2
  (
    [lang]
  );

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(lang);
}

/**
 * @summary [MAIN] [FALLBACK] [#0] method
 * page main initial data gather;
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} player_id
 * @param {number} league_id
 * @param {number} season_id
 * @returns Promise < B_PSTAT_D >
 */
async function fallbackMainData_2
(
  playerId: number,
  leagueId: number,
  seasonId: number
): Promise < [ PSTAT_C_Fixture[], number ] >
{

  const [
    dataFixturesList,
    averageRatingFixtures
  ] = await PSTAT_PP_ENTRY_1
  (
    leagueId,
    seasonId,
    playerId
  )

  // if (data.length == 0)
  // {
  //   return null
  // }

	return [
    dataFixturesList,
    averageRatingFixtures
  ];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]