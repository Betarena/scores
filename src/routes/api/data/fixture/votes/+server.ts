//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { FVOT_FP_ENTRY, FVOT_FP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.fixture.votes.js';
import { B_C_VOT_F_M_D1 } from '@betarena/scores-lib/dist/graphql/query.votes.js';

import type { B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { B_H_VOT_M, B_VOT_D } from '@betarena/scores-lib/types/votes.js';

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
	  const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
    const vote: string = req?.url?.searchParams?.get('vote');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ACTION: Get Fixture Votes (WIDGET) MAIN data;
    // NOTE: With [HASURA] Fallback;
    const if_M_0: boolean =
      fixture_id != undefined
      && vote == undefined
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
          _fixture_id
        )
        loadType = 'HASURA'
      }

      console.log(`📌 loaded [FVOT] with: ${loadType}`)

      if (data != undefined) return json(data);
    }

    // ACTION: Get Fixture Votes (WIDGET) TRANSLATION data;
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

    // ACTION: Cast Fixture Target Vote data;
    // NOTE: Only [HASURA];
    const if_M_2: boolean =
      fixture_id != undefined
      && vote != undefined
    ;
    if (if_M_2)
    {
      const _fixture_id = parseInt(fixture_id)
      const data = await helperMainAction
      (
        _fixture_id,
        vote
      )
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
  fixtureId: number
): Promise < B_VOT_D >
{
  const dataRes0 = await FVOT_FP_ENTRY
  (
    [fixtureId]
  )

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(fixtureId);
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
  const dataRes0 = await FVOT_FP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0]?.size == 0)
  {
    return null
  }

	return dataRes0?.[0]?.get(lang);
}

async function helperMainAction
(
  fixtureId: number,
  voteType: string
)
{
  const VARIABLES =
  {
    match_id: fixtureId,
    _1_vote: voteType == '1' ? 1 : 0,
    _2_vote: voteType == '2' ? 1 : 0,
    _X_vote: voteType == 'X' ? 1 : 0
  }

  const data: B_H_VOT_M = await new _GraphQL().connection.request
  (
    B_C_VOT_F_M_D1,
    VARIABLES
  );

  return data;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]