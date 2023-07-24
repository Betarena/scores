// #region ➤ 📦 Package Imports

import dotenv from 'dotenv';
import { json } from '@sveltejs/kit';

import { UPROF_UP_ENTRY_0, UPROF_UP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.profile.js';

import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ [VARIABLES] Imports

dotenv.config();

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
    const uid: string = req?.url?.searchParams?.get('uid');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: Get Fixture Scoreboard (WIDGET) MAIN data;
    // NOTE: With [HASURA] Fallback;
    const if_M_0: boolean =
      uid != undefined
    ;
    if (if_M_0)
    {
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
          uid
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FSCR] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION:
    // ➨ Get Footer (WIDGET) MAIN data;
    // ➨ NOTE: Contains [HASURA] Fallback;
    const if_M_1: boolean =
      lang != undefined
    ;
    if (if_M_1)
    {
      let data: unknown;
      let loadType = "cache";

      // IMPORTANT Check in cache;
      // if (!hasura)
      // {
      //   data = await get_target_hset_cache_data
      //   (
      //     FEATB_C_T_A,
      //     lang
      //   );
      // }

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
 * [MAIN] [FALLBACK] [#0]
 * @description
 * ➨ fixture (lineup) widget main data (hasura) fallback;
 * @param
 * { string } uid
 * @returns
 * Promise < B_PROF_D >
 */
async function fallbackMainData
(
  uid: string
): Promise < B_PROF_D >
{
  const dataRes0: [ B_PROF_D, string[] ] = await UPROF_UP_ENTRY_0
  (
    uid
  );

	return dataRes0?.[0];
}

/**
 * @summary
 * [MAIN]
 * [FALLBACK]
 * @description
 * ➨ featured betsites (widget) hasura TRANSLATION fetch;
 * @param
 * {string} lang
 * @returns
 * Promise < B_PROF_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_PROF_T >
{
  const dataRes0 = await UPROF_UP_ENTRY_1
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