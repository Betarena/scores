//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { PPRO_PP_ENTRY, PPRO_PP_ENTRY_1 } from "@betarena/scores-lib/dist/functions/func.player.profile.js";

import type { B_PPRO_D, B_PPRO_T } from "@betarena/scores-lib/types/player-profile";

//#endregion ➤ Package Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET
(
  req
): Promise < unknown >
{

	const lang: string = req?.url?.searchParams?.get('lang');
	const player_id: string = req?.url?.searchParams?.get('player_id');

  // NOTE: player (page) data;
  // IMPORTANT CACHE + FALLBACK (HASURA)
  if (player_id)
  {

    const _player_id: number = parseInt(player_id)
    let loadType = "cache";

    // NOTE: check in cache;
    let data = await new _Redis().rHGET
    (
      RedisKeys.PP_C_D_A,
      player_id
    );

    // NOTE: (default) fallback;
		if (!data)
    {
      data = await fallbackMainData
      (
        _player_id
      );
      loadType = 'HASURA'
		}

    console.log(`📌 loaded [PPRO] with: ${loadType}`)

    return json(data);
  }

  // [ℹ] target widget [translation]
	if (lang)
  {
		const response_hasura = await fallbackMainData_1
    (
      lang
    );
    return  json(response_hasura);
	}

  // IMPORTANT
  // ultimate fallback to NULL
	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD [FALLBACK]
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @summary [MAIN] [FALLBACK] [#0] method
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} _player_id
 * @returns Promise < B_PPRO_D >
 */
async function fallbackMainData
(
  _player_id: number
): Promise < B_PPRO_D >
{

  const dataRes0 = await PPRO_PP_ENTRY
  (
    [_player_id]
  )

  if (dataRes0?.[0].size == 0)
  {
    return null
  }

	return dataRes0?.[0].get(_player_id);
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} lang
 * @returns Promise < B_PPRO_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PPRO_T >
{
  const dataRes0 = await PPRO_PP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0].size == 0)
  {
    return null
  }

	return dataRes0?.[0].get(lang);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]