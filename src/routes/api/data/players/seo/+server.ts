//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { PSEO_PP_ENTRY, PSEO_PP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.player.seo.js';

import type { B_PSEO_D, B_PSEO_T } from '@betarena/scores-lib/types/player-seo.js';

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
          await new _Redis().rHGET
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
  const dataRes0 = await PSEO_PP_ENTRY
  (
    [_player_id],
    [_lang]
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
 * @param {string} LANG
 * @returns Promise < B_PSEO_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PSEO_T >
{
  const dataRes0 = await PSEO_PP_ENTRY_1
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