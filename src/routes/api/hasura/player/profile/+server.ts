//#region ➤ Package Imports

import { initGrapQLClient } from '$lib/graphql/init';
import { json } from '@sveltejs/kit';

import { PPRO_PP_generate_players_main, PPRO_PP_get_target_player, PPRO_PP_get_widget_translations, PPRO_PP_translations_main } from "@betarena/scores-lib/dist/functions/func.player-profile.js";
import type { B_PPRO_D, B_PPRO_T } from "@betarena/scores-lib/types/player-profile";

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
	const lang: string = req.url['searchParams'].get('lang');
	const player_id: string = req.url['searchParams'].get('player_id');

  // NOTE: player (page) data;
  if (player_id) {
    const _player_id: number = parseInt(player_id)
    const data = await main_player_page_data(
      _player_id
    );
    return json(data);
  }

  // [ℹ] target widget [translation]
	if (lang) {
		const response_hasura =
			await main_trans_and_seo(lang);
		if (response_hasura) {
			return json(response_hasura);
		}
	}

  // IMPORTANT - fallback to NULL
	return json(null);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @description [MAIN] method - for players
 * page main initial data gather;
 * @todo [TODO:] 1. offset map-gen. to "scores-lib"
 * @param {number} _player_id
 * @returns Promise < B_SAP_PP_D >
 */
async function main_player_page_data (
  _player_id: number
): Promise < B_PPRO_D > {

	const dataRes1 = await PPRO_PP_get_target_player(
    graphQlInstance,
		_player_id
	)
	// [ℹ] (validation) exit;
	if (dataRes1 == undefined) {
		return null;
	}

	// [ℹ] map of player data generation;
  const map = await PPRO_PP_generate_players_main (
    dataRes1
  )

  if (map.size == 0) {
    return null
  }
  
	return map.get(_player_id);
}

/**
 * @description [MAIN] method - obtains target
 * data on a target langauge for Probabilities Fixture (widget);
 * @version 1.0 - past versions: []
 * @param {string} LANG 
 * @returns Promise < B_PPRO_T > 
 */
async function main_trans_and_seo(
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