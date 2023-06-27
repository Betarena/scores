// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { LINFO_LP_ENTRY } from '@betarena/scores-lib/dist/functions/func.league-info.js';
import { LEG_C_D_A } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_LEG_D } from '@betarena/scores-lib/types/league-info.js';

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
    const url: string = req?.url?.searchParams?.get('url');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: 
    // ➨ Get Featured Match (WIDGET) MAIN data; 
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_0: boolean =
      url != undefined
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
          LEG_C_D_A,
          url
        );
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura) 
      {
        data = await fallbackMainData
        (
          url
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
 * ➨ league info (widget) hasura DATA fetch;
 * @param 
 * {string} url
 * @returns 
 * Promise < B_LEG_D >
 */
async function fallbackMainData 
(
  url: string
): Promise < B_LEG_D > 
{
  const dataRes0 = await LINFO_LP_ENTRY
  (
    graphQlInstance
  );

  // console.log(dataRes0?.[1]);

  if (dataRes0?.[0].size == 0) 
  {
    return null
  }
  
	return dataRes0?.[0].get(url);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

// #endregion ➤ [METHODS]