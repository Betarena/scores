//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { FLIN_FP_ENTRY, FLIN_FP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.fixture.lineups.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_LIN_T, LIN_Fixture } from '@betarena/scores-lib/types/lineups.js';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()

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
    // NOTE: Handle url-query data;
    const lang: string = req?.url?.searchParams?.get('lang');
	  const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: Get Fixture Lineups (WIDGET) MAIN data; 
    // NOTE: With [HASURA] Fallback;
    const if_M_0: boolean =
      fixture_id != undefined
    ;
    if (if_M_0) 
    {
      const _fixture_id: number = parseInt(fixture_id)
      let data;
      let loadType = "cache";

      // NOTE: check CACHE;
      if (!hasura) 
      {
        data =
          await get_target_hset_cache_data
          (
            RedisKeys.LIN_C_D_A,
            fixture_id
          )
        ;
      }

      // NOTE: (default) HASURA fallback;
      if (!data || hasura) 
      {
        data = await fallbackMainData
        (
          _fixture_id
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FLIN] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: Get Fixture Lineups (WIDGET) TRANSLATION data;
    // NOTE: With [HASURA] Fallback;
    const if_M_1: boolean =
      lang != undefined
    ;
    if (if_M_1) 
    {
      // TODO: LIN_C_T_A
      const data =	await fallbackMainData_1
      (
        lang
      );
      if (data != undefined) return json(data);
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
 * @summary 
 * [MAIN] [FALLBACK] [#0]
 * @description
 * ➨ fixture (lineup) widget main data (hasura) fallback;
 * @param 
 * {number} _fixture_id
 * @returns 
 * Promise < B_PSTAT_D >
 */
async function fallbackMainData 
(
  _fixture_id: number
): Promise < LIN_Fixture > 
{
  const dataRes0 = await FLIN_FP_ENTRY
  (
    graphQlInstance,
    _fixture_id
  )

  if (dataRes0?.[0]?.size == 0) 
  {
    return null
  }
  
	return dataRes0?.[0]?.get(_fixture_id);
}

/**
 * @summary 
 * [MAIN] [FALLBACK] [#1] method
 * @version 
 * 1.0 - past versions: []
 * @param 
 * {string} lang 
 * @returns 
 * Promise < B_PSEO_T > 
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_LIN_T > 
{
  const dataRes0 = await FLIN_FP_ENTRY_2
  (
    graphQlInstance,
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