//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { FINC_FP_ENTRY, FINC_FP_ENTRY_1, FINC_FP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.fixture.incidents.js';

import type { B_H_SFPV2 } from '@betarena/scores-lib/types/hasura.js';
import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';

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
	  const player_ids: string = req?.url?.searchParams?.get('player_ids');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // NOTE: fixture (H2H) data; (MAIN)
    const if_0 =
      fixture_id != undefined
    ;
    if (if_0) 
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
      console.log(`📌 loaded [FINC] with: ${loadType}`)
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

    // NOTE: fixture (lineup) data; (PLAYERS) [w/fallback]
    const if_1 =
      player_ids != undefined
    ;
    if (if_1)
    {
      const _playerIds: number[] = 
        player_ids == undefined
          ? []
          : player_ids
            ?.split
            (
              ','
            )
            ?.map
            (
              x => 
              parseInt(x)
            )
      ;
      const data = await fallbackMainData_2
      (
        _playerIds
      )
      return json(data);
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
): Promise < B_INC_D > 
{
  const map = await FINC_FP_ENTRY
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
): Promise < B_INC_T > 
{
  const map = await FINC_FP_ENTRY_1
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

async function fallbackMainData_2
(
  playerIds: number[]
): Promise < [number, B_H_SFPV2][] >
{
  const map = await FINC_FP_ENTRY_2
  (
    graphQlInstance,
    playerIds
  );

  if (map.size == 0) 
  {
    return null
  }
  
	return [...map.entries()];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]