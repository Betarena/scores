// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { LSTAN_LP_ENTRY, LSTAN_LP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.league.standings.js';

import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';

// #endregion ➤ Package Imports

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
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION:
    // ➨ Get Featured Match (WIDGET) MAIN data;
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_0: boolean =
      league_id != undefined
    ;
    if (if_M_0)
    {
      let data: unknown;
      let loadType = "cache";

      // IMPORTANT Check in cache;
      if (!hasura)
      {
        data = await new _Redis().rHGET
        (
          RedisKeys.STA_C_D_A,
          league_id
        );
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura)
      {
        data = await fallbackMainData
        (
          league_id
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
        data = await new _Redis().rHGET
        (
          RedisKeys.STA_C_T_A,
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
 * Promise < B_STA_D >
 */
async function fallbackMainData
(
  leagueId: string
): Promise < B_STA_D >
{
  const _leagueId = parseInt(leagueId)

  const dataRes0 = await LSTAN_LP_ENTRY
  (
    [_leagueId]
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
 * Promise < B_STA_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_STA_T >
{
  const dataRes0 = await LSTAN_LP_ENTRY_1
  (
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