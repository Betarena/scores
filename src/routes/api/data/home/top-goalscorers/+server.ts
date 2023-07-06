// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { HTGOL_HP_ENTRY, HTGOL_HP_ENTRY_1, HTGOL_HP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.home.top-goalscorers.js';
import { TGOL_C_D_A, TGOL_C_D_S, TGOL_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_TGOL_D, B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';

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
    const seo: string =	req?.url?.searchParams?.get('seo');
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
          TGOL_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            TGOL_C_D_A,
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
      console.log(`📌 loaded [HTOPG] with: ${loadType}`)
      if (data != undefined) if (data != undefined) return json(data);
    }

    // ACTION:
    // ➨ Get Featured Match (TRANSLATION) MAIN data;
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_1: boolean =
      lang != undefined
      && seo == undefined
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
          TGOL_C_T_A,
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
      console.log(`📌 loaded [HTOPG] with: ${loadType}`)
      if (data != undefined) if (data != undefined) return json(data);
    }

    /**
     * @summary [MAIN] [DATA]
     * @description get target
     * livescores (v2) exclusive SEO widget data;
     * NOTE: with Hasura (source) fallback
     */
    const if_M_2: boolean =
      lang != undefined
      && seo != undefined
    ;
    if (if_M_2)
    {
      let data: unknown;
      let loadType = "cache";
      // NOTE: check in cache;
      if (!hasura)
      {
        data =
          await get_target_hset_cache_data
          (
            TGOL_C_D_S,
            lang
          )
        ;
      }
      // NOTE: (default) fallback;
      if (!data || hasura)
      {
        data = await fallbackMainData_2
        (
          lang
        )
        loadType = 'HASURA'
      }
      console.log(`📌 loaded [HTOPG] [S] with: ${loadType}`)
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
 * ➨ top-goalscorers (widget) hasura DATA fetch;
 * @param
 * {string} geoPos
 * @returns
 * Promise < B_TGOL_D >
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_TGOL_D >
{
  const dataRes0 = await HTGOL_HP_ENTRY
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
 * ➨ top-goalscorers (widget) hasura TRANSLATION fetch;
 * @param
 * {string} lang
 * @returns
 * Promise < B_TGOL_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_TGOL_T >
{
  const dataRes0 = await HTGOL_HP_ENTRY_1
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

/**
 * @summary
 * [MAIN]
 * [FALLBACK]
 * @description
 * ➨ top-goalscorers (widget) hasura TRANSLATION fetch;
 * @param
 * {string} lang
 * @returns
 * Promise < B_TGOL_S >
 */
async function fallbackMainData_2
(
  lang: string
): Promise < B_TGOL_S >
{
  const dataRes0 = await HTGOL_HP_ENTRY_2
  (
    graphQlInstance,
    [lang],
    null
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