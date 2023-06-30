// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { LFIXODD_LP_ENTRY, LFIXODD_LP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.fixture-odds.js';
import { FO_C_D_A, FO_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_FO_D, B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';

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
	  const league_id: string = req?.url?.searchParams?.get('league_id');
    const season_id: string = req?.url?.searchParams?.get('season_id');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: 
    // ➨ Get Fixture Odds (WIDGET) MAIN data; 
    // ➨ NOTE: Contains [HASURA] Fallback;
    // ➨ NOTE: Contains OVERRIDE [x1]
    const if_M_0: boolean =
      league_id != undefined
      || season_id != undefined
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
          FO_C_D_A,
          league_id
        );
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura) 
      {
        data = await fallbackMainData
        (
          league_id,
          season_id
        );
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FPROB] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: 
    // ➨ Get Fixture Odds (TRANSLATION) MAIN data; 
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
          FO_C_T_A,
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
 * ➨ standings (widget) hasura DATA fetch;
 * @param 
 * {string} leagueId
 * @returns 
 * Promise < B_FO_D >
 */
async function fallbackMainData 
(
  leagueId: string,
  seasonId: string
): Promise < B_FO_D > 
{
  const _leagueId = parseInt(leagueId);
  const _seasonId = parseInt(seasonId);

  const dataRes0 = await LFIXODD_LP_ENTRY
  (
    graphQlInstance,
    false,
    _leagueId || null,
    _seasonId || null
  );

  // console.log(dataRes0?.[1]);

  if (dataRes0?.[0].size == 0) 
  {
    return null
  }
  
	return dataRes0?.[0].get(_leagueId);
}

/**
 * @summary 
 * [MAIN] 
 * [FALLBACK]
 * @description
 * ➨ standings (widget) hasura TRANSLATION fetch;
 * @param 
 * {string} lang
 * @returns 
 * Promise < B_FO_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_FO_T > 
{
  const dataRes0 = await LFIXODD_LP_ENTRY_1
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