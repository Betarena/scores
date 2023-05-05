//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { PSTAT_PP_ENTRY, PSTAT_PP_generateTranslationMain, PSTAT_PP_getPlayerStatTranslations } from "@betarena/scores-lib/dist/functions/func.player-statistics.js";
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import type { B_PSTAT_D, B_PSTAT_T } from '@betarena/scores-lib/types/player-statistics.js';
import { get_target_hset_cache_data } from '../../../cache/std_main';

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

export async function GET
(
  req
): Promise <unknown> 
{

  // query (url) data
	const lang: string = req?.url?.searchParams?.get('lang');
	const player_id: string = req?.url?.searchParams?.get('player_id');
  const hasura: string = req?.url?.searchParams?.get('hasura');

  // NOTE: player (page) data;
  // IMPORTANT CACHE + FALLBACK (HASURA)
  if (player_id) {

    const _player_id: number = parseInt(player_id)
    let data;
    let loadType = "cache";

    // NOTE: check in cache;
    if (!hasura) 
    {
      data =
        await get_target_hset_cache_data
        (
          RedisKeys.PSTAT_C_D_A,
          player_id
        )
      ;
    }

    // NOTE: (default) fallback;
		if (!data || hasura) {
      data = await fallbackMainData(
        _player_id
      )
      loadType = 'HASURA'
		}

    console.log(`📌 loaded [PFIX] with: ${loadType}`)

    return json(data);
  }

  // [ℹ] target widget [translation]
	if (lang) {
		const response_hasura =
			await fallbackMainData_1(lang);
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

  const map = await PSTAT_PP_ENTRY
  (
    graphQlInstance,
    [_player_id],
    false
  )

  if (map.size == 0) 
  {
    return null
  }
  
	return map.get(_player_id);
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} LANG 
 * @returns Promise < B_PSTAT_T > 
 */
async function fallbackMainData_1
(
  LANG: string
): Promise < B_PSTAT_T > 
{

  const res = await PSTAT_PP_getPlayerStatTranslations
  (
    graphQlInstance,
    [LANG]
  )

  const translationMap = await PSTAT_PP_generateTranslationMain
  (
    res,
    [LANG]
  )

	return translationMap.get(LANG);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]