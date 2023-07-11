//#region ➤ Package Imports

import { json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init';
import { HLV2_HP_ENTRY, HLV2_HP_ENTRY_2, HLV2_HP_ENTRY_3 } from '@betarena/scores-lib/dist/functions/func.home.livescores-v2.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import type { B_LS2_D, B_LS2_T } from '@betarena/scores-lib/types/livescores-v2.js';
import { get_target_hset_cache_data, get_target_string_cache_data } from '../../../../../lib/redis/std_main';

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

  // NOTE: Handle url-query data;
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
  const if_M_0: boolean =
    !lang
    && !seo
    && !fixtureIds
  ;
  if (if_M_0)
  {
    let data: unknown;
    let loadType = "cache";
    // NOTE: check in cache;
    if (!hasura)
    {
      data =
        await get_target_string_cache_data
        (
          RedisKeys.LS2_C_D_A
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
  const if_M_1 =
    !lang
    && !seo
    && fixtureIds
  ;
  if (if_M_1)
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
  const if_M_2: boolean =
    lang
    && !seo
  ;
  if (if_M_2)
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
  const if_M_3: boolean =
    lang != undefined
    && seo != undefined
  ;
  if (if_M_3)
  {
    let data: unknown;
    let loadType = "cache";
    // NOTE: check in cache;
    if (!hasura)
    {
      data =
        await get_target_hset_cache_data
        (
          RedisKeys.LS2_C_S_A,
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

  const dataRes = await HLV2_HP_ENTRY
  (
    graphQlInstance,
    targetDateIso
  )

  delete dataRes?.[0]?.leagues_feat_list;
  delete dataRes?.[0]?.leagues_geo_list;

	return dataRes?.[0];
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} LANG
 * @returns Promise < B_PSTAT_T >
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_LS2_T >
{

  const dataRes0 = await HLV2_HP_ENTRY_2
  (
    graphQlInstance,
    [lang]
  );


	return dataRes0?.[0].get(lang);
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

  const dataRes0 = await HLV2_HP_ENTRY_3
  (
    graphQlInstance,
    fixtureIdsList
  );

	return Object.fromEntries(dataRes0?.[0]);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]