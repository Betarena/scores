// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import { CHIGH_CP_ENTRY, CHIGH_CP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.competition.highlights.js';
import dotenv from 'dotenv';

import { checkNull } from '$lib/utils/platform-functions.js';
import type { B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

dotenv.config();

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

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
	  const competition_id: string = req?.url?.searchParams?.get('competition_id');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: Get Fixture Scoreboard (WIDGET) MAIN data;
    // NOTE: With [HASURA] Fallback;
    const if_M_0: boolean =
      checkNull(lang)
    ;
    if (if_M_0)
    {
      const _competition_id = parseInt(competition_id)
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
          _competition_id
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FSCR] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: Get Fixture Scoreboard (WIDGET) TRANSLATION data;
    // NOTE: With [HASURA] Fallback;
    const if_M_1: boolean =
      !checkNull(lang)
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
 *
 * @description
 * ➨ fixture (lineup) widget main data (hasura) fallback;
 *
 * @param
 * {number} competitionId - Target
 *
 * @returns
 * An `asynchronous` data in the form of `[number, B_COMP_HIGH_D][]`.
 */
async function fallbackMainData
(
  fixtureId: number
)
{
  const dataRes0 = await CHIGH_CP_ENTRY();

  if (dataRes0?.[0]?.size == 0) return null;

	return [...dataRes0?.[0].entries()];
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
  const dataRes0 = await CHIGH_CP_ENTRY_1
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

// #endregion ➤ 🛠️ METHODS