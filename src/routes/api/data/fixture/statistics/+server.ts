//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { FSTAT_FP_ENTRY, FSTAT_FP_ENTRY_0 } from '@betarena/scores-lib/dist/functions/func.statistics.js';

import type { B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { ST_Fixture } from '@betarena/scores-lib/types/statistics.js';

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

    // ACTION: Get Fixture Statistics (WIDGET) MAIN data; 
    // NOTE: With [HASURA] Fallback;
    const if_M_0: boolean =
      fixture_id != undefined
    ;
    if (if_M_0) 
    {
      const _fixture_id = parseInt(fixture_id)
      let data;
      let loadType = "cache";

      // NOTE: check CACHE;
      // if (!hasura) 
      // {
      //   data =
      //     await get_target_hset_cache_data
      //     (
      //       RedisKeys.LIN_C_D_A,
      //       fixture_id
      //     )
      //   ;
      // }

      // NOTE: (default) HASURA fallback;
      if (!data || hasura) 
      {
        data = await fallbackMainData
        (
          _fixture_id
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FSTAT] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: Get Fixture Statistics (WIDGET) TRANSLATION data;
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
 * {number} fixId
 * @returns 
 * Promise < B_PSTAT_D >
 */
async function fallbackMainData 
(
  fixtureId: number
): Promise < ST_Fixture > 
{
  const map = await FSTAT_FP_ENTRY
  (
    graphQlInstance,
    [fixtureId]
  )

  if (map.size == 0) 
  {
    return null
  }
  
	return map.get(fixtureId);
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
): Promise < B_H2H_T > 
{
  const map = await FSTAT_FP_ENTRY_0
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