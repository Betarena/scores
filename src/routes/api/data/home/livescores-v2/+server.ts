//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { HLV2_HP_ENTRY, HLV2_HP_ENTRY_2, HLV2_HP_ENTRY_3 } from '@betarena/scores-lib/dist/functions/func.livescores-v2.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import type { B_LS2_D, B_LS2_T } from '@betarena/scores-lib/types/livescores-v2.js';
import { get_target_hset_cache_data, get_target_string_cache_data } from '../../../cache/std_main';

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

  // query (url) data
	const lang: string = req?.url?.searchParams?.get('lang');
  const seo: string =	req?.url?.searchParams?.get('seo');
	const date: string = req?.url?.searchParams?.get('date');
	const fixtureIds: string = req?.url?.searchParams?.get('fixtureIds');
  const hasura: string = req?.url?.searchParams?.get('hasura');

  /**
   * @summary [MAIN] [DATA]
   * @description get target
   * livescores (v2) main widget data;
   * NOTE: with Hasura (source) fallback
   */
  const if_0 =
    !lang 
    && !seo
    && !fixtureIds
  ;
  if (if_0) 
  {
    let data: unknown;
    let loadType = "cache";
    // NOTE: check in cache;
    if (!hasura) 
    {
      data =
        await get_target_string_cache_data
        (
          RedisKeys.LS2_C_D_A_2
        )
      ;
    }
    // NOTE: (default) fallback;
		if (!data || hasura) 
    {
      data = await fallbackMainData
      (
        date
      )
      loadType = 'HASURA'
		}
    console.log(`📌 loaded [HLSV2] [D] with: ${loadType}`)
    return json(data);
  }

  /**
   * @summary [MAIN] [DATA]
   * @description get target
   * livescores (v2) TARGET widget data;
   * NOTE: ONLY Hasura (source)
   */
  const if_1 =
    !lang 
    && !seo
    && fixtureIds
  ;
  if (if_1)
  {
    const res =	await fallbackMainData_2
    (
      fixtureIds
    );
    console.log(`📌 loaded [HLSV2] [DT] with: HASURA`)
    return json(res);
  }

  /**
   * @summary [MAIN] [DATA]
   * @description get target
   * livescores (v2) translation/SEO data;
   * NOTE: with Hasura (source) fallback
   */
  const if_2 =
    lang
    && !seo
  ;
  if (if_2) 
  {
    let data: unknown;
    let loadType = "cache";
    // NOTE: check in cache;
    if (!hasura) 
    {
      data =
        await get_target_hset_cache_data
        (
          RedisKeys.LS2_C_T_A,
          lang
        )
      ;
    }
    // NOTE: (default) fallback;
		if (!data || hasura) 
    {
      data = await fallbackMainData_1
      (
        lang
      )
      loadType = 'HASURA'
		}
    console.log(`📌 loaded [HLSV2] [T] with: ${loadType}`)
    return json(data);
	}

  /**
   * @summary [MAIN] [DATA]
   * @description get target
   * livescores (v2) exclusive SEO widget data;
   * NOTE: with Hasura (source) fallback
   */
  const if_3 =
    lang != undefined
    && seo != undefined
  ;
  if (if_3) 
  {
    let data: unknown;
    let loadType = "cache";
    // NOTE: check in cache;
    if (!hasura) 
    {
      data =
        await get_target_hset_cache_data
        (
          RedisKeys.LS2_C_S_A_2,
          lang
        )
      ;
    }
    // NOTE: (default) fallback;
		if (!data || hasura) 
    {
      // data = await fallbackMainData
      // (
      //   _player_id
      // )
      loadType = 'HASURA'
		}
    console.log(`📌 loaded [HLSV2] [S] with: ${loadType}`)
    return json(data);
  }

  // IMPORTANT - (ultimate) fallback to NULL
	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @summary [MAIN] [FALLBACK] [#0] method
 * page main initial data gather;
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} _player_id
 * @returns Promise < B_PSTAT_D >
 */
async function fallbackMainData 
(
  targetDateIso: string
): Promise < B_LS2_D > 
{

  const data = await HLV2_HP_ENTRY
  (
    graphQlInstance,
    targetDateIso
  )

  delete data.leagues_feat_list;
  delete data.leagues_geo_list;

	return data;
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} LANG 
 * @returns Promise < B_PSTAT_T > 
 */
async function fallbackMainData_1
(
  LANG: string
): Promise < B_LS2_T > 
{

  const map_0 = await HLV2_HP_ENTRY_2
  (
    graphQlInstance,
    [LANG]
  )

	return map_0.get(LANG);
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} fixtureIds 
 * @returns Promise < B_PSTAT_T > 
 */
async function fallbackMainData_2
(
  fixtureIds: string
)
{
  
  const fixtureIdsList = fixtureIds
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
  
  console.log('fixtureIdsList', fixtureIdsList)

  const map_0 = await HLV2_HP_ENTRY_3
  (
    graphQlInstance,
    fixtureIdsList
  );

	return Object.fromEntries(map_0);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]