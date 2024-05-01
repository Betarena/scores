//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { FH2H_FP_ENTRY, FH2H_FP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.fixture.head-2-head.js';

import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';

//#endregion ➤ Package Imports

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
	  const teamIds: string = req?.url?.searchParams?.get('teamIds');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: Get Fixture Head-2-Head (WIDGET) MAIN data;
    // NOTE: With [HASURA] Fallback;
    const if_M_0 =
      teamIds != undefined
    ;
    if (if_M_0)
    {

      let data;
      let loadType = "cache";

      // NOTE: check CACHE;
      // if (!hasura)
      // {
      //   data =
      //     await new _Redis().rHGET
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
          teamIds
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FH2H] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: Get Fixture Head-2-Head (WIDGET) TRANSLATION data;
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
  teamIdsTuple: string
): Promise < B_H2H_D >
{
  const dataRes0 = await FH2H_FP_ENTRY
  (
    [teamIdsTuple]
  )

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(teamIdsTuple);
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
  const dataRes0 = await FH2H_FP_ENTRY_1
  (
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