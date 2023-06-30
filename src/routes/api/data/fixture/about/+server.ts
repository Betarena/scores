//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { FABT_FP_ENTRY, FABT_FP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.about.js';

import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';

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

    // ACTION: Get Fixture About (WIDGET) MAIN data;
    // NOTE: With [HASURA] Fallback;
    const if_M_0: boolean =
      fixture_id != undefined
      && lang != undefined
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
          _fixture_id,
          lang
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FABT] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: Get Fixture About (WIDGET) TRANSLATION data;
    // NOTE: With [HASURA] Fallback;
    const if_M_1: boolean =
      lang != undefined
      && fixture_id == undefined
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
  fixtureId: number,
  lang: string
): Promise < B_ABT_D >
{
  const dataRes0 = await FABT_FP_ENTRY
  (
    graphQlInstance,
    [fixtureId],
    [lang]
  )

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

  const key = `${fixtureId}_${lang}`

	return dataRes0?.[0]?.get(key);
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
): Promise < B_ABT_T >
{
  const dataRes0 = await FABT_FP_ENTRY_1
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