import { error } from '@sveltejs/kit';

import { dlog, ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, FIXTURE_PAGE_ERROR_MSG, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_FO_D, B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_LEG_D } from '@betarena/scores-lib/types/league-info.js';
import type { B_SAP_TP_D, B_SAP_TP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_TP_D, B_TP_T } from '@betarena/scores-lib/types/top-players.js';
import type { PageLoad } from './$types';

function exitPage
(
  t0: number
)
{
  // [🐞]
  const t1 = performance.now();
  dlog
  (
    `⏳ [SPORT] preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );
  throw error
  (
    ERROR_CODE_INVALID,
    PAGE_INVALID_MSG
  );
}

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

  const t0 = performance.now();

  //#region [0] IMPORTANT EXTRACT URL DATA

	const
  {
		// lang,
		sport,
		country,
		league_name
	} = params;

	const _lang = params?.lang;

	const urlLang: string =
    params.lang == undefined
      ? 'en'
      : params.lang
  ;

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT VALID URL CHECK

  const validUrlCheck = await promiseValidUrlCheck
  (
    fetch,
    urlLang,
    sport,
    country,
    league_name
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

  type PP_PROMISE_0 = [
    B_SAP_TP_D | undefined
  ]

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?url=${url.pathname}&page=tournaments`],
    fetch
  ) as PP_PROMISE_0;

	const [
		PAGE_DATA
	] = data_0;

  // EXIT;
  const if_1 =
    PAGE_DATA == null
  ;
  if (if_1)
  {
    exitPage
    (
      t0
    );
  }

	const league_id = PAGE_DATA?.data?.tournament_id;

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA DOC: REF: [2]

  const urls =
  [
    `/api/data/main/seo-pages?lang=${urlLang}&page=tournaments`,
    `/api/data/league/info?url=${url.pathname}`,
    `/api/data/league/standings?lang=${urlLang}`,
    `/api/data/league/standings?league_id=${league_id}`,
    `/api/data/league/top-players?lang=${urlLang}`,
    `/api/data/league/top-players?league_id=${league_id}`,
    `/api/data/league/fix-odds?lang=${urlLang}`,
    `/api/data/league/fix-odds?league_id=${league_id}` // [?] alt.2
  ];

  type HP_PROMISE = [
    // (archive) Cache_Single_Tournaments_SEO_Translation_Response
    B_SAP_TP_T | undefined,
    // (archive) Cache_Single_Tournaments_League_Info_Data_Response
    B_LEG_D | undefined,
    // (archive) REDIS_CACHE_SINGLE_tournament_standings_translation
    B_STA_T | undefined,
    // (archive) REDIS_CACHE_SINGLE_tournament_standings_data
    B_STA_D | undefined,
    // (archive) REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response
    B_TP_T | undefined,
    // (archive) REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response
    B_TP_D | undefined,
    // (archive) REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response
    B_FO_T | undefined,
    // (archive) REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response
    B_FO_D | undefined
  ]

  const data = await promiseUrlsPreload
  (
    urls,
    fetch
  ) as HP_PROMISE;

	const
  [
    PAGE_DATA_SEO,
    LEAGUE_INFO_DATA,
    STANDINGS_T,
    STANDINGS_DATA,
    TOP_PLAYERS_T,
    TOP_PLAYERS_DATA,
    FIXTURES_ODDS_T,
    FIXTURES_ODDS_DATA
	] = data;

	dlog(data, true);

  //#endregion [1] IMPORTANT PRE-LOAD DATA DOC: REF: [2]

  //#region [2] IMPORTANT REGEX

  PAGE_DATA_SEO.main_data = JSON.parse(
		JSON.stringify(PAGE_DATA_SEO.main_data)
			.replace(/{lang}/g, _lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
	);

	PAGE_DATA_SEO.twitter_card = JSON.parse(
		JSON.stringify(PAGE_DATA_SEO.twitter_card)
			.replace(/{lang}/g, _lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
	);

	PAGE_DATA_SEO.opengraph = JSON.parse(
		JSON.stringify(PAGE_DATA_SEO.opengraph)
			.replace(/{lang}/g, _lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
	);

  //#endregion [2] IMPORTANT REGEX

  // [ℹ] canonical exclusive - [LANG];
	const enItemAlt = PAGE_DATA?.alternate_data.find(({ lang }) => lang === urlLang);
	PAGE_DATA_SEO.main_data.canonical =
		urlLang == 'en'
			? `https://scores.betarena.com/${enItemAlt.sport.toLowerCase()}/${enItemAlt.country.toLowerCase()}/${enItemAlt.name
					.replace(/\s/g, '-')
					.toLowerCase()}`
			: `https://scores.betarena.com/${urlLang}/${enItemAlt.sport.toLowerCase()}/${enItemAlt.country.toLowerCase()}/${enItemAlt.name
					.replace(/\s/g, '-')
					.toLowerCase()}`
  ;

  //#region [3] IMPORTANT RETURN

	// [ℹ] FIXME: valid-page does not count data[7] - already checked
	const INVALID_PAGE_DATA_POINTS: boolean = data.includes(undefined);

  // FIXME:  && STANDINGS_DATA // IMPORTANT can be "NULL"
  // FIXME:  && FIXTURES_ODDS_DATA // IMPORTANT can be "NULL"
  if (INVALID_PAGE_DATA_POINTS) {
    const t1 = performance.now();
    dlog(`fixture (load) (exit) complete in: ${(t1 - t0) / 1000} sec`, true)
    throw error(
      ERROR_CODE_PRELOAD,
      FIXTURE_PAGE_ERROR_MSG
    );
  }

  PRELOAD_invalid_data
  (
    data,
    urls
  )

  const t1 = performance.now();
  dlog(`fixture (load) (end) complete in: ${(t1 - t0) / 1000} sec`, true)

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // NOTE: issues with setting correct <PageLoad> types,
    // NOTE: not being applied to return;
    // NOTE: not critical - can be silenced;
    PAGE_DATA_SEO,
    TOURNAMENT_DATA_TRANSLATED_COPIES: PAGE_DATA?.alternate_data,
    TOURNAMENT_DATA: PAGE_DATA?.data,
    LEAGUE_INFO_DATA,
    STANDINGS_T,
    STANDINGS_DATA,
    TOP_PLAYERS_T,
    TOP_PLAYERS_DATA,
    FIXTURES_ODDS_T,
    FIXTURES_ODDS_DATA
  };

  //#endregion [3] IMPORTANT RETURN

}