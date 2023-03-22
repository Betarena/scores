import { dlog, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from "$lib/utils/debug";
import { PRELOAD_invalid_data } from "$lib/utils/platform-functions";
import type { B_SAP_D1, B_SAP_PP_D, B_SAP_PP_T } from "@betarena/scores-lib/types/seo-pages";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "../$types";

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }): Promise<PageLoad> {

  const t0 = performance.now();

	const {
    lang, 
    // (example) -> player | jugador
    // player,
    // (example) -> teddy-teuma/829643 | harry-kane/997
    player_fill
  } = params;
  console.log(params)

  // TODO:
  // missing VALID_URL check;
  // & redirect;
  // IMPORTANT

  //#region [0] IMPORTANT EXTRACT URL DATA

  const _lang =
    lang == undefined 
      ? 'en' 
      : lang;

  const player_id = player_fill.match(/\d+$/);
  console.log(player_id.toString())

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT (PRE) PRE-LOAD DATA

  const PAGE_DATA: B_SAP_PP_D = await fetch(
		`/api/hasura/_main_/seo-pages?player_id=${player_id}`,
		{
			method: 'GET'
		}
	).then((r) => r.json());

  // TEMP VALIDATE
  console.log('PAGE_DATA', PAGE_DATA)
  // [ℹ] exit;
	if (!PAGE_DATA) {
    const t1 = performance.now();
    dlog(`fixture (load) (exit) complete in: ${(t1 - t0) / 1000} sec`, true)
		throw error(ERROR_CODE_INVALID, PAGE_INVALID_MSG);
	}

  const country_id = PAGE_DATA?.data?.country_id;

  const player_id_str = 
    PAGE_DATA?.data?.player_id == undefined
      ? PAGE_DATA?.data?.player_id.toString()
      : ''
  ;

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA

  // --------------
	// [ℹ] preload data DOC: REF: [2]
	// --------------
  
  const urls: string[] = [
    `/api/hasura/_main_/seo-pages?lang=${_lang}&page=player`,
    `/api/cache/_main_/pages_and_seo?country_id=${country_id}`
  ]

  const promises = urls.map((_url) =>
		fetch(_url).then((response) =>
			response.json()
		)
	);

  type PP_PROMISE = [
    B_SAP_PP_T | undefined,
    B_SAP_D1 | undefined
  ]

	const data: PP_PROMISE = await Promise.all(promises) as PP_PROMISE;

  const [
    PAGE_SEO,
    B_SAP_D1
  ] = data

  //#endregion [1] IMPORTANT PRE-LOAD DATA

  //#region [2] IMPORTANT REGEX

	PAGE_SEO.main_data = JSON.parse(
		JSON.stringify(PAGE_SEO.main_data)
			.replace(/{id}/g, player_id_str)
			.replace(/{name}/g, PAGE_DATA?.data?.player_name)
			.replace(/{team}/g, PAGE_DATA?.data?.team_name)
	);

	PAGE_SEO.twitter_card = JSON.parse(
		JSON.stringify(PAGE_SEO.twitter_card)
    .replace(/{id}/g, player_id_str)
    .replace(/{name}/g, PAGE_DATA?.data?.player_name)
    .replace(/{team}/g, PAGE_DATA?.data?.team_name)
	);

	PAGE_SEO.opengraph = JSON.parse(
		JSON.stringify(PAGE_SEO.opengraph)
    .replace(/{id}/g, player_id_str)
    .replace(/{name}/g, PAGE_DATA?.data?.player_name)
    .replace(/{team}/g, PAGE_DATA?.data?.team_name)
	);

  //#endregion [2] REGEX
 
  //#region [3] IMPORTANT RETURN

  // const INVALID_PAGE_DATA: boolean = data.includes(undefined);

  PRELOAD_invalid_data(data)

  const t1 = performance.now();
  dlog(`⏳ page pre-load ${(t1 - t0) / 1000} sec`, true)

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // NOTE: issues with setting correct <PageLoad> types, 
    // NOTE: not being applied to return;
    // NOTE: not critical - can be silenced;
    PAGE_DATA,
    PAGE_SEO,
    B_SAP_D1
  }

  //#endregion [3] RETURN
}