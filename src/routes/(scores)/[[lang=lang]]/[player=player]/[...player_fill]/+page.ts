// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ 📝 DESCRIPTION                                                        ▓▓
// ▓▓ Server Endpoint for Player Page (Prefetch) Data Load                  ▓▓
// ▓▓ 🎟️ FILE TEMPLATE STRUCTURE VERSION                                    ▓▓
// ▓▓ v.7.0 ➤ (+page.ts)                                                    ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

// #region ➤ 📦 Package Imports


import { ERROR_CODE_INVALID, PRELOAD_ERROR_MSG_PLAYER, dlog, dlogv2 } from "$lib/utils/debug";
import { PRELOAD_exitPage, promiseUrlsPreload, promiseValidUrlCheck, tryCatch } from "$lib/utils/platform-functions";

import type { Main_Data, Opengraph_Data, Twitter_Data } from "@betarena/scores-lib/types/_HASURA_.js";
import type { B_PSEO_D, B_PSEO_T } from "@betarena/scores-lib/types/player-seo.js";
import type { B_PSTAT_T } from "@betarena/scores-lib/types/player-statistics.js";
import type { B_PTEAM_D, B_PTEAM_T } from "@betarena/scores-lib/types/player-team.js";
import type { B_SAP_D1, B_SAP_D2, B_SAP_PP_D, B_SAP_PP_T } from "@betarena/scores-lib/types/seo-pages";
import type { B_PFIX_D, B_PFIX_T } from "node_modules/@betarena/scores-lib/types/player-fixtures";
import type { B_PPRO_T } from "node_modules/@betarena/scores-lib/types/player-profile";
// @ts-ignore
import type { PageLoad } from "../$types";

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/** @type {import('./$types').PageLoad} */
export async function load
(
  {
    url,
    params,
    fetch
  }
): Promise < PageLoad >
{

  // ▓▓ [🐞]
  const t0: number = performance.now();

  const
  {
    lang,
    // player, /* example :: player | jugador */
    player_fill /* example :: teddy-teuma/829643 | harry-kane/997 */
  } = params;

  const urlLang: string =
    lang == undefined
      ? 'en'
      : lang
  ;

  const player_id: RegExpMatchArray = player_fill.match(/\d+$/);

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ 📌 VALIDATE URL                  ▓▓
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const validUrlCheck: boolean = await promiseValidUrlCheck
  (
    fetch,
    {
      langUrl: urlLang,
      playerUrl: player_fill
    }
  );

  // ▓▓ CHECK
  // ▓▓ for exit.
  if (!validUrlCheck)
  {
    PRELOAD_exitPage
    (
      t0,
      '[...player_fill]',
      ERROR_CODE_INVALID,
      PRELOAD_ERROR_MSG_PLAYER
    );
  }

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ 📌 PREFETCH DATA                 ▓▓
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  let
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
  ] = await fetchData
  (
    fetch,
    urlLang,
    player_id?.[0] as unknown as string,
  );

  PAGE_SEO = mutateSeoData
  (
    PAGE_DATA,
    PAGE_SEO,
    url?.pathname,
    urlLang,
    player_id?.[0] as unknown as string,
    PAGE_SEO?.player,
  );

  // ▓▓ [🐞]
  const t1: number = performance.now();

  // ▓▓ [🐞]
  dlog
  (
    `⏳ PLAYER preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
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
 *  📌 Target `types` for `_this_` page required at preload.
 */
type PP_PROMISE_0 =
[
  B_SAP_PP_D | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📌 Target `types` for `_this_` page required at preload.
 */
type PP_PROMISE_1 =
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
 *  📌 Target `types` for `_this_` page required at preload.
 */
type PP_PROMISE_FINAL =
[
  ...PP_PROMISE_0,
  ...PP_PROMISE_1
]

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  Target instance of `fetch` object.
 * @param { string } _lang
 *  Target `language`.
 * @param { string } _playerId
 *  Target `player id`.
 * @returns { Promise < PP_PROMISE_0 > }
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  _playerId: string
): Promise < PP_PROMISE_FINAL >
{

  // ### [🐞]
  dlog
  (
    `🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]]/[player=player]/[...player_fill] fecthData(..)`,
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
  ) as PP_PROMISE_0;

  if (PAGE_DATA == null || PAGE_DATA?.error != undefined)
    PRELOAD_exitPage
    (
      performance.now(),
      'player',
      400,
      (PAGE_DATA?.error?.reason ?? PRELOAD_ERROR_MSG_PLAYER)
    );
  ;

  const country_id: number = PAGE_DATA?.data?.country_id;

  const urls_0: string[] =
  [
		`/api/data/main/seo-pages?lang=${_lang}&page=player&decompress`,
    `/api/data/main/seo-pages?country_id=${country_id}&decompress`,
    `/api/data/main/seo-pages?months=true&lang=${_lang}&decompress`,
    `/api/data/players/profile?lang=${_lang}`,
    `/api/data/players/fixtures?lang=${_lang}`,
    `/api/data/players/fixtures?player_id=${_playerId}&limit=10&offset=0`,
    `/api/data/players/statistics?lang=${_lang}`,
    `/api/data/players/team?lang=${_lang}`,
    `/api/data/players/team?player_id=${_playerId}`,
    `/api/data/players/seo?lang=${_lang}`,
    `/api/data/players/seo?player_id=${_playerId}&lang=${_lang}`
  ];

  const data_2 = await promiseUrlsPreload
  (
    urls_0,
    fetch
  ) as PP_PROMISE_1;

  const finalData: PP_PROMISE_FINAL =
  [
    PAGE_DATA,
    ...data_2
  ];

  return finalData;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @param { B_SAP_FP_T } pageSeo
 *  player (page) target - critical data.
 * @param { string } _lang
 *  player (page) target `language` _translation_.
 * @param { string } _playerTranslationTerm
 *  player (page) target `player term` _translation_.
 * @returns { B_SAP_PP_T }
 * a mutated data `object`.
 */
function mutateSeoData
(
  pageData: B_SAP_PP_D,
  pageSeo: B_SAP_PP_T,
  _pathname: string,
  _lang: string,
  _playerId: string,
  _playerTranslationTerm: string
): B_SAP_PP_T
{

  // ▓▓ [🐞]
  dlogv2
  (
    // ### [🐞]
    `🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]]/[player=player]/[...player_fill] mutateSeoData(..)`,
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

  const playerName: string = pageData?.data?.player_name?.replaceAll('\t', '');

  // @ts-ignore
  pageSeo.main_data = tryCatch((): Main_Data =>
    JSON.parse
    (
      JSON.stringify(pageSeo?.main_data)
      ?.replace('/{lang}/{type}/{name}/{id}', _pathname)
      ?.replace('/{type}/{name}/{id}', _pathname)
      ?.replace(/{id}/g, _playerId)
      ?.replace(/{name}/g, playerName)
      ?.replace(/{team}/g, pageData?.data?.team_name)
      ?.replace(/{lang}/g, _lang)
      ?.replace(/{type}/g, _playerTranslationTerm)
    )
  );

  // @ts-ignore
	pageSeo.twitter_card = tryCatch((): Twitter_Data =>
    JSON.parse
    (
      JSON.stringify(pageSeo?.twitter_card)
      ?.replace('/{lang}/{type}/{name}/{id}', _pathname)
      ?.replace('/{type}/{name}/{id}', _pathname)
      ?.replace(/{id}/g, _playerId)
      ?.replace(/{name}/g, playerName)
      ?.replace(/{team}/g, pageData?.data?.team_name)
      ?.replace(/{lang}/g, _lang)
      ?.replace(/{type}/g, _playerTranslationTerm)
    )
  );

  // @ts-ignore
	pageSeo.opengraph = tryCatch((): Opengraph_Data =>
    JSON.parse
    (
      JSON.stringify(pageSeo?.opengraph)
      ?.replace('/{lang}/{type}/{name}/{id}', _pathname)
      ?.replace('/{type}/{name}/{id}', _pathname)
      ?.replace(/{id}/g, _playerId)
      ?.replace(/{name}/g, playerName)
      ?.replace(/{team}/g, pageData?.data?.team_name)
      ?.replace(/{lang}/g, _lang)
      ?.replace(/{type}/g, _playerTranslationTerm)
    )
  );

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS
