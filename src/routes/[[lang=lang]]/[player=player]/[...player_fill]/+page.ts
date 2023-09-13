// #region ➤ [MAIN] Package Imports

import { error } from "@sveltejs/kit";

import { dlog, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from "$lib/utils/debug";
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from "$lib/utils/platform-functions";

import type { B_PSEO_D, B_PSEO_T } from "@betarena/scores-lib/types/player-seo.js";
import type { B_PSTAT_T } from "@betarena/scores-lib/types/player-statistics.js";
import type { B_PTEAM_D, B_PTEAM_T } from "@betarena/scores-lib/types/player-team.js";
import type { B_SAP_D1, B_SAP_D2, B_SAP_PP_D, B_SAP_PP_T } from "@betarena/scores-lib/types/seo-pages";
import type { B_PFIX_D, B_PFIX_T } from "node_modules/@betarena/scores-lib/types/player-fixtures";
import type { B_PPRO_T } from "node_modules/@betarena/scores-lib/types/player-profile";
import type { PageLoad } from "../$types";

// #endregion ➤ [MAIN] Package Imports

const PAGE_LOG = '⏳ [PLAYERS] PRELOAD';

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

  const t0 = performance.now();

  //#region [0] IMPORTANT EXTRACT URL DATA

  const
  {
    lang,
    // (example) -> player | jugador (translation)
    // player,
    // (example) -> teddy-teuma/829643 | harry-kane/997
    player_fill
  } = params;

  const _lang =
    lang == undefined
      ? 'en'
      : lang
  ;

  const player_id = player_fill.match(/\d+$/);

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT VALID URL CHECK

    const validUrlCheck = await promiseValidUrlCheck
    (
      fetch,
      {
        langUrl: _lang,
        playerUrl: player_fill
      }
    );

    // EXIT;
    if (!validUrlCheck)
    {
      exitPage
      (
        t0
      );
    }

  //#endregion [0] IMPORTANT VALID URL CHECK

  //#region [0] IMPORTANT (PRE) PRE-LOAD DATA

  // [1] CRITICAL, causes Error Page;

  type PP_PROMISE_0 =
  [
    B_SAP_PP_D | undefined
  ];

  const urls_0 =
  [
    `/api/data/main/seo-pages?player_id=${player_id}&page=player`
  ];

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    urls_0,
    fetch
  ) as PP_PROMISE_0;

	const
  [
		PAGE_DATA
	] = data_0;

  PRELOAD_invalid_data
  (
    data_0,
    urls_0
  );

  // EXIT;
  const if_M_0 =
    PAGE_DATA == null
    || PAGE_DATA?.error != undefined
  ;
  if (if_M_0)
  {
    exitPage
    (
      t0,
      PAGE_DATA?.error?.reason
    );
  }

  const country_id = PAGE_DATA?.data?.country_id;

  const player_id_str =
    PAGE_DATA?.data?.player_id == undefined
      ? PAGE_DATA?.data?.player_id.toString()
      : ''
  ;

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA

  // NOTE: WARNING: TODO: remove for a cache solution
  const urls: string[] =
  [
    `/api/data/main/seo-pages?lang=${_lang}&page=player`,
    `/api/data/main/seo-pages?country_id=${country_id}`,
    `/api/data/main/seo-pages?months=true&lang=${_lang}`,
    `/api/data/players/profile?lang=${_lang}`,
    `/api/data/players/fixtures?lang=${_lang}`,
    `/api/data/players/fixtures?player_id=${player_id}&limit=10&offset=0`,
    `/api/data/players/statistics?lang=${_lang}`,
    `/api/data/players/team?lang=${_lang}`,
    `/api/data/players/team?player_id=${player_id}`,
    `/api/data/players/seo?lang=${_lang}`,
    `/api/data/players/seo?player_id=${player_id}&lang=${_lang}`
  ];

  type PP_PROMISE = [
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

  const data = await promiseUrlsPreload
  (
    urls,
    fetch
  ) as PP_PROMISE;

  const [
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
  ] = data

  //#endregion [1] IMPORTANT PRE-LOAD DATA

  //#region [2] IMPORTANT REGEX

  const player_trans = PAGE_SEO?.player

	PAGE_SEO.main_data = JSON.parse(
		JSON.stringify(PAGE_SEO.main_data)
      .replace('/{lang}/{type}/{name}/{id}', url?.pathname)
      .replace('/{type}/{name}/{id}', url?.pathname)
			.replace(/{id}/g, player_id_str)
      .replace(/{name}/g, PAGE_DATA?.data?.player_name)
      .replace(/{team}/g, PAGE_DATA?.data?.team_name)
      .replace(/{lang}/g, _lang)
      .replace(/{type}/g, player_trans)
	);

	PAGE_SEO.twitter_card = JSON.parse(
		JSON.stringify(PAGE_SEO.twitter_card)
    .replace('/{lang}/{type}/{name}/{id}', url?.pathname)
    .replace('/{type}/{name}/{id}', url?.pathname)
    .replace(/{id}/g, player_id_str)
    .replace(/{name}/g, PAGE_DATA?.data?.player_name)
    .replace(/{team}/g, PAGE_DATA?.data?.team_name)
    .replace(/{lang}/g, _lang)
    .replace(/{type}/g, player_trans)
	);

	PAGE_SEO.opengraph = JSON.parse(
		JSON.stringify(PAGE_SEO.opengraph)
    .replace('/{lang}/{type}/{name}/{id}', url?.pathname)
    .replace('/{type}/{name}/{id}', url?.pathname)
    .replace(/{id}/g, player_id_str)
    .replace(/{name}/g, PAGE_DATA?.data?.player_name)
    .replace(/{team}/g, PAGE_DATA?.data?.team_name)
    .replace(/{lang}/g, _lang)
    .replace(/{type}/g, player_trans)
	);

  //#endregion [2] REGEX

  //#region [3] IMPORTANT RETURN

  PRELOAD_invalid_data
  (
    data,
    urls
  );

  const t1 = performance.now();

  // [🐞]
  dlog
  (
    `⏳ [PLAYERS] PRELOAD ${((t1 - t0) / 1000).toFixed(2)} sec`,
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

  //#endregion [3] RETURN

}

function exitPage
(
  t0: number,
  // (optional)
  reason?: string
): void
{
  // [🐞]
  const t1 = performance.now();
  dlog
  (
    `${PAGE_LOG} ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );
  throw error
  (
    ERROR_CODE_INVALID,
    reason || PAGE_INVALID_MSG
  );
}