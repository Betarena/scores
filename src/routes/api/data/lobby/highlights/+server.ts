// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ 📝 DESCRIPTION                                                        ▓▓
// ▓▓ Application Server Endpoint for Competiton Highlights                 ▓▓
// ▓▓ Data Fetch + Handle                                                   ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

import { get_target_hset_cache_data } from '$lib/redis/std_main.js';
import { checkNull } from '$lib/utils/platform-functions.js';
import { CHIGH_CP_ENTRY, CHIGH_CP_ENTRY_1, CHIGH_CP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.competition.lobby.highlights.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';

import type { B_COMP_HIGH_D, B_COMP_HIGH_D_EXTRA, B_COMP_HIGH_D_RES, B_COMP_HIGH_S, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

// ▓▓ IMPORTANT
// ▓▓ allows for 'NodeJs' to access secrets for '@scores/lib'.
dotenv.config();

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ ENDPOINT ENTRY                              ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

export async function GET
(
  req: any
): Promise < unknown >
{
  try
  {
    // ▓▓ NOTE:
    // ▓▓ handle url-query data
    const lang: string = req?.url?.searchParams?.get('lang');
    const seo: string = req?.url?.searchParams?.get('seo');
    const offset: string = req?.url?.searchParams?.get('offset');
    const limit: string = req?.url?.searchParams?.get('limit');
    const targetStatus: B_COMP_HIGH_D_EXTRA = req?.url?.searchParams?.get('targetStatus') as B_COMP_HIGH_D_EXTRA;
	  const competitionIds: string = req?.url?.searchParams?.get('competitionIds');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    let data: unknown;
    let loadType: string = '⚡️ CACHE';

    // ▓▓ CHECK
    // ▓▓ for target data competition - highlights (widget) MAIN DATA.
    // ▓▓ NOTE:
    // ▓▓ cache & hasura (fallback) solution.
    const if_M_0: boolean =
      !checkNull(offset)
      && !checkNull(targetStatus)
      && checkNull(competitionIds)
      && checkNull(lang)
      && checkNull(seo)
    ;
    if (if_M_0)
    {

      // NOTE: check CACHE;
      if (!hasura)
      {
        data =
          await get_target_hset_cache_data
          (
            RedisKeys.PLOBBY_C_D_A_2,
            targetStatus
          )
        ;
      }

      // ▓▓ NOTE:
      // ▓▓ (default) HASURA fallback.
      if (!data || hasura)
      {
        data = await fallbackMainData
        (
          parseInt(offset),
          parseInt(limit),
          targetStatus
        );
        loadType = '🟦 Hasura (SQL)';
      }

      // console.log(`📌 loaded [LOBBY-DATA] with: ${loadType}`);

      if (data != undefined) return json(data);
    }

    // ▓▓ CHECK
    // ▓▓ for target data competition - highlights (widget) TRANSLATIONS DATA.
    // ▓▓ NOTE:
    // ▓▓ cache & hasura (fallback) solution.
    const if_M_1: boolean =
      !checkNull(lang)
      && checkNull(seo)
    ;
    if (if_M_1)
    {
      // NOTE: check CACHE;
      if (!hasura)
      {
        data =
          await get_target_hset_cache_data
          (
            RedisKeys.PLOBBY_C_T_A,
            lang
          )
        ;
      }

      // ▓▓ NOTE:
      // ▓▓ (default) HASURA fallback.
      if (!data || hasura)
      {
        data =	await fallbackMainData_1
        (
          lang
        );
        loadType = '🟦 Hasura (SQL)';
      }

      console.log(`📌 loaded [LOBBY-TRANS] with: ${loadType}`);

      if (data != undefined) return json(data);
    }

    // ▓▓ CHECK
    // ▓▓ for target data competition - highlights (widget) SEO DATA.
    // ▓▓ NOTE:
    // ▓▓ cache & hasura (fallback) solution.
    const if_M_2: boolean =
      !checkNull(lang)
      && !checkNull(seo)
    ;
    if (if_M_2)
    {

      // NOTE: check CACHE;
      if (!hasura)
      {
        data =
          await get_target_hset_cache_data
          (
            RedisKeys.PLOBBY_C_S_A,
            lang
          )
        ;
      }

      // ▓▓ NOTE:
      // ▓▓ (default) HASURA fallback.
      if (!data || hasura)
      {
        data = await fallbackMainData_2
        (
          lang
        );
        loadType = '🟦 Hasura (SQL)';
      }

      // console.log(`📌 loaded [LOBBY-SEO] with: ${loadType}`);

      if (data != undefined) return json(data);
    }

    // ▓▓ CHECK
    // ▓▓ complementary data
    const if_M_3: boolean =
      !checkNull(competitionIds)
    ;
    if (if_M_3)
    {
      const fixtureIdsList: number[] = competitionIds
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

      const data: B_COMP_HIGH_D_RES =	await fallbackMainData_3
      (
        fixtureIdsList
      );
      if (data != undefined) return json(data);
    }

    // ▓▓ IMPORTANT
    // ▓▓ fallback to NULL.
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

// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ METHOD(s)                                   ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Competitions Highlights** Main Data.
 * @param { number } offset
 *  Target `offset` for competition.
 * @param { number } limit
 *  Target `limit` for competition.
 * @param { B_COMP_HIGH_D_EXTRA } targetStatus
 *  Target `status` for competition.
 * @returns { Promise < B_COMP_HIGH_D_RES > }
 *  Target response for expected options on `competitions - highlights` data.
 */
async function fallbackMainData
(
  offset: number,
  limit: number,
  targetStatus: B_COMP_HIGH_D_EXTRA
): Promise < B_COMP_HIGH_D_RES >
{
  const dataRes0: [ Map < number, B_COMP_HIGH_D >, number, string[] ] = await CHIGH_CP_ENTRY
  (
    {
      targetStatus,
      limit,
      offset
    }
  );

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return {
    data: [...dataRes0?.[0].entries()],
    limit: dataRes0?.[1]
  };
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Competition** Translation Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_COMP_HIGH_T > }
 *  Target response for expected options on `competitions - highlights` translations data.
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

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(lang);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Competition** SEO Data.
 * @param { string } lang
 *  Target SEO language to retrieve data for.
 * @returns { Promise < B_COMP_HIGH_S > }
 *  Target response for expected options on `competitions - highlights` SEO data.
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

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(lang);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Competition** Complementary Data.
 * @param { number[] } competitionIds
 *  Target competition generated data for `competition - highlights` data.
 * @returns { Promise < B_COMP_HIGH_D_RES > }
 *  Target response for expected options on `competitions - highlights` complementary data.
 */
async function fallbackMainData_3
(
  competitionIds: number[],
): Promise < B_COMP_HIGH_D_RES >
{
  const dataRes0: [ Map < number, B_COMP_HIGH_D >, number, string[] ] = await CHIGH_CP_ENTRY
  (
    {
      competitionIds
    }
  );

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return {
    data: [...dataRes0?.[0].entries()],
    limit: dataRes0?.[1]
  };
}

// #endregion ➤ 🛠️ METHODS