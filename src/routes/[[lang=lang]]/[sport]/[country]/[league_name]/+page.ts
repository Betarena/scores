import { error } from '@sveltejs/kit';

import { dlog, ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, FIXTURE_PAGE_ERROR_MSG, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type {
  Cache_Single_Tournaments_Data_Page_Translation_Response
} from '$lib/models/_main_/pages_and_seo/types';
import type { PageLoad } from './$types';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load(
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
		// lang,
		sport,
		country,
		league_name
	} = params;

	const _lang = params?.lang;
	const urlLang: string = params.lang == undefined ? 'en' : params.lang;

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT VALID URL CHECK

  const validUrlCheck = await promiseValidUrlCheck
  (
    fetch,
    urlLang,
    sport,
    country,
    league_name
  )

  // [ℹ] exit;
	if (!validUrlCheck) {
    // [🐞]
    const t1 = performance.now();
    dlog(`⏳ [SPORT] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)
		throw error(
			ERROR_CODE_INVALID,
			PAGE_INVALID_MSG
		);
	}
  
  //#endregion [0] IMPORTANT VALID URL CHECK

  //#region [0] IMPORTANT (PRE) PRE-LOAD DATA

	const response_tournaments_page_info: Cache_Single_Tournaments_Data_Page_Translation_Response = await fetch(
		`/api/cache/_main_/pages_and_seo?url=${url.pathname}&page=tournaments`, {
			method: 'GET'
		}
	).then((r) => r.json());

	const league_id = response_tournaments_page_info.data.tournament_id;

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA DOC: REF: [2]

  const urls = [
    `/api/cache/_main_/pages_and_seo?lang=${urlLang}&page=tournaments`,
    `/api/cache/tournaments/league_info?url=${url.pathname}`,
    `/api/cache/tournaments/standings?lang=${urlLang}`,
    // [ℹ] NOTE: can be "null"
    `/api/cache/tournaments/standings?league_id=${league_id}`,
    `/api/cache/tournaments/top_players?lang=${urlLang}`,
    `/api/cache/tournaments/top_players?league_id=${league_id}`,
    `/api/cache/tournaments/fixtures_odds?lang=${urlLang}`,
    // [ℹ] NOTE: can be "null"
    // `/api/cache/tournaments/fixtures_odds?league_id=${league_id}` // [?] alt.1
    `/api/hasura/league/fixtures-odds?league_id=${league_id}` // [?] alt.2
  ];

  const data = await promiseUrlsPreload
  (
    urls,
    fetch
  );

	const [
    PAGE_DATA_SEO,  // (type) Cache_Single_Tournaments_SEO_Translation_Response
    LEAGUE_INFO_DATA, // (type) Cache_Single_Tournaments_League_Info_Data_Response
    STANDINGS_T, // (type) REDIS_CACHE_SINGLE_tournament_standings_translation
    STANDINGS_DATA, // (type) REDIS_CACHE_SINGLE_tournament_standings_data
    TOP_PLAYERS_T, // (type) REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response
    TOP_PLAYERS_DATA, // (type) REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response
    FIXTURES_ODDS_T, // (type) REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response
    FIXTURES_ODDS_DATA // (type) REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response
	] = data;

	dlog(data, false);

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
	const enItemAlt = response_tournaments_page_info.alternate_data.find(({ lang }) => lang === urlLang);
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

  PRELOAD_invalid_data(data)

  const t1 = performance.now();
  dlog(`fixture (load) (end) complete in: ${(t1 - t0) / 1000} sec`, true)

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // NOTE: issues with setting correct <PageLoad> types, 
    // NOTE: not being applied to return;
    // NOTE: not critical - can be silenced;
    PAGE_DATA_SEO,
    TOURNAMENT_DATA_TRANSLATED_COPIES: response_tournaments_page_info.alternate_data,
    TOURNAMENT_DATA: response_tournaments_page_info.data,
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
