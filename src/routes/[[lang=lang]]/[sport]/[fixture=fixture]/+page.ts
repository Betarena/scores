// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ 📝 DESCRIPTION                                                        ▓▓
// ▓▓ Server Endpoint for Home Page (Prefetch) Data Load                    ▓▓
// ▓▓ 🎟️ FILE TEMPLATE STRUCTURE VERSION                                    ▓▓
// ▓▓ v.7.0 ➤ (+page.ts)                                                    ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

// #region ➤ 📦 Package Imports

import { ERROR_CODE_INVALID, FIXTURE_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { PRELOAD_exitPage, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';
import type { B_CONT_D, B_CONT_T } from '@betarena/scores-lib/types/content.js';
import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';
import type { B_LIN_D, B_LIN_T } from '@betarena/scores-lib/types/lineups.js';
import type { B_PR_D, B_PR_T } from '@betarena/scores-lib/types/probabilities.js';
import type { B_FS_D, B_FS_T } from '@betarena/scores-lib/types/scoreboard.js';
import type { B_SAP_D1, B_SAP_FP_D, B_SAP_FP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';
import type { B_FIX_COMP_TS } from '@betarena/scores-lib/types/types.fixture.competition.js';
import type { B_VOT_D, B_VOT_T } from '@betarena/scores-lib/types/votes.js';
import type { PageLoad } from './$types';

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
    sport,
    fixture
  } = params;

  const urlLang: string =
    params?.lang == undefined
      ? 'en'
      : params?.lang
  ;

	const fixture_id = url.pathname.match(/\d+$/);

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ 📌 VALIDATE URL                  ▓▓
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const validUrlCheck: boolean = await promiseValidUrlCheck
  (
    fetch,
    {
      langUrl: urlLang,
      sportUrl: sport,
      fixtureUrl: fixture
    }
  );

  // ▓▓ CHECK
  // ▓▓ for exit.
  if (!validUrlCheck)
  {
    PRELOAD_exitPage
    (
      t0,
      '[fixture=fixture]',
      ERROR_CODE_INVALID,
      FIXTURE_PAGE_ERROR_MSG
    );
  }

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // ▓▓ 📌 PREFETCH DATA                 ▓▓
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  let
  [
    FIXTURE_INFO,
    PAGE_SEO,
		FIXTURE_SCOREBOARD,
		FIXTURE_SCOREBOARD_TRANSLATION,
		FIXTURE_LINEUPS,
    FIXTURE_LINEUPS_TRANSLATION,
    FIXTURE_INCIDENTS,
    FXITURE_INCIDENTS_TRANSLATION,
    B_FEATB_T,
    FIXTURE_STATISTICS,
    FIXTURE_STATISTICS_TRANSLATION,
    FIXTURE_CONTENT,
    FIXTURE_CONTENT_TRANSLATION,
    FIXTURE_ABOUT,
    FIXTURE_ABOUT_TRANSLATION,
    B_VOT_D,
    B_VOT_T,
    FIXTURE_PROB_DATA,
    FIXTURE_PROBS_TRANSLATION,
    FIXTURES_ODDS_T,
    FIXTURE_H2H,
    FIXTURE_H2H_TRANSLATION,
    STANDINGS_T,
    STANDINGS_DATA,
    B_FIX_COMP_TS,
  ] = await fetchData
  (
    fetch,
    urlLang,
    fixture_id as unknown as string,
  );

  PAGE_SEO = mutateSeoData
  (
    FIXTURE_INFO,
    PAGE_SEO,
    lang,
    sport,
  );

  // ▓▓ [🐞]
  const t1: number = performance.now();

  // ▓▓ [🐞]
  dlog
  (
    `⏳ FIXTURE preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
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
    B_FEATB_T,
    FIXTURE_STATISTICS,
    FIXTURE_STATISTICS_TRANSLATION,
    FIXTURE_CONTENT,
    FIXTURE_CONTENT_TRANSLATION,
    FIXTURE_ABOUT,
    FIXTURE_ABOUT_TRANSLATION,
    B_VOT_D,
    B_VOT_T,
    FIXTURE_PROB_DATA,
    FIXTURE_PROBS_TRANSLATION,
    FIXTURE_H2H,
    FIXTURE_H2H_TRANSLATION,
    // extra
    FIXTURES_ODDS_T,
    STANDINGS_T,
    STANDINGS_DATA,
    B_FIX_COMP_TS
  };

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
  B_SAP_FP_D | undefined
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
  B_SAP_D1 | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📌 Target `types` for `_this_` page required at preload.
 */
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
  B_VOT_D | undefined,
  B_VOT_T | undefined,
  B_PR_D | undefined,
  B_PR_T | undefined,
  B_FO_T | undefined,
  B_H2H_D | undefined,
  B_H2H_T | undefined,
  B_STA_T | undefined,
  B_STA_D | undefined,
  B_FIX_COMP_TS | undefined,
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
  ...PP_PROMISE_2
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
 * @param { string } _fixtureId
 *  Target `fixture id`.
 * @returns { Promise < PP_PROMISE_0 > }
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  _fixtureId: string
): Promise < PP_PROMISE_FINAL >
{

  // ### [🐞]
  dlog
  (
    `🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]]/[sport]/[fixture=fixture] fecthData(..)`,
    true
  );

  const
  [
    FIXTURE_INFO
  ] = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?fixture_id=${_fixtureId}&page=fixtures&hasura=true&decompress`],
    fetch
  ) as PP_PROMISE_0;

	const leagueId: number = FIXTURE_INFO?.league_id;
  const teamIds: string = FIXTURE_INFO?.data?.team_ids;

  const
  [
		COUNTRY_TRANSLATION
	] = await promiseUrlsPreload
  (
    [`/api/data/main/seo-pages?country_id=${FIXTURE_INFO?.data?.country_id}&decompress`],
    fetch
  ) as PP_PROMISE_1;

	FIXTURE_INFO.data.country = COUNTRY_TRANSLATION?.translations?.[_lang];
	FIXTURE_INFO.data.sport = 'football';

  // ▓▓ TODO:
  // ▓▓ add sports translation (get)
  // ▓▓ similar to that of country (above)

  const urls_2: string[] =
  [
		`/api/data/main/seo-pages?lang=${_lang}&page=fixtures&decompress`,
    `/api/data/fixture/scoreboard?fixture_id=${_fixtureId}`,
    `/api/data/fixture/scoreboard?lang=${_lang}`,
    `/api/data/fixture/lineups?fixture_id=${_fixtureId}`,
    `/api/data/fixture/lineups?lang=${_lang}`,
    `/api/data/fixture/incidents?fixture_id=${_fixtureId}`,
    `/api/data/fixture/incidents?lang=${_lang}`,
    `/api/data/home/feat-betsite?lang=${_lang}&decompress`,
    `/api/data/fixture/statistics?fixture_id=${_fixtureId}`,
    `/api/data/fixture/statistics?lang=${_lang}`,
    `/api/data/fixture/content?fixture_id=${_fixtureId}&lang=${_lang}`,
    `/api/data/fixture/content?lang=${_lang}`,
    `/api/data/fixture/about?fixture_id=${_fixtureId}&lang=${_lang}`,
    `/api/data/fixture/about?lang=${_lang}`,
    `/api/data/fixture/votes?fixture_id=${_fixtureId}`,
    `/api/data/fixture/votes?lang=${_lang}`,
    `/api/data/fixture/probability?fixture_id=${_fixtureId}`,
    `/api/data/fixture/probability?lang=${_lang}`,
    `/api/data/league/fix-odds?lang=${_lang}`,
    `/api/data/fixture/h2h?teamIds=${teamIds}`,
    `/api/data/fixture/h2h?lang=${_lang}`,
    `/api/data/league/standings?lang=${_lang}`,
    `/api/data/league/standings?league_id=${leagueId}`,
    `/api/data/fixture/competition?lang=${_fixtureId}&decompress`,
  ];

  const data_2 = await promiseUrlsPreload
  (
    urls_2,
    fetch
  ) as PP_PROMISE_2;

  FIXTURE_INFO.data.fixture_time = data_2?.[1]?.fixture_time;

  const finalData: PP_PROMISE_FINAL =
  [
    FIXTURE_INFO,
    ...data_2
  ];

  return finalData;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @param { B_SAP_FP_D } pageData
 *  competition (page) target - `seo` / `translations` data.
 * @param { B_SAP_FP_T } pageSeo
 *  competition (page) target - critical data.
 * @param { string } _lang
 *  competition (page) target `language` _translation_.
 * @param { string } _sport
 *  competition (page) target `sport` _translation_.
 * @returns { B_SAP_CTP_T }
 * a mutated data `object`.
 */
