//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { PTEAM_PP_ENTRY, PTEAM_PP_ENTRY_1 } from "@betarena/scores-lib/dist/functions/func.player-team.js";
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import type { B_PSTAT_T } from '@betarena/scores-lib/types/player-statistics.js';
import type { B_PTEAM_D } from '@betarena/scores-lib/types/player-team.js';
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
        await get_target_hset_cache_data
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

  const map = await PTEAM_PP_ENTRY
  (
    graphQlInstance,
    [_player_id]
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
 * @param {string} lang 
 * @returns Promise < B_PSTAT_T > 
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PSTAT_T > 
{
  const map = await PTEAM_PP_ENTRY_1
  (
    graphQlInstance,
    [lang]
  );

  if (map.size == 0) 
  {
    return null
  }
  
	return map.get(lang);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]