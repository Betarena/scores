// #region ➤ [MAIN] Package Imports

import { error } from '@sveltejs/kit';

import { ERROR_CODE_INVALID, FIXTURE_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';
import type { B_CONT_D, B_CONT_T } from '@betarena/scores-lib/types/content.js';
import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';
import type { B_LIN_D, B_LIN_T } from '@betarena/scores-lib/types/lineups.js';
import type { B_PR_T } from '@betarena/scores-lib/types/probabilities.js';
import type { B_FS_D, B_FS_T } from '@betarena/scores-lib/types/scoreboard.js';
import type { B_SAP_D1, B_SAP_FP_D, B_SAP_FP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';
import type { B_VOT_T } from '@betarena/scores-lib/types/votes.js';
import type { PageLoad } from './$types';

// #endregion ➤ [MAIN] Package Imports

const PAGE_LOG = '⏳ [FIXTURE] PRELOAD';

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

  // [1] FIXTURE (CRITICAL) page data;

  type PP_PROMISE_0 = 
  [
    B_SAP_FP_D | undefined
  ]

  const data_0 = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?fixture_id=${fixture_id}&page=fixtures`],
    fetch
  ) as PP_PROMISE_0;

	const 
  [
		FIXTURE_INFO
	] = data_0;

	const id =	FIXTURE_INFO?.data?.id == undefined ? undefined : FIXTURE_INFO?.data?.id.toString();
	const league_id = FIXTURE_INFO?.league_id;
	const league_name = FIXTURE_INFO?.data?.league_name;
	const country_id = FIXTURE_INFO?.data?.country_id;
	const homeTeamName = FIXTURE_INFO?.data?.home_team_name;
	const awayTeamName = FIXTURE_INFO?.data?.away_team_name;
	const fixture_day = FIXTURE_INFO?.data?.fixture_day == undefined ? undefined : FIXTURE_INFO?.data?.fixture_day.replace('T00:00:00', '');
	const venue_name = FIXTURE_INFO?.data?.venue_name;
	const venue_city = FIXTURE_INFO?.data?.venue_city;
  const teamIds: string = FIXTURE_INFO?.data?.team_ids;

  // [2] FIXTURE (CRITICAL) page data;

  type PP_PROMISE_1 = 
  [
    B_SAP_D1 | undefined
  ]

  const data_1 = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?country_id=${country_id}`],
    fetch
  ) as PP_PROMISE_1;

	const 
  [
		COUNTRY_TRANSLATION
	] = data_1;

	const country = COUNTRY_TRANSLATION?.translations[urlLang];

	FIXTURE_INFO.data.country = country;
	FIXTURE_INFO.data.sport = 'football';

  // TODO: add sports translation (get)
  // TODO: similar to that of country (above)

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA

  //#region [1] IMPORTANT PRE-LOAD DATA

  type PP_PROMISE_2 = 
  [
    B_SAP_FP_T | undefined,
    B_FS_D | undefined,
    B_FS_T | undefined,
    B_LIN_D | undefined,
    B_LIN_T | undefined,
    B_INC_D | undefined,
    B_INC_T | undefined,
    B_FEATB_T | undefined,
    B_ST_D | undefined,
    B_ST_T | undefined,
    B_CONT_D | undefined,
    B_CONT_T | undefined,
    B_ABT_D | undefined,
    B_ABT_T | undefined,
    B_VOT_T | undefined,
    B_PR_T | undefined,
    B_FO_T | undefined,
    B_H2H_D | undefined,
    B_H2H_T | undefined,
    B_STA_T | undefined,
    B_STA_D | undefined
  ]

	const urls: string[] = 
  [
    `/api/data/main/seo-pages?lang=${urlLang}&page=fixtures`,
    `/api/hasura/fixture/scoreboard?fixture_id=${fixture_id}`,
    `/api/cache/fixtures/scoreboard?lang=${urlLang}`,
    `/api/data/fixture/lineups?fixture_id=${fixture_id}`,
    `/api/data/fixture/lineups?lang=${urlLang}`,
    `/api/hasura/fixture/incidents?fixture_id=${fixture_id}`,
    `/api/cache/fixtures/incidents?lang=${urlLang}`,
    `/api/cache/home/featured_betting_sites?lang=${urlLang}`,
    `/api/hasura/fixture/statistics?fixture_id=${fixture_id}`,
    `/api/cache/fixtures/statistics?lang=${urlLang}`,
    `/api/hasura/fixture/content?fixture_id=${fixture_id}&lang=${urlLang}`,
    `/api/cache/fixtures/content?lang=${urlLang}`,
    `/api/hasura/fixture/about?fixture_id=${fixture_id}&lang=${urlLang}`,
    `/api/cache/fixtures/about?lang=${urlLang}`,
    `/api/cache/fixtures/votes?lang=${urlLang}`,
    `/api/cache/fixtures/probabilities?lang=${urlLang}`,
    `/api/cache/tournaments/fixtures_odds?lang=${urlLang}`,
    `/api/data/fixture/h2h?teamIds=${teamIds}`,
    `/api/data/fixture/h2h?lang=${urlLang}`,
    `/api/cache/tournaments/standings?lang=${urlLang}`,
    `/api/cache/tournaments/standings?league_id=${league_id}`
  ];

  const data = await promiseUrlsPreload
  (
    urls,
    fetch
  ) as PP_PROMISE_2;

	const 
  [
    PAGE_SEO,
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

  //#endregion [1] IMPORTANT PRE-LOAD DATA

  //#region [2] IMPORTANT REGEX
      
	PAGE_SEO.main_data = JSON.parse(
		JSON.stringify(PAGE_SEO.main_data)
			.replace(/{id}/g, id)
			.replace(/{lang}/g, lang)
			.replace(/{sport}/g, sport)
			.replace(/{country}/g, country)
			.replace(/{name}/g, league_name)
			.replace(/{home_team_name}/g, homeTeamName)
			.replace(/{away_team_name}/g, awayTeamName)
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
			.replace(/{home_team_name}/g, homeTeamName)
			.replace(/{away_team_name}/g, awayTeamName)
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
			.replace(/{home_team_name}/g, homeTeamName)
			.replace(/{away_team_name}/g, awayTeamName)
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

	const INVALID_PAGE_DATA_POINTS: boolean =	data.includes(undefined);

  // EXIT;
  if (INVALID_PAGE_DATA_POINTS) 
  {
    exitPage
    (
      t0
    );
  }

  PRELOAD_invalid_data
  (
    data,
    urls
  );

  const t1 = performance.now();

  // [🐞]
  dlog
  (
    `⏳ ${PAGE_LOG} ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

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
    STANDINGS_DATA
  };

  //#endregion [3] IMPORTANT RETURN

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
    reason || FIXTURE_PAGE_ERROR_MSG
  );
}