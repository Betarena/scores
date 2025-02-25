// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 05-03-2024                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Page Preload Logic for Player Page
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { ERROR_CODE_INVALID, PRELOAD_ERROR_MSG_PLAYER, dlog, dlogv2 } from '$lib/utils/debug';
import { tryCatch } from '$lib/utils/miscellenous.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';

import type { Main_Data, Opengraph_Data, Twitter_Data } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_PFIX_D, B_PFIX_T } from '@betarena/scores-lib/types/player-fixtures';
import type { B_PPRO_T } from '@betarena/scores-lib/types/player-profile';
import type { B_PSEO_D, B_PSEO_T } from '@betarena/scores-lib/types/player-seo.js';
import type { B_PSTAT_T } from '@betarena/scores-lib/types/player-statistics.js';
import type { B_PTEAM_D, B_PTEAM_T } from '@betarena/scores-lib/types/player-team.js';
import type { B_SAP_D1, B_SAP_D2, B_SAP_D3, B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/v8/preload.scores.js';
import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Debuging string module name.
   */
  strDebugModuleName = 'src/routes/[[lang=lang]]/[player=player]/[...player_fill]'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ ⛩️ TYPES

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData0 =
[
  B_SAP_PP_D | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData1 =
[
  B_SAP_PP_T | undefined,
  B_SAP_D1 | undefined,
  B_SAP_D2 | undefined,
  B_SAP_D3 | undefined,
  B_PPRO_T | undefined,
  B_PFIX_T | undefined,
  B_PFIX_D | undefined,
  B_PSTAT_T | undefined,
  B_PTEAM_T | undefined,
  B_PTEAM_D | undefined,
  B_PSEO_T | undefined,
  B_PSEO_D | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData2 =
[
  ...IPreloadData0,
  ...IPreloadData1
];

// #endregion ➤ ⛩️ TYPES

// #region ➤ 🛠️ METHODS

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟥 │ LOGIC - MAIN                                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Logic for `[[lang=lang]]` route data preload.
 * @return { Promise < {} > }
 *  📤 Respective `data` for _this_ route.
 */
export async function main
(
  event: ServerLoadEvent,
  parentData:
  {
    langParam: string
  }
): Promise < {} >
{
  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} main(..) // START`,
    true
  );

  const
    // [🐞]
    t0 = performance.now(),
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
    {
      // lang,
      /* example :: player | jugador */
      // player,
      /* example :: teddy-teuma/829643 | harry-kane/997 */
      player_fill
    } = event.params,
    /**
     * @description
     *  📣 Target `fixture id`.
     */
    playerId = player_fill!.match(/\d+$/),
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
    {
      isValid: isUrlValid
    }
      = await promiseValidUrlCheck
      (
        event.fetch,
        {
          langUrl: parentData.langParam,
          playerUrl: player_fill
        }
      ),
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any = {}
  ;

  if (!isUrlValid)
    preloadExitLogic
    (
      t0,
      '[...player_fill]',
      ERROR_CODE_INVALID,
      PRELOAD_ERROR_MSG_PLAYER
    );
  ;

  // ╭─────
  // │ NOTE:
  // │ |: 📣 Destruct `object`.
  // ╰─────
  [
    response.PAGE_DATA,
    response.PAGE_SEO,
    response.B_SAP_D1,
    response.B_SAP_D2,
    response.B_SAP_D3,
    response.B_PPRO_T,
    response.B_PFIX_T,
    response.B_PFIX_D,
    response.B_PSTAT_T,
    response.B_PTEAM_T,
    response.B_PTEAM_D,
    response.B_PSEO_T,
    response.B_PSEO_D
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam,
    playerId?.[0] as unknown as string,
  );

  const
    /**
     * @description
     *  📣 Mutated `Page SEO` data.
     */
    PAGE_SEO_M
      = mutateSeoData
      (
        response.PAGE_DATA,
        response.PAGE_SEO,
        event.url.pathname,
        parentData.langParam,
        playerId?.[0] as unknown as string,
        response.PAGE_SEO?.player,
      )
  ;

  // [🐞]
  dlogv2
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} main(..) // END`,
    [
      `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
      `⏳ [PLAYER] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
    ],
    true
  );

  return {
    ...response,
    PAGE_SEO_M,
  };
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟦 │ LOGIC - HELPER                                                              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📝 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  ❗️ **REQUIRED** Instance of `fetch` object.
 * @param { string } _lang
 *  ❗️ **REQUIRED** `language`.
 * @param { string } _playerId
 *  ❗️ **REQUIRED** `player id`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  _playerId: string
): Promise < IPreloadData2 >
{
  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} fecthData(..) // START`,
    true
  );

  const
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
    [
      PAGE_DATA
    ] = await promiseUrlsPreload
    (
      [
        `/api/data/main/seo-pages?player_id=${_playerId}&page=player&decompress`
      ],
      fetch
    ) as IPreloadData0,
    /**
     * @description
     *  📣 Target `country id`.
     */
    intCountryId = PAGE_DATA?.data?.country_id,
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    listUrls
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=player&decompress`,
        `/api/data/main/seo-pages?country_id=${intCountryId}&decompress`,
        `/api/data/main/seo-pages?months=true&lang=${_lang}&decompress`,
        '/api/data/main/seo-pages?term=football&decompress',
        `/api/data/players/profile?lang=${_lang}`,
        `/api/data/players/fixtures?lang=${_lang}`,
        `/api/data/players/fixtures?player_id=${_playerId}&limit=10&offset=0`,
        `/api/data/players/statistics?lang=${_lang}`,
        `/api/data/players/team?lang=${_lang}`,
        `/api/data/players/team?player_id=${_playerId}`,
        `/api/data/players/seo?lang=${_lang}`,
        `/api/data/players/seo?player_id=${_playerId}&lang=${_lang}`
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    dataRes0
      = await promiseUrlsPreload
      (
        listUrls,
        fetch
      ) as IPreloadData1
  ;

  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} fecthData(..) // END`,
    true
  );

  return [
    PAGE_DATA,
    ...dataRes0
  ];
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @param { B_SAP_PP_D | undefined } pageData
 *  ❗️ **REQUIRED** Data object containing `SEO` **critical** information.
 * @param { B_SAP_PP_T | undefined } pageSeo
 *  ❗️ **REQUIRED** Data object containing `SEO` **critical** information.
 * @param { string } _pathname
 *  ❗️ **REQUIRED** `pathname`.
 * @param { string } _lang
 *  ❗️ **REQUIRED** Target `language`.
 * @param { string } _playerId
 *  ❗️ **REQUIRED** Target `player id`.
 * @param { string | undefined } _playerTranslationTerm
 *  ❗️ **REQUIRED** player (page) target `player term` _translation_.
 * @returns { B_SAP_PP_T }
 *  📤 Mutated data `object`.
 */
