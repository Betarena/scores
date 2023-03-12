import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import type {
  REDIS_CACHE_SINGLE_fixtures_page_info_response,
  REDIS_CACHE_SINGLE_general_countries_translation
} from '$lib/models/_main_/pages_and_seo/types';
import type { GeoJsResponse } from '$lib/types/types.geojs';
import { dlog, errlog, ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, FIXTURE_PAGE_ERROR_MSG, PAGE_INVALID_MSG } from '$lib/utils/debug';

/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }): Promise<PageLoad> {

  const t0 = performance.now();

	const { lang, sport } = params;

  // IMPORTANT
	const VALID_URL = await fetch(
    `/api/cache/_main_/pages_and_seo?url=${url.pathname}`, {
		method: 'GET'
	}).then((r) => r.json());

	// [ℹ] exit;
	if (!VALID_URL) {
    const t1 = performance.now();
    dlog(`fixture (load) (exit) complete in: ${(t1 - t0) / 1000} sec`, true)
		throw error(ERROR_CODE_INVALID, PAGE_INVALID_MSG);
	}

  // --------------
	// [ℹ] extract critical data from URL
  // --------------

	const urlLang: string = params.lang == undefined ? 'en' : params.lang;
	const fixture_id = url.pathname.match(/\d+$/);

  // --------------
	// [ℹ] get pre-pre-load critical data
  // --------------

	const FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response = await fetch(
		`/api/cache/_main_/pages_and_seo?fixture_id=${fixture_id}&page=fixtures`,
		{
			method: 'GET'
		}
	).then((r) => r.json());

	const id =
		FIXTURE_INFO?.data?.id == undefined ? undefined : FIXTURE_INFO?.data?.id.toString();
	const league_id = FIXTURE_INFO?.league_id;
	const league_name = FIXTURE_INFO?.data?.league_name;
	const country_id = FIXTURE_INFO?.data?.country_id;
	const home_team_name = FIXTURE_INFO?.data?.home_team_name;
	const away_team_name = FIXTURE_INFO?.data?.away_team_name;
	const fixture_day =
		FIXTURE_INFO?.data?.fixture_day == undefined
			? undefined
			: FIXTURE_INFO?.data?.fixture_day.replace('T00:00:00', '');
	const venue_name = FIXTURE_INFO?.data?.venue_name;
	const venue_city = FIXTURE_INFO?.data?.venue_city;

	const response_country_translation: REDIS_CACHE_SINGLE_general_countries_translation = await fetch(
		`/api/cache/_main_/pages_and_seo?country_id=${country_id}`,
		{
			method: 'GET'
		}
	).then((r) => r.json());

	const country = response_country_translation?.translations[urlLang];

	FIXTURE_INFO.data.country = country;
	FIXTURE_INFO.data.sport = 'football';

  // TODO: future sports translation get
  /*
      const response_sport_translation: REDIS_CACHE_SINGLE_general_sport_translation = await fetch(
      `/api/cache/_main_/pages_and_seo?sport=` + country_id,
      {
        method: 'GET'
      }
    ).then((r) => r.json());
    const sport_typ = response_sport_translation[lang]
  */

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
    `/api/cache/_main_/pages_and_seo?lang=${urlLang}&page=fixtures`,
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

	const promises = urls.map((_url) =>
		fetch(_url).then((response) =>
			response.json()
		)
	);

	const data = await Promise.all(promises);
	dlog(data, false);

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

  dlog(PAGE_SEO, false)
  dlog(SPORTBOOK_MAIN, false)
  dlog(SPORTBOOK_ALL, false);

  // --------------
	// [ℹ] apply regex to morph data
  // --------------
      
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

	// [ℹ] canonical exclusive SET - [EN];
	const enItemAlt = FIXTURE_INFO.alternate_data['en'];
	PAGE_SEO.main_data.canonical = enItemAlt;

	// const FORCE_HASURA = false;

	// if (FIXTURE_SCOREBOARD == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_SCOREBOARD - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_SCOREBOARD = await fetch(`/api/hasura/fixtures/scoreboard?fixture_id=${fixture_id}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

	// if (FIXTURE_LINEUPS == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_LINEUPS - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_LINEUPS = await fetch(`/api/hasura/fixtures/lineups?fixture_id=${fixture_id}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

	// if (FIXTURE_INCIDENTS == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_INCIDENTS - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_INCIDENTS = await fetch(`/api/hasura/fixtures/incidents?fixture_id=${fixture_id}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

	// if (FIXTURE_STATISTICS == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_STATISTICS - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_STATISTICS = await fetch(`/api/hasura/fixtures/statistics?fixture_id=${fixture_id}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

	// if (FIXTURE_CONTENT == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_CONTENT - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_CONTENT = await fetch(`/api/hasura/fixtures/content?fixture_id=${fixture_id}&lang=${urlLang}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

	// if (FIXTURE_ABOUT == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_ABOUT - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_ABOUT = await fetch(`/api/hasura/fixtures/about?fixture_id=${fixture_id}&lang=${urlLang}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

	// if (FIXTURE_H2H == undefined || FORCE_HASURA) {
	// 	dlog(`${F_DEBUG_TAG} non current_season fixture ${fixture_id} FIXTURE_H2H - Hasura Direct`, F_DEBUG_TOGGLE, F_DEBUG_STYLE);
	// 	FIXTURE_H2H = await fetch(`/api/hasura/fixtures/head-2-head?fixture_id=${fixture_id}`, {
	// 		method: 'GET'
	// 	}).then((r) => r.json());
	// }

  // FIXTURE_INFO.data.fixture_time = undefined
  FIXTURE_INFO.data.fixture_time = FIXTURE_SCOREBOARD?.fixture_time;

	// --------------
	// [ℹ] return(s)
	// --------------

	// [ℹ] FIXME: valid-page does not count data[7] - already checked
	const INVALID_PAGE_DATA_POINTS: boolean =
		data.includes(undefined);

	const indexesOf = (arr, item) =>
		arr.reduce(
			(acc, v, i) => (
				v === item && acc.push(i), acc
  ),[]);
	dlog(`null (preload): ${indexesOf(data, null)}`, true);

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

  const t1 = performance.now();
  dlog(`fixture (load) (end) complete in: ${(t1 - t0) / 1000} sec`, true)

  return {
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
}
