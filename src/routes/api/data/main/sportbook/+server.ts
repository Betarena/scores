// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { LSPT_L_ENTRY } from '@betarena/scores-lib/dist/functions/func.sportbook.js';
import { SPD_C_D_A, SPD_C_D_A1 } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

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
    const geoPos: string = req?.url?.searchParams?.get('geoPos');
    const all: string =	req?.url?.searchParams?.get('all');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: 
    // ➨ Get Sportbook ALL (WIDGET) MAIN data; 
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_0: boolean =
      all != undefined
      && geoPos != undefined
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
          SPD_C_D_A1,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            SPD_C_D_A1,
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
    // ➨ Get Sportbook ALL (WIDGET) MAIN data; 
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_1: boolean =
      all == undefined
      && geoPos != undefined
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
          SPD_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            SPD_C_D_A,
            'en'
          );
        }
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura) 
      {
        data = await fallbackMainData_1
        (
          geoPos
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
 * ➨ sportbook (data) hasura TRANSLATION fetch;
 * @param 
 * {string} geoPos
 * @returns 
 * Promise < B_SPT_D >
 */
async function fallbackMainData 
(
  geoPos: string
): Promise < B_SPT_D[] > 
{
  const dataRes0 = await LSPT_L_ENTRY
  (
    graphQlInstance
  );

  if (dataRes0?.[1].size == 0) 
  {
    return null
  }
  
	return dataRes0?.[1].get(geoPos);
}

/**
 * @summary 
 * [MAIN] 
 * [FALLBACK]
 * @description
 * ➨ sportbook (data) hasura TRANSLATION fetch;
 * @param 
 * {string} geoPos
 * @returns 
 * Promise < B_SPT_D >
 */
async function fallbackMainData_1
(
  geoPos: string
): Promise < B_SPT_D > 
{
  const dataRes0 = await LSPT_L_ENTRY
  (
    graphQlInstance
  );

  if (dataRes0?.[0].size == 0) 
  {
    return null
  }
  
	return dataRes0?.[0].get(geoPos);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

// #endregion ➤ [METHODS]