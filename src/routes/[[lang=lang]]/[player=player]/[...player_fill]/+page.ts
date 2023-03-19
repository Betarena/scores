import { dlog } from "$lib/utils/debug";
import { PRELOAD_invalid_data } from "$lib/utils/platform-functions";
import type { B_SAP_PP_D, B_SAP_PP_T } from "@betarena/scores-lib/types/seo-pages";
import type { PageLoad } from "../$types";

/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }): Promise<PageLoad> {

  const t0 = performance.now();

	const {
    lang, 
    // (example) -> player | jugador
    // player,
    // (example) -> teddy-teuma/829643 | harry-kane/997
    player_fill
  } = params;

  console.log(params)

  // --------------
	// [ℹ] IMPORTANT
  // [ℹ] extract critical data from URL
  // --------------

  const _lang =
    lang == undefined 
      ? 'en' 
      : lang;

  const player_id = player_fill.match(/\d+$/);

  console.log(player_id.toString())

  // --------------
	// [ℹ] IMPORTANT
	// [ℹ] (pre) pre-load critical data
  // --------------

  const PAGE_DATA: B_SAP_PP_D = await fetch(
		`/api/hasura/_main_/seo-pages?player_id=${player_id}`,
		{
			method: 'GET'
		}
	).then((r) => r.json());

  // --------------
	// [ℹ] IMPORTANT
	// [ℹ] preload data DOC: REF: [2]
	// --------------
  
  const urls: string[] = [
    `/api/hasura/_main_/seo-pages?lang=${_lang}&page=player`,
  ]

  const promises = urls.map((_url) =>
		fetch(_url).then((response) =>
			response.json()
		)
	);

  type PP_PROMISE = [
    B_SAP_PP_T
  ]

	const data: PP_PROMISE = await Promise.all(promises) as PP_PROMISE;

  const [
    PAGE_SEO
  ] = data

  // --------------
	// [ℹ] IMPORTANT
	// [ℹ] return(s)
	// --------------

  const INVALID_PAGE_DATA: boolean = data.includes(undefined);

  PRELOAD_invalid_data(data)

  const t1 = performance.now();
  dlog(`⏳ page pre-load ${(t1 - t0) / 1000} sec`, true)

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // NOTE: issues with setting correct <PageLoad> types, 
    // NOTE: not being applied to return;
    PAGE_DATA,
    PAGE_SEO
  }
}