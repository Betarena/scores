//#region ➤ Package Imports

import { initGrapQLClient } from '$lib/graphql/init';
import { json } from '@sveltejs/kit';

import { PFIX_PP_ENTRY, PFIX_PP_ENTRY_1, PFIX_PP_translations_main } from "@betarena/scores-lib/dist/functions/func.player-fixtures.js";
import { PFIX_PP_getTargetFixture, PFIX_PP_get_widget_translations } from '@betarena/scores-lib/dist/graphql/query.player-fixtures.js';
import { PFIX_C_D_A } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../cache/std_main';

import type { B_PFIX_D, B_PFIX_T } from '@betarena/scores-lib/types/player-fixtures';

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
  const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
  const league_id: string = req?.url?.searchParams?.get('league_id');
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
        await get_target_hset_cache_data
        (
          PFIX_C_D_A,
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

  const map = await PFIX_PP_ENTRY
  (
    graphQlInstance,
    _offset,
    [_player_id]
  );

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
 * @returns Promise < B_PPRO_T > 
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PFIX_T > 
{
  const map = await PFIX_PP_ENTRY_1
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

async function helperMainAction
(
  fixtureId: number
): Promise < unknown >
{
  const dataRes0 = await PFIX_PP_getTargetFixture
  (
    graphQlInstance,
    fixtureId
  );
  return dataRes0;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]