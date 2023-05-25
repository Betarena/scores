//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { PSEO_PP_ENTRY, PSEO_PP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.player-seo.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import type { B_PSEO_D, B_PSEO_T } from '@betarena/scores-lib/types/player-seo.js';
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
): Promise < unknown > 
{
  try 
  {
    
    // query (url) data
    const lang: string = req?.url?.searchParams?.get('lang');
    const player_id: string = req?.url?.searchParams?.get('player_id');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // NOTE: player (statistics) data; [fallback]
    const if_0 =
      player_id
      && lang
    ;
    if (if_0) 
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
            RedisKeys.PSEO_C_D_A,
            player_id
          )
        ;
      }
      // NOTE: (default) fallback;
      if (!data || hasura) 
      {
        data = await fallbackMainData
        (
          _player_id,
          lang
        )
        loadType = 'HASURA'
      }
      console.log(`📌 loaded [PSEO] with: ${loadType}`)
      return json(data);
    }

    // [ℹ] target widget [translation]
    if (lang) 
    {
      const response =	await fallbackMainData_1
      (
        lang
      );
      if (response) 
      {
        return json(response);
      }
    }

    // IMPORTANT - fallback to NULL
    return json
    (
      null
    );
  } 
  catch (ex) 
  {
    console.error
    (
      '❌ Err: ',
      ex
    );
    return json
    (
      null,
      {
        status: 400,
        statusText: 'Uh-oh! There has been an error'
      }
    );
  }
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
  _player_id: number,
  _lang: string
): Promise < B_PSEO_D > 
{
  const map = await PSEO_PP_ENTRY
  (
    graphQlInstance,
    [_player_id],
    [_lang]
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
 * @returns Promise < B_PSEO_T > 
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PSEO_T > 
{
  const map = await PSEO_PP_ENTRY_1
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