// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

import { checkNull } from '$lib/utils/platform-functions.js';
import { CHIGH_CP_ENTRY, CHIGH_CP_ENTRY_1, CHIGH_CP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.competition.lobby.highlights.js';

import type { B_COMP_HIGH_D, B_COMP_HIGH_D_RES, B_COMP_HIGH_S, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

// ### IMPORTANT
// ### allows for 'NodeJs' to access secrets for '@scores/lib'.
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
    // ### IMPORTANT
    // ### Handle url-query data.
    const lang: string = req?.url?.searchParams?.get('lang');
    const seo: string = req?.url?.searchParams?.get('seo');
    const offset: string = req?.url?.searchParams?.get('offset');
    const limit: string = req?.url?.searchParams?.get('limit');
    const targetStatus: string = req?.url?.searchParams?.get('targetStatus');
	  const competitionIds: string = req?.url?.searchParams?.get('competitionIds');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ### CHECK
    // for target data competition - highlights (widget) MAIN DATA.
    // ### NOTE:
    // ### cache & hasura (fallback) solution.
    const if_M_0: boolean =
      !checkNull(offset)
      && !checkNull(targetStatus)
      && checkNull(competitionIds)
      && checkNull(lang)
      && checkNull(seo)
    ;
    if (if_M_0)
    {
      let data: unknown;
      let loadType: string = '⚡️ CACHE';

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

      // ### NOTE:
      // ### (default) HASURA fallback.
      if (!data || hasura)
      {
        data = await fallbackMainData
        (
          parseInt(offset),
          parseInt(limit),
          targetStatus
        );
        loadType = '💿 HASURA';
      }

      console.log(`📌 loaded [FSCR] with: ${loadType}`);

      if (data != undefined) return json(data);
    }

    // ### CHECK
    // ### for target data competition - highlights (widget) TRANSLATIONS DATA.
    // ### NOTE:
    // ### cache & hasura (fallback) solution.
    const if_M_1: boolean =
      !checkNull(lang)
      && checkNull(seo)
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

    // ### CHECK
    // ### for target data competition - highlights (widget) SEO DATA.
    // ### NOTE:
    // ### cache & hasura (fallback) solution.
    const if_M_2: boolean =
      !checkNull(lang)
      && !checkNull(seo)
    ;
    if (if_M_2)
    {
      // TODO: LIN_C_T_A
      const data =	await fallbackMainData_2
      (
        lang
      );
      if (data != undefined) return json(data);
    }

    // ### CHECK
    // ### complementary data
    const if_M_3: boolean =
      !checkNull(competitionIds)
    ;
    if (if_M_3)
    {
      // TODO: LIN_C_T_A

      const fixtureIdsList = competitionIds
      ?.split
      (
        ','
      )
      ?.map
      (
        x =>
        parseInt
        (
          x
        )
      );

      const data =	await fallbackMainData_3
      (
        fixtureIdsList
      );
      if (data != undefined) return json(data);
    }

    // ### IMPORTANT
    // ### fallback to NULL.
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
  offset: number,
  limit: number,
  targetStatus: string
): Promise < B_COMP_HIGH_D_RES >
{
  const dataRes0: [ Map < number, B_COMP_HIGH_D >, number, string[] ] = await CHIGH_CP_ENTRY
  (
    [],
    targetStatus,
    limit,
    offset,
  );

  if (dataRes0?.[0]?.size == 0) return null;

	return {
    data: [...dataRes0?.[0].entries()],
    limit: dataRes0?.[1]
  };
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @version
 * 1.0 - past versions: []
 *
 * @param
 * { string } lang - Target language to retrieve data for.
 *
 * @returns
 * Target language TRANSLATIONS for competitions highligths (widget).
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_COMP_HIGH_T >
{
  const dataRes0: [ Map < string, B_COMP_HIGH_T >, string[] ] = await CHIGH_CP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0]?.size == 0) return null;

	return dataRes0?.[0]?.get(lang);
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * TODO: DOC:
 *
 * @param
 * { string } lang - Target SEO language to retrieve data for.
 *
 * @returns
 * Target language SEO for competitions highligths (widget).
 */
async function fallbackMainData_2
(
  lang: string
): Promise < B_COMP_HIGH_S >
{
  const dataRes0: [ Map < string, B_COMP_HIGH_S >, string[] ] = await CHIGH_CP_ENTRY_2
  (
    [lang]
  );

  if (dataRes0?.[0]?.size == 0) return null;

	return dataRes0?.[0]?.get(lang);
}

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
async function fallbackMainData_3
(
  competitionIds: number[],
): Promise < B_COMP_HIGH_D_RES >
{
  const dataRes0: [ Map < number, B_COMP_HIGH_D >, number, string[] ] = await CHIGH_CP_ENTRY
  (
    competitionIds
  );

  console.log(dataRes0)

  if (dataRes0?.[0]?.size == 0) return null;

	return {
    data: [...dataRes0?.[0].entries()],
    limit: dataRes0?.[1]
  };
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

// #endregion ➤ 🛠️ METHODS