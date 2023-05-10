import { error } from '@sveltejs/kit';

import { ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, FIXTURE_PAGE_ERROR_MSG, PAGE_INVALID_MSG, dlog, errlog } from '$lib/utils/debug';
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type {
  REDIS_CACHE_SINGLE_fixtures_page_info_response,
  REDIS_CACHE_SINGLE_general_countries_translation
} from '$lib/models/_main_/pages_and_seo/types';
import type { GeoJsResponse } from '$lib/types/types.geojs';
import type { PageLoad } from './$types';

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
    sport,
    fixture
  } = params;

  const urlLang: string =
    params?.lang == undefined 
      ? 'en' 
      : params?.lang
  ;

	const fixture_id = url.pathname.match(/\d+$/);

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT VALID URL CHECK

  const validUrlCheck = await promiseValidUrlCheck
  (
    fetch,
    urlLang,
    sport,
    null,
    null,
    fixture
  )

  // [ℹ] exit;
	if (!validUrlCheck) {
    // [🐞]
    const t1 = performance.now();
    dlog(`⏳ [FIXTURE] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)
		throw error(
			ERROR_CODE_INVALID,
			PAGE_INVALID_MSG
		);
	}

  //#endregion [0] IMPORTANT VALID URL CHECK

  //#region [0] IMPORTANT (PRE) PRE-LOAD DATA

  // [1] FIXTURE (CRITICAL) page data;

  type PP_PROMISE_0 = [
    REDIS_CACHE_SINGLE_fixtures_page_info_response | undefined
  ]

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?fixture_id=${fixture_id}&page=fixtures`],
    fetch
  ) as PP_PROMISE_0;

	const [
		FIXTURE_INFO
	] = data_0;

	const id =	FIXTURE_INFO?.data?.id == undefined ? undefined : FIXTURE_INFO?.data?.id.toString();
	const league_id = FIXTURE_INFO?.league_id;
	const league_name = FIXTURE_INFO?.data?.league_name;
	const country_id = FIXTURE_INFO?.data?.country_id;
	const home_team_name = FIXTURE_INFO?.data?.home_team_name;
	const away_team_name = FIXTURE_INFO?.data?.away_team_name;
	const fixture_day = FIXTURE_INFO?.data?.fixture_day == undefined ? undefined : FIXTURE_INFO?.data?.fixture_day.replace('T00:00:00', '');
	const venue_name = FIXTURE_INFO?.data?.venue_name;
	const venue_city = FIXTURE_INFO?.data?.venue_city;

  // [2] FIXTURE (CRITICAL) page data;

  type PP_PROMISE_1 = [
    REDIS_CACHE_SINGLE_general_countries_translation | undefined
  ]

  const data_1: PP_PROMISE_1 = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?country_id=${country_id}`],
    fetch
  ) as PP_PROMISE_0;

	const [
		COUNTRY_TRANSLATION
	] = data_1;

	const country = COUNTRY_TRANSLATION?.translations[urlLang];

	FIXTURE_INFO.data.country = country;
	FIXTURE_INFO.data.sport = 'football';

  // TODO: add sports translation (get)
  // TODO: similar to that of country (above)

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA

  // --------------
	// [ℹ] preload data DOC: REF: [2]
	// --------------

  // const userGeoResponse: GeoJsResponse = await getUserLocation();
  const GEO_RESPONSE: GeoJsResponse = await fetch(
		`https://get.geojs.io/v1/ip/geo.json`,
		{
			method: 'GET'
		}
	).then((r) => r.json())
  .catch((error) => { errlog(error) });
  dlog(GEO_RESPONSE, true); 

  // FIXME:
  // TEST (^)

	const urls = [
    `/api/data/main/seo-pages?lang=${urlLang}&page=fixtures`,
    // TODO:FIXME: TES: (below 2 instnaces)
    `/api/cache/tournaments/sportbook?geoPos=${GEO_RESPONSE?.country_code.toLowerCase()}`,
    `/api/cache/tournaments/sportbook?all=true&geoPos=${GEO_RESPONSE?.country_code.toLowerCase()}`,
    // TODO:NOTE:IMPORTANT: can be null (non-current season fixture) - load from hasura
    // working, setup to get (old) data if not in cache;
		// `/api/cache/fixtures/scoreboard?fixture_id=${fixture_id}`, // ALT-1
    `/api/hasura/fixture/scoreboard?fixture_id=${fixture_id}`, // ALT-2
    `/api/cache/fixtures/scoreboard?lang=${urlLang}`,
    // TODO:NOTE:IMPORTANT: can be null (non-current season fixture) - load from hasura
    // `/api/cache/fixtures/lineups?fixture_id=${fixture_id}`, // ALT-1
    `/api/hasura/fixture/lineups?fixture_id=${fixture_id}`, // ALT-2
    `/api/cache/fixtures/lineups?lang=${urlLang}`,
    // TODO:NOTE:IMPORTANT: can be null -load from hasura
    // `/api/cache/fixtures/incidents?fixture_id=${fixture_id}`, // ALT-1
    `/api/hasura/fixture/incidents?fixture_id=${fixture_id}`, // ALT-2
    `/api/cache/fixtures/incidents?lang=${urlLang}`,
    `/api/cache/home/featured_betting_sites?lang=${urlLang}`,
    // TODO:NOTE:IMPORTANT: can be null -load from hasura
    // `/api/hasura/fixture/statistics?fixture_id=${fixture_id}`, // ALT-1
    `/api/cache/fixtures/statistics?fixture_id=${fixture_id}`,  // ALT-2
    `/api/cache/fixtures/statistics?lang=${urlLang}`,
    // TODO:NOTE:IMPORTANT: can be null -load from hasura
    // `/api/cache/fixtures/content?fixture_id=${fixture_id}&lang=${urlLang}`, // ALT-1
    `/api/hasura/fixture/content?fixture_id=${fixture_id}&lang=${urlLang}`, // ALT-2
    `/api/cache/fixtures/content?lang=${urlLang}`,
    // TODO:NOTE:IMPORTANT: can be null -load from hasura
    // `/api/cache/fixtures/about?fixture_id=${fixture_id}&lang=${urlLang}`, // ALT-1
    `/api/hasura/fixture/about?fixture_id=${fixture_id}&lang=${urlLang}`, // ALT-2
    `/api/cache/fixtures/about?lang=${urlLang}`,
    `/api/cache/fixtures/votes?lang=${urlLang}`,
    `/api/cache/fixtures/probabilities?lang=${urlLang}`,
    `/api/cache/tournaments/fixtures_odds?lang=${urlLang}`,
    // TODO:NOTE:IMPORTANT: can be null -load from hasura
    // `/api/cache/fixtures/about?fixture_id=${fixture_id}&lang=${urlLang}`, // ALT-1
    `/api/hasura/fixture/head-2-head?fixture_id=${fixture_id}`, // ALT-2
    `/api/cache/fixtures/head-2-head?lang=${urlLang}`,
    `/api/cache/tournaments/standings?lang=${urlLang}`,
    `/api/cache/tournaments/standings?league_id=${league_id}` // TODO:FIXME: dependant on league-id - leaking space;
  ];

  const data = await promiseUrlsPreload
  (
    urls,
    fetch
  );

	const [
    PAGE_SEO,
    SPORTBOOK_MAIN,
    SPORTBOOK_ALL,
		FIXTURE_SCOREBOARD,
		FIXTURE_SCOREBOARD_TRANSLATION,
		FIXTURE_LINEUPS,
    FIXTURE_LINEUPS_TRANSLATION,
    FIXTURE_INCIDENTS,
    FXITURE_INCIDENTS_TRANSLATION,
    FEATURED_BETTING_SITES_WIDGET_DATA_SEO,
    FIXTURE_STATISTICS,
    FIXTURE_STATISTICS_TRANSLATION,
    FIXTURE_CONTENT,
    FIXTURE_CONTENT_TRANSLATION,
    FIXTURE_ABOUT,
    FIXTURE_ABOUT_TRANSLATION,
    FIXTURE_VOTES_TRANSLATION,
    FIXTURE_PROBS_TRANSLATION,
    FIXTURES_ODDS_T,
    FIXTURE_H2H,
    FIXTURE_H2H_TRANSLATION,
    STANDINGS_T,
    STANDINGS_DATA
	] = data;

	dlog(data, false);
  dlog(PAGE_SEO, false)
  dlog(SPORTBOOK_MAIN, false)
  dlog(SPORTBOOK_ALL, false);

  //#endregion [1] IMPORTANT PRE-LOAD DATA

  //#region [2] IMPORTANT REGEX
      
	PAGE_SEO.main_data = JSON.parse(
		JSON.stringify(PAGE_SEO.main_data)
			.replace(/{id}/g, id)
			.replace(/{lang}/g, lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
			.replace(/{home_team_name}/g, home_team_name)
			.replace(/{away_team_name}/g, away_team_name)
			.replace(/{fixtures_day}/g, fixture_day)
			.replace(/{data.venue.data.name}/g, venue_name)
			.replace(/{data.venue.data.city}/g, venue_city)
	);

	PAGE_SEO.twitter_card = JSON.parse(
		JSON.stringify(PAGE_SEO.twitter_card)
			.replace(/{id}/g, id)
			.replace(/{lang}/g, lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
			.replace(/{home_team_name}/g, home_team_name)
			.replace(/{away_team_name}/g, away_team_name)
			.replace(/{fixtures_day}/g, fixture_day)
			.replace(/{data.venue.data.name}/g, venue_name)
			.replace(/{data.venue.data.city}/g, venue_city)
	);

	PAGE_SEO.opengraph = JSON.parse(
		JSON.stringify(PAGE_SEO.opengraph)
			.replace(/{id}/g, id)
			.replace(/{lang}/g, lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
			.replace(/{home_team_name}/g, home_team_name)
			.replace(/{away_team_name}/g, away_team_name)
			.replace(/{fixtures_day}/g, fixture_day)
			.replace(/{data.venue.data.name}/g, venue_name)
			.replace(/{data.venue.data.city}/g, venue_city)
	);

  //#endregion [2] IMPORTANT REGEX

	// [ℹ] canonical exclusive SET - [EN];
	const enItemAlt = FIXTURE_INFO?.alternate_data?.[lang];
	PAGE_SEO.main_data.canonical = enItemAlt;
  FIXTURE_INFO.data.fixture_time = FIXTURE_SCOREBOARD?.fixture_time;

  //#region [3] IMPORTANT RETURN

	// [ℹ] FIXME: valid-page does not count data[7] - already checked
	const INVALID_PAGE_DATA_POINTS: boolean =	data.includes(undefined);

  // FIXME:  && response_about // IMPORTANT can be "NULL"
  // FIXME:  && response_h2h // IMPORTANT can be "NULL"
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
    PAGE_SEO,
    FIXTURE_INFO,
    FIXTURE_SCOREBOARD,
    FIXTURE_SCOREBOARD_TRANSLATION,
    FIXTURE_LINEUPS,
    FIXTURE_LINEUPS_TRANSLATION,
    FIXTURE_INCIDENTS,
    FXITURE_INCIDENTS_TRANSLATION,
    FEATURED_BETTING_SITES_WIDGET_DATA_SEO,
    FIXTURE_STATISTICS,
    FIXTURE_STATISTICS_TRANSLATION,
    FIXTURE_CONTENT,
    FIXTURE_CONTENT_TRANSLATION,
    FIXTURE_ABOUT,
    FIXTURE_ABOUT_TRANSLATION,
    FIXTURE_VOTES_TRANSLATION,
    FIXTURE_PROBS_TRANSLATION,
    FIXTURE_H2H,
    FIXTURE_H2H_TRANSLATION,
    // extra
    FIXTURES_ODDS_T,
    STANDINGS_T,
    STANDINGS_DATA,
    GEO_RESPONSE,
    SPORTBOOK_MAIN,
    SPORTBOOK_ALL
  };

  //#endregion [3] IMPORTANT RETURN

}
