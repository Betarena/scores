// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader ('Client-Side')                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { ERROR_CODE_INVALID, PRELOAD_ERROR_MSG_PLAYER, dlog, dlogv2 } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck, tryCatch } from '$lib/utils/platform-functions';

import type { Main_Data, Opengraph_Data, Twitter_Data } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_PSEO_D, B_PSEO_T } from '@betarena/scores-lib/types/player-seo.js';
import type { B_PSTAT_T } from '@betarena/scores-lib/types/player-statistics.js';
import type { B_PTEAM_D, B_PTEAM_T } from '@betarena/scores-lib/types/player-team.js';
import type { B_SAP_D1, B_SAP_D2, B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/seo-pages';
import type { B_PFIX_D, B_PFIX_T } from 'node_modules/@betarena/scores-lib/types/player-fixtures';
import type { B_PPRO_T } from 'node_modules/@betarena/scores-lib/types/player-profile';
import type { PageLoad } from '../../[sport]/$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').PageLoad}
 */
export async function load
(
  {
    url,
    params,
    fetch
  }
): Promise < PageLoad >
{
  const
    /**
     * @description
     *  📣 Purely for `debug` and `performance metric` purposes.
     */
    t0: number = performance.now(),
    {
      lang,
      /* example :: player | jugador */
      // player,
      /* example :: teddy-teuma/829643 | harry-kane/997 */
      player_fill
    } = params,
    /**
     * @description
     *  📣
     */
    urlLang: string
      = lang == undefined
        ? 'en'
        : lang,
    /**
     * @description
     *  📣
     */
    playerId = player_fill.match(/\d+$/),
    /**
     * @description
     *  📣
     */
    validUrlCheck: boolean
      = await promiseValidUrlCheck
      (
        fetch,
        {
          langUrl: urlLang,
          playerUrl: player_fill
        }
      )
  ;

  if (!validUrlCheck)
    preloadExitLogic
    (
      t0,
      '[...player_fill]',
      ERROR_CODE_INVALID,
      PRELOAD_ERROR_MSG_PLAYER
    );
  ;

  const
    /**
     * @description
     *  📣 Fetch target `data`.
     */
    [
      PAGE_DATA,
      PAGE_SEO,
      B_SAP_D1,
      B_SAP_D2,
      B_PPRO_T,
      B_PFIX_T,
      B_PFIX_D,
      B_PSTAT_T,
      B_PTEAM_T,
      B_PTEAM_D,
      B_PSEO_T,
      B_PSEO_D
    ]
      = await fetchData
      (
        fetch,
        urlLang,
        playerId?.[0] as unknown as string,
      ),
    /**
     * @description
     *  📣 Mutated `Page SEO` data.
     */
    PAGE_SEO_M
      = mutateSeoData
      (
        PAGE_DATA,
        PAGE_SEO,
        url?.pathname,
        urlLang,
        playerId?.[0] as unknown as string,
        PAGE_SEO?.player,
      ),
    /**
     * @description
     *  📣 Purely for `debug` and `performance metric` purposes.
     */
    t1 = performance.now()
  ;

  // [🐞]
  dlog
  (
    `⏳ PLAYER preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error 'unknown'
    // ╭─────
    // │ NOTE: FIXME:
    // │ > issues with setting correct <PageLoad> types.
    // ╰─────
    PAGE_DATA,
    PAGE_SEO_M,
    B_SAP_D1,
    B_SAP_D2,
    B_PPRO_T,
    B_PFIX_T,
    B_PFIX_D,
    B_PSTAT_T,
    B_PTEAM_T,
    B_PTEAM_D,
    B_PSEO_T,
    B_PSEO_D
  }
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]

// #region ➤ 🛠️ METHODS

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
]

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  💠 Target instance of `fetch` object.
 * @param { string } _lang
 *  💠 Target `language`.
 * @param { string } _playerId
 *  💠 Target `player id`.
 * @returns { Promise < IPreloadData0 > }
 *  📤 Target `data` fetched.
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
    '🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]]/[player=player]/[...player_fill] fecthData(..)',
    true
  );

  const
    [
      PAGE_DATA
    ] = await promiseUrlsPreload
    (
      [
        `/api/data/main/seo-pages?player_id=${_playerId}&page=player&decompress`
      ],
      fetch
    ) as IPreloadData0
  ;

  if (PAGE_DATA == null || PAGE_DATA.error != undefined)
    preloadExitLogic
    (
      performance.now(),
      'player',
      400,
      (PAGE_DATA?.error?.reason ?? PRELOAD_ERROR_MSG_PLAYER)
    );
  ;

  const
    countryId = PAGE_DATA?.data?.country_id,
    urls0: string[]
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=player&decompress`,
        `/api/data/main/seo-pages?country_id=${countryId}&decompress`,
        `/api/data/main/seo-pages?months=true&lang=${_lang}&decompress`,
        `/api/data/players/profile?lang=${_lang}`,
        `/api/data/players/fixtures?lang=${_lang}`,
        `/api/data/players/fixtures?player_id=${_playerId}&limit=10&offset=0`,
        `/api/data/players/statistics?lang=${_lang}`,
        `/api/data/players/team?lang=${_lang}`,
        `/api/data/players/team?player_id=${_playerId}`,
        `/api/data/players/seo?lang=${_lang}`,
        `/api/data/players/seo?player_id=${_playerId}&lang=${_lang}`
      ],
    data2
      = await promiseUrlsPreload
      (
        urls0,
        fetch
      ) as IPreloadData1,
    finalData: IPreloadData2
      = [
        PAGE_DATA,
        ...data2
      ]
  ;

  return finalData;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @param { B_SAP_PP_D | undefined } pageData
 *  💠 Target `SEO` **critical** data.
 * @param { B_SAP_PP_T | undefined } pageSeo
 *  💠 Target `SEO` **critical** data.
 * @param { string } _pathname
 *  💠 Target `pathname`.
 * @param { string } _lang
 *  💠 Target `language`.
 * @param { string } _playerId
 *  💠 Target `player id`.
 * @param { string | undefined } _playerTranslationTerm
 *  💠 player (page) target `player term` _translation_.
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
    '🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]]/[player=player]/[...player_fill] mutateSeoData(..)',
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

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS
