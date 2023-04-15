//#region ➤ Package Imports

import { initGrapQLClient } from '$lib/graphql/init';
import { json } from '@sveltejs/kit';

import { PPRO_PP_ENTRY, PPRO_PP_get_widget_translations, PPRO_PP_translations_main } from "@betarena/scores-lib/dist/functions/func.player-profile.js";
import { PP_C_D_A } from '@betarena/scores-lib/dist/redis/config.js';
import type { B_PPRO_D, B_PPRO_T } from "@betarena/scores-lib/types/player-profile";
import { get_target_hset_cache_data } from '../../../cache/std_main';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
// const logs = [];

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise <unknown> {
  
	const lang: string = req?.url?.searchParams?.get('lang');
	const player_id: string = req?.url?.searchParams?.get('player_id');

  // NOTE: player (page) data;
  // IMPORTANT CACHE + FALLBACK (HASURA)
  if (player_id) {

    const _player_id: number = parseInt(player_id)
    let loadType = "cache";

    // NOTE: check in cache;
    let data =
			await get_target_hset_cache_data(
				PP_C_D_A,
				lang
			)
    ;

    // NOTE: (default) fallback;
		if (!data) {
      data = await fallbackMainData(
        _player_id
      );
      loadType = 'HASURA'
		}

    console.log(`📌 loaded with: ${loadType}`)

    return json(data);
  }

  // [ℹ] target widget [translation]
	if (lang) {
		const response_hasura =
			await fallbackMainData_1(lang);
		if (response_hasura) {
			return json(response_hasura);
		}
	}

  // IMPORTANT 
  // ultimate fallback to NULL
	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD [FALLBACK]
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @summary [MAIN] [FALLBACK] [#0] method
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} _player_id
 * @returns Promise < B_PPRO_D >
 */
async function fallbackMainData (
  _player_id: number
): Promise < B_PPRO_D > {

  const map = await PPRO_PP_ENTRY(
    graphQlInstance,
    [_player_id],
    false
  )
  
  if (map.size == 0) {
    return null
  }
  
	return map.get(_player_id);
}

/**
 * @summary [MAIN] [FALLBACK] [#1] method
 * @version 1.0 - past versions: []
 * @param {string} LANG 
 * @returns Promise < B_PPRO_T > 
 */
async function fallbackMainData_1(
  LANG: string
): Promise < B_PPRO_T > {

  const res = await PPRO_PP_get_widget_translations(
    graphQlInstance,
    [LANG]
  )

  const fix_odds_translation_map = await PPRO_PP_translations_main(
    res,
    [LANG]
  )

	return fix_odds_translation_map.get(LANG);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]