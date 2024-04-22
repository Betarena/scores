//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { PFIX_PP_ENTRY, PFIX_PP_ENTRY_1 } from "@betarena/scores-lib/dist/functions/func.player.fixtures.js";
import { PFIX_PP_getTargetFixture } from '@betarena/scores-lib/dist/graphql/query.player-fixtures.js';

import type { B_H_HF } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_PFIX_D, B_PFIX_T } from '@betarena/scores-lib/types/player-fixtures';

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
  const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
  // const league_id: string = req?.url?.searchParams?.get('league_id');
	const offset: string = req?.url?.searchParams?.get('offset');
  const hasura: string = req?.url?.searchParams?.get('hasura');
	// const limit: string = req?.url?.searchParams?.get('limit');

  // NOTE: player (page) data;
  // IMPORTANT CACHE + FALLBACK (HASURA)
  if (player_id)
  {

    const _player_id: number = parseInt(player_id)
    const _offset = parseInt(offset)
    let data;
    let loadType = "cache";

    // NOTE: check in cache;
    if (!hasura)
    {
      data =
        await new _Redis().rHGET
        (
          RedisKeys.PFIX_C_D_A,
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
        _offset
      )
      loadType = 'HASURA'
		}

    console.log(`📌 loaded [PFIX] with: ${loadType}`)

    return json(data);
  }

  // NOTE: player (page) data; (PLAYERS)
  const if_1 =
    fixture_id != undefined
  ;
  if (if_1)
  {
    const _fixture_id = parseInt(fixture_id)
    console.log('fixture_id', fixture_id)
    const response =await helperMainAction
    (
      _fixture_id
    );
    return json(response);
  }

  // league-id

  // NOTE: target widget [translation]
	if (lang)
  {
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
 * @returns Promise < B_PFIX_D >
 */
async function fallbackMainData
(
  _player_id: number,
  _offset: number
): Promise < B_PFIX_D >
{

  const dataRes0 = await PFIX_PP_ENTRY
  (
    _offset,
    [_player_id]
  );

  if (dataRes0?.[0]?.size == 0)
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
): Promise < B_PFIX_T >
{
  const dataRes0 = await PFIX_PP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0].size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(lang);
}

async function helperMainAction
(
  fixtureId: number
): Promise < B_H_HF >
{
  const dataRes0 = await PFIX_PP_getTargetFixture
  (
    fixtureId
  );

  return dataRes0?.[0];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]