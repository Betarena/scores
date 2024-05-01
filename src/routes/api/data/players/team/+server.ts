//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { PTEAM_PP_ENTRY, PTEAM_PP_ENTRY_1 } from "@betarena/scores-lib/dist/functions/func.player.team.js";

import type { B_PSTAT_T } from '@betarena/scores-lib/types/player-statistics.js';
import type { B_PTEAM_D } from '@betarena/scores-lib/types/player-team.js';

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
  const hasura: string = req?.url?.searchParams?.get('hasura');

  // NOTE: player (statistics) data; [fallback]
  const if_M_0 =
    player_id
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
          RedisKeys.PTEAM_C_D_A,
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
): Promise < B_PTEAM_D >
{

  const dataRes0 = await PTEAM_PP_ENTRY
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
  const dataRes0 = await PTEAM_PP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(lang);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]