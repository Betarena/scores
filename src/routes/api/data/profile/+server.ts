// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

import { UPROF_UP_ENTRY_0, UPROF_UP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.profile.js';
import { PROFU_insertUserTx } from '@betarena/scores-lib/dist/graphql/query.profile.js';

import type { B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';
import type { RequestHandler } from './$types';

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

    // ◾️ NOTE:
    // ◾️ Handle url-query data;
    const lang: string = req?.url?.searchParams?.get('lang');
    const uid: string = req?.url?.searchParams?.get('uid');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ◾️ NOTE:
    // ◾️ [Fetch] Obtain target user UID profile critical data.
    // ◾️ IMPORTANT
    // ◾️ Should not be cache and/or have cache store.
    const if_M_0: boolean =
      uid != undefined
    ;
    if (if_M_0)
    {
      const data = await fallbackMainData
      (
        uid
      );
      const loadType = 'HASURA';

      console.log(`📌 loaded [FSCR] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ◾️ NOTE:
    // ◾️ [Fetch] User Profile translations.
    // ◾️ Contains [HASURA] Fallback;
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

    // ◾️ IMPORTANT
    // ◾️ Fallback to NULL
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

export const POST =
(
  async (
  {
    request
  }
  ) =>
  {
    try
    {
      // ◾️ NOTE:
      // ◾️ Handle url-query data;
      const uid: string = request?.url?.searchParams?.get('uid');
      const body: any = await request.json();
      const jsonBody: B_H_TH = JSON.parse(JSON.stringify(body));

      // [🐞]
      console.debug
      (
        `🔹 [var] uid ${uid}`,
        `🔹 [var] body ${JSON.stringify(body)}`,
      );

      const data: string[] = await PROFU_insertUserTx
      (
        jsonBody
      );

      return json(null);
    }
    catch (error)
    {
      //
    }

  }
) satisfies RequestHandler;

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