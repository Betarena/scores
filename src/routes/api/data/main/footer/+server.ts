// #region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { LFOOT_L_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.main.footer.js';
import { FOT_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_FOT_T } from '@betarena/scores-lib/types/footer.js';

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
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION:
    // ➨ Get Footer (WIDGET) MAIN data;
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_0: boolean =
      lang != undefined
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
          FOT_C_T_A,
          lang
        );
      }

      // IMPORTANT Default to Hasura;
      if (!data || hasura)
      {
        data = await fallbackMainData
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
 * ➨ footer (widget) hasura TRANSLATION fetch;
 * @param
 * {string} lang
 * @returns
 * Promise < B_FOT_T >
 */
async function fallbackMainData
(
  lang: string
): Promise < B_FOT_T >
{
  const dataRes0 = await LFOOT_L_ENTRY_1
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