function mutateSeoData
(
  pageData: B_SAP_FP_D,
  pageSeo: B_SAP_FP_T,
  _lang: string,
  _sport: string,
): B_SAP_FP_T
{

  pageSeo.main_data = JSON.parse
  (
		JSON.stringify(pageSeo?.main_data)
    ?.replace(/{id}/g, pageData?.data?.id == undefined ? undefined : pageData?.data?.id.toString())
    ?.replace(/{lang}/g, _lang)
    ?.replace(/{sport}/g, _sport)
    ?.replace(/{country}/g, pageData.data.country)
    ?.replace(/{name}/g, pageData?.data?.league_name)
    ?.replace(/{home_team_name}/g, pageData?.data?.home_team_name)
    ?.replace(/{away_team_name}/g, pageData?.data?.away_team_name)
    ?.replace(/{fixtures_day}/g, pageData?.data?.fixture_day == undefined ? undefined : pageData?.data?.fixture_day.replace('T00:00:00', ''))
    ?.replace(/{data.venue.data.name}/g, pageData?.data?.venue_name)
    ?.replace(/{data.venue.data.city}/g, pageData?.data?.venue_city)
	);

	pageSeo.twitter_card = JSON.parse
  (
		JSON.stringify(pageSeo?.twitter_card)
    ?.replace(/{id}/g, pageData?.data?.id == undefined ? undefined : pageData?.data?.id.toString())
    ?.replace(/{lang}/g, _lang)
    ?.replace(/{sport}/g, _sport)
    ?.replace(/{country}/g, pageData.data.country)
    ?.replace(/{name}/g, pageData?.data?.league_name)
    ?.replace(/{home_team_name}/g, pageData?.data?.home_team_name)
    ?.replace(/{away_team_name}/g, pageData?.data?.away_team_name)
    ?.replace(/{fixtures_day}/g, pageData?.data?.fixture_day == undefined ? undefined : pageData?.data?.fixture_day.replace('T00:00:00', ''))
    ?.replace(/{data.venue.data.name}/g, pageData?.data?.venue_name)
    ?.replace(/{data.venue.data.city}/g, pageData?.data?.venue_city)
	);

	pageSeo.opengraph = JSON.parse
  (
		JSON.stringify(pageSeo?.opengraph)
    ?.replace(/{id}/g, pageData?.data?.id == undefined ? undefined : pageData?.data?.id.toString())
    ?.replace(/{lang}/g, _lang)
    ?.replace(/{sport}/g, _sport)
    ?.replace(/{country}/g, pageData.data.country)
    ?.replace(/{name}/g, pageData?.data?.league_name)
    ?.replace(/{home_team_name}/g, pageData?.data?.home_team_name)
    ?.replace(/{away_team_name}/g, pageData?.data?.away_team_name)
    ?.replace(/{fixtures_day}/g, pageData?.data?.fixture_day == undefined ? undefined : pageData?.data?.fixture_day.replace('T00:00:00', ''))
    ?.replace(/{data.venue.data.name}/g, pageData?.data?.venue_name)
    ?.replace(/{data.venue.data.city}/g, pageData?.data?.venue_city)
	);

  const enItemAlt = pageData?.alternate_data?.[_lang];
	pageSeo.main_data.canonical = enItemAlt;

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS