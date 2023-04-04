//#region ➤ Package Imports

import { initGrapQLClient } from '$lib/graphql/init';
import { json } from '@sveltejs/kit';

import { PFIX_PP_generate_players_main, PFIX_PP_get_target_player, PFIX_PP_get_target_player_0, PFIX_PP_get_widget_translations, PFIX_PP_translations_main } from "@betarena/scores-lib/dist/functions/func.player-fixtures.js";
import type { B_PFIX_D, B_PFIX_T } from '@betarena/scores-lib/types/player-fixtures';

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
	const limit: string = req.url['searchParams'].get('limit');
	const offset: string = req.url['searchParams'].get('offset');

  // NOTE: player (page) data;
  if (player_id) {
    const _player_id: number = parseInt(player_id)
    const _limit: number = parseInt(limit)
    const _offset: number = parseInt(offset)
    const data = await main_player_page_data(
      _player_id,
      _limit,
      _offset
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
  _player_id: number,
  _limit: number,
  _offset: number
): Promise < B_PFIX_D > {

	const dataRes1 = await PFIX_PP_get_target_player(
    graphQlInstance,
		_player_id,
    _limit,
    _offset
	)
	// [ℹ] (validation) exit;
	if (dataRes1 == undefined) {
    console.log(`❌ ERR: No data found for PFIX dataRes1`)
		return null;
	}

  let leagueIds = dataRes1?.historic_fixtures
    ?.map(x => x?.league_id)
  ;
  leagueIds = [...new Set(leagueIds)]
  console.log('leagueIds', leagueIds)

  const dataRes2 = await PFIX_PP_get_target_player_0(
    graphQlInstance,
		leagueIds
	)
	// [ℹ] (validation) exit;
	if (dataRes2 == undefined) {
    console.log(`❌ ERR: No data found for PFIX dataRes2`)
		return null;
	}

  const mergeData = {
		...dataRes1,
		...dataRes2
	}

	// [ℹ] map of player data generation;
  const [
    map,
    map2
  ] = await PFIX_PP_generate_players_main (
    mergeData
  )
  
  const validation_0 =
    map.size == 0
    || map2.size == 0
  ;
  if (validation_0) {
    console.log(`❌ ERR: No data found for PFIX validation_0`)
    return null
  }

  const response: B_PFIX_D = {
    data: {
      past_fixtures: Object.fromEntries(map),
      leagues: Object.fromEntries(map2)
    }
  }
  
	return response;
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
): Promise < B_PFIX_T > {

  const res = await PFIX_PP_get_widget_translations(
    graphQlInstance,
    [LANG]
  )

  const fix_odds_translation_map = await PFIX_PP_translations_main(
    res,
    [LANG]
  )

	return fix_odds_translation_map.get(LANG);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]