function mutateSeoData
(
  pageData: B_SAP_PP_D | undefined,
  pageSeo: B_SAP_PP_T | undefined,
  _pathname: string,
  _lang: string,
  _playerId: string,
  _playerTranslationTerm: string | undefined
): B_SAP_PP_T
{
  // [🐞]
  dlogv2
  (
    // [🐞]
    `🚏 [checkpoint] ➤ ${strDebugModuleName} mutateSeoData(..) // START`,
    [
      `🔹 [var] ➤ _pathname ${_pathname}`,
      `🔹 [var] ➤ _playerId ${_playerId}`,
      `🔹 [var] ➤ pageData?.data?.player_name ${pageData?.data?.player_name}`,
      `🔹 [var] ➤ pageData?.data?.team_name ${pageData?.data?.team_name}`,
      `🔹 [var] ➤ _lang ${_lang}`,
      `🔹 [var] ➤ _playerTranslationTerm ${_playerTranslationTerm}`,
    ],
    true
  );

  if (!pageSeo) return { };

  const
    /**
     * @description
     *  📣 Target `player name`.
     */
    playerName = pageData?.data?.player_name?.replaceAll('\t', '')
  ;

  pageSeo.main_data = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.main_data)
          .replace('/{lang}/{type}/{name}/{id}', _pathname)
          .replace('/{type}/{name}/{id}', _pathname)
          .replace(/{id}/g, _playerId)
          .replace(/{name}/g, (playerName ?? ''))
          .replace(/{team}/g, (pageData?.data?.team_name ?? ''))
          .replace(/{lang}/g, _lang)
          .replace(/{type}/g, (_playerTranslationTerm ?? ''))
      )
    }
  ) as Main_Data;

  pageSeo.twitter_card = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.twitter_card)
          .replace('/{lang}/{type}/{name}/{id}', _pathname)
          .replace('/{type}/{name}/{id}', _pathname)
          .replace(/{id}/g, _playerId)
          .replace(/{name}/g, (playerName ?? ''))
          .replace(/{team}/g, (pageData?.data?.team_name ?? ''))
          .replace(/{lang}/g, _lang)
          .replace(/{type}/g, (_playerTranslationTerm ?? ''))
      )
    }
  ) as Twitter_Data;

  pageSeo.opengraph = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.opengraph)
          .replace('/{lang}/{type}/{name}/{id}', _pathname)
          .replace('/{type}/{name}/{id}', _pathname)
          .replace(/{id}/g, _playerId)
          .replace(/{name}/g, (playerName ?? ''))
          .replace(/{team}/g, (pageData?.data?.team_name ?? ''))
          .replace(/{lang}/g, _lang)
          .replace(/{type}/g, (_playerTranslationTerm ?? ''))
      )
    }
  ) as Opengraph_Data;

  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} mutateSeoData(..) // END`,
    true
  );

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS
