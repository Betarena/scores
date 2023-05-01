import { dlog, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from "$lib/utils/debug";
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from "$lib/utils/platform-functions";
import type { B_SAP_D1, B_SAP_D2, B_SAP_PP_D, B_SAP_PP_T } from "@betarena/scores-lib/types/seo-pages";
import { error } from "@sveltejs/kit";
import type { B_PFIX_D, B_PFIX_T } from "node_modules/@betarena/scores-lib/types/player-fixtures";
import type { B_PPRO_T } from "node_modules/@betarena/scores-lib/types/player-profile";
import type { PageLoad } from "../$types";

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

  const {
    lang, 
    // (example) -> player | jugador (translation)
    // player,
    // (example) -> teddy-teuma/829643 | harry-kane/997
    player_fill
  } = params;
  // console.log(params)

  const _lang =
    lang == undefined 
      ? 'en' 
      : lang;

  const player_id = player_fill.match(/\d+$/);

  //#endregion [0] IMPORTANT EXTRACT URL DATA

    //#region [0] IMPORTANT VALID URL CHECK

    const validUrlCheck = await promiseValidUrlCheck
    (
      fetch,
      _lang,
      null,
      null,
      null,
      null,
      player_fill
    )
  
    // [ℹ] exit;
    if (!validUrlCheck) {
      // [🐞]
      const t1 = performance.now();
      dlog(`⏳ [PLAYER] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)
      throw error(
        ERROR_CODE_INVALID,
        PAGE_INVALID_MSG
      );
    }
  
    //#endregion [0] IMPORTANT VALID URL CHECK

  //#region [0] IMPORTANT (PRE) PRE-LOAD DATA

  // [1] FIXTURE (CRITICAL) page data;

  type PP_PROMISE_0 = [
    B_SAP_PP_D | undefined
  ]

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?player_id=${player_id}&page=player`],
    fetch
  ) as PP_PROMISE_0;

	const [
		PAGE_DATA
	] = data_0;

  const country_id = PAGE_DATA?.data?.country_id;

  const player_id_str = 
    PAGE_DATA?.data?.player_id == undefined
      ? PAGE_DATA?.data?.player_id.toString()
      : ''
  ;

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA

  const urls: string[] = [
    // NOTE:WARNING:TODO: remove for a cache solution
    `/api/data/main/seo-pages?lang=${_lang}&page=player`,
    `/api/data/main/seo-pages?country_id=${country_id}`,
    `/api/data/main/seo-pages?months=true&lang=${_lang}`,
    // NOTE:WARNING:TODO: remove for a cache solution
    `/api/data/players/profile?lang=${_lang}`,
    // NOTE:WARNING:TODO: remove for a cache solution
    `/api/data/players/fixtures?lang=${_lang}`,
    // NOTE:WARNING:TODO: remove for a cache solution
    `/api/data/players/fixtures?player_id=${player_id}&limit=10&offset=0`
  ]

  type PP_PROMISE = [
    B_SAP_PP_T | undefined,
    B_SAP_D1 | undefined,
    B_SAP_D2 | undefined,
    B_PPRO_T | undefined,
    B_PFIX_T | undefined,
    B_PFIX_D | undefined
  ]

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
    B_PFIX_D
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

  // const INVALID_PAGE_DATA: boolean = data.includes(undefined);
  console.log(data)

  PRELOAD_invalid_data(data)

  const t1 = performance.now();
  dlog(`⏳ [PLAYERS] (pre-load) ${((t1 - t0) / 1000).toFixed(2)} sec`, true)

  return {
    PAGE_DATA,
    PAGE_SEO,
    B_SAP_D1,
    B_SAP_D2,
    B_PPRO_T,
    B_PFIX_T,
    B_PFIX_D
  }

  //#endregion [3] RETURN
}