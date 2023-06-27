// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { HLEGT_HP_ENTRY, HLEGT_HP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.leagues-table.js';
import { LEGT_C_D_A, LEGT_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_LEGT_D, B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';

// #endregion ➤ Package Imports

// #region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()

// #endregion ➤ [VARIABLES] Imports

// #region ➤ [METHODS]

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
    const geoPos: string = req?.url?.searchParams?.get('geoPos');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION:
    // ➨ Get Featured Match (WIDGET) MAIN data;
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_0: boolean =
      geoPos != undefined
    ;
    if (if_M_0)
    {
      let data: unknown;
      let loadType = "cache";

      // IMPORTANT Check in cache;
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          LEGT_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            LEGT_C_D_A,
            'en'
          );
        }
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura)
      {
        data = await fallbackMainData
        (
          geoPos
        );
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FPROB] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION:
    // ➨ Get Featured Match (TRANSLATION) MAIN data;
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_1: boolean =
      lang != undefined
    ;
    if (if_M_1)
    {
      let data: unknown;
      let loadType = "cache";

      // IMPORTANT Check in cache;
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          LEGT_C_T_A,
          lang
        );
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura)
      {
        data = await fallbackMainData_1
        (
          lang
        );
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FPROB] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // IMPORTANT Fallback to NULL
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
 * [MAIN]
 * [FALLBACK]
 * @description
 * ➨ league table (widget) hasura DATA fetch;
 * @param
 * {string} geoPos
 * @returns
 * Promise < B_LEGT_D >
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_LEGT_D >
{
  const dataRes0 = await HLEGT_HP_ENTRY
  (
    graphQlInstance
  );

  // console.log(dataRes0?.[1]);

  if (dataRes0?.[0].size == 0)
  {
    return null
  }

	return dataRes0?.[0].get(geoPos);
}

/**
 * @summary
 * [MAIN]
 * [FALLBACK]
 * @description
 * ➨ league table (widget) hasura TRANSLATION fetch;
 * @param
 * {string} lang
 * @returns
 * Promise < B_LEGT_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_LEGT_T >
{
  const dataRes0 = await HLEGT_HP_ENTRY_1
  (
    graphQlInstance,
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

// #endregion ➤ [METHODS]