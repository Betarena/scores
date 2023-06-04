//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { FVOT_FP_ENTRY, FVOT_FP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.votes.js';

import { B_C_VOT_F_M_D1 } from '@betarena/scores-lib/dist/graphql/query.votes.js';
import type { B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { B_H_VOT_M, B_VOT_D } from '@betarena/scores-lib/types/votes.js';

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
    // query (url) data
    const lang: string = req?.url?.searchParams?.get('lang');
	  const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
    const vote: string = req?.url?.searchParams?.get('vote');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // NOTE: fixture (H2H) data; (MAIN)
    const if_M_0 =
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
      console.log(`📌 loaded [FLIN] with: ${loadType}`)
      return json(data);
    }

    // NOTE: fixture (lineup) data; (TRANSLATION) [w/fallback]
    if (lang) 
    {
      // TODO: LIN_C_T_A
      const response =	await fallbackMainData_1
      (
        lang
      );
      if (response) 
      {
        return json(response);
      }
    }

    // NOTE: fixture (vote) persist vote; [HASURA]
    const if_M_1 =
      fixture_id != undefined
      && vote != undefined
    ;
    if (if_M_1)
    {
      const _fixture_id = parseInt(fixture_id)
      console.log('vote', vote)
      const response =await helperMainAction
      (
        _fixture_id,
        vote
      )
      return json(response);
    }

    // fallback to NULL
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
  const map = await FVOT_FP_ENTRY
  (
    graphQlInstance,
    [fixtureId]
  )

  if (map.size == 0) 
  {
    return null
  }
  
	return map.get(fixtureId);
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
  const map = await FVOT_FP_ENTRY_1
  (
    graphQlInstance,
    [lang]
  );

  if (map.size == 0) 
  {
    return null
  }
  
	return map.get(lang);
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

  const data: B_H_VOT_M = await graphQlInstance.request
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