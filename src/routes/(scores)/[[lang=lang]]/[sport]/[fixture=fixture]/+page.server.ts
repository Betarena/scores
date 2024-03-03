// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader ('Client-Side')                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { ERROR_CODE_INVALID, FIXTURE_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck, tryCatch } from '$lib/utils/platform-functions.js';

import type { Main_Data, Opengraph_Data, Twitter_Data } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';
import type { B_CONT_D, B_CONT_T } from '@betarena/scores-lib/types/content.js';
import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';
import type { B_LIN_D, B_LIN_T } from '@betarena/scores-lib/types/lineups.js';
import type { B_PR_D, B_PR_T } from '@betarena/scores-lib/types/probabilities.js';
import type { B_FS_D, B_FS_T } from '@betarena/scores-lib/types/scoreboard.js';
import type { B_SAP_D1, B_SAP_D3, B_SAP_FP_D, B_SAP_FP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';
import type { B_FIX_COMP_S, B_FIX_COMP_T } from '@betarena/scores-lib/types/types.fixture.competition.js';
import type { B_VOT_D, B_VOT_T } from '@betarena/scores-lib/types/votes.js';
import type { PageLoad } from '../$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

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
  const
    t0: number = performance.now(),
    /**
     * @description
     *  📣 Destruct `object`.
     */
    {
      lang,
      sport,
      fixture
    } = params,
    /**
     * @description
     *  📣 Target `language`.
     */
    urlLang: string
      = params?.lang == undefined
        ? 'en'
        : params?.lang,
    /**
     * @description
     *  📣 Target `fixture id`.
     */
    fixture_id = url.pathname.match(/\d+$/),
    /**
     * @description
     *  📣 Check for `valid` url.
     */
    validUrlCheck: boolean = await promiseValidUrlCheck
    (
      fetch,
      {
        langUrl: urlLang,
        sportUrl: sport,
        fixtureUrl: fixture
      }
    )
  ;

  if (!validUrlCheck)
    preloadExitLogic
    (
      t0,
      '[fixture=fixture]',
      ERROR_CODE_INVALID,
      FIXTURE_PAGE_ERROR_MSG
    );
  ;

  const
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
      B_FIX_COMP_T,
      B_FIX_COMP_S,
      B_SAP_D3_CP_M,
      B_SAP_D3_TEAM_M
    ] = await fetchData
    (
      fetch,
      urlLang,
      fixture_id as unknown as string,
    ),
    PAGE_SEO_M
      = mutateSeoData
      (
        FIXTURE_INFO,
        PAGE_SEO,
        lang!,
        sport,
      ),
    t1: number = performance.now()
  ;

  // [🐞]
  dlog
  (
    `⏳ FIXTURE preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error 'unknown'
    // ╭─────
    // │ NOTE: FIXME:
    // │ > issues with setting correct <PageLoad> types.
    // ╰─────
    PAGE_SEO_M,
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
    B_FIX_COMP_T,
    B_FIX_COMP_S,
    B_SAP_D3_CP_M,
    B_SAP_D3_TEAM_M
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
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData0 =
[
  B_SAP_FP_D | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData1 =
[
  B_SAP_D1 | undefined
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData2 =
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
  B_FIX_COMP_T | undefined,
  B_FIX_COMP_S | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
];

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IPreloadData3 =
[
  ...IPreloadData0,
  ...IPreloadData2
]

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  💠 **[required]** Target instance of `fetch` object.
 * @param { string } _lang
 *  💠 **[required]** Target `language`.
 * @param { string } _fixtureId
 *  💠 **[required]** Target `player id`.
 * @returns { Promise < IPreloadData3 > }
 *  📤 `Data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  _fixtureId: string
): Promise < IPreloadData3 | [] >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]]/[sport]/[fixture=fixture] fecthData(..)',
    true
  );

  const
    /**
     * @description
     *  📣 Fetch `data`.
     */
    [
      FIXTURE_INFO
    ]
      = await promiseUrlsPreload
      (
        [
          `/api/data/main/seo-pages?fixture_id=${_fixtureId}&page=fixtures&hasura=true&decompress`
        ],
        fetch
      ) as IPreloadData0
  ;

  if (FIXTURE_INFO == null || FIXTURE_INFO.data == undefined)
  {
    preloadExitLogic
    (
      performance.now(),
      'fixture',
      400,
      FIXTURE_PAGE_ERROR_MSG
    );
    return [];
  }

  const
    /**
     * @description
     *  📣 Target `league id`.
     */
    leagueId = FIXTURE_INFO.league_id,
    /**
     * @description
     *  📣 Target `team id`.
     */
    teamIds = FIXTURE_INFO.data.team_ids,
    /**
     * @description
     *  📣 Fetch `data`.
     */
    [
      COUNTRY_TRANSLATION
    ]
      = await promiseUrlsPreload
      (
        [
          `/api/data/main/seo-pages?country_id=${FIXTURE_INFO.data.country_id}&decompress`
        ],
        fetch
      ) as IPreloadData1
  ;

  FIXTURE_INFO.data.country = COUNTRY_TRANSLATION?.translations?.[_lang];
  FIXTURE_INFO.data.sport = 'football';

  const
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls2: string[]
      = [
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
        `/api/data/fixture/competition?lang=${_lang}&decompress`,
        `/api/data/fixture/competition?lang=${_lang}&seo=true&fixtureId=${_fixtureId}&decompress`,
        '/api/data/main/seo-pages?term=competitions&decompress',
        '/api/data/main/seo-pages?term=team&decompress',
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data2
      = await promiseUrlsPreload
      (
        urls2,
        fetch
      ) as IPreloadData2
  ;

  FIXTURE_INFO.data.fixture_time = data2[1]?.fixture_time;

  const
    finalData: IPreloadData3
      = [
        FIXTURE_INFO,
        ...data2
      ]
  ;

  return finalData;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @param { B_SAP_PP_D | undefined } pageData
 *  💠 Target `SEO` **critical** data.
 * @param { B_SAP_PP_T | undefined } pageSeo
 *  💠 Target `SEO` **critical** data.
 * @param { string } _lang
 *  💠 Target `language`.
 * @param { string } _sport
 *  💠 Target `sport` translation.
 * @returns { B_SAP_CTP_T }
 *  📤 Mutated data `object`.
 */
function mutateSeoData
(
  pageData: B_SAP_FP_D | undefined,
  pageSeo: B_SAP_FP_T | undefined,
  _lang: string,
  _sport: string,
): B_SAP_FP_T
{
  if (!pageSeo) return { };

  const
    /**
     * @description
     *  📣 Target data to use for further mutation.
     */
    dataMutated
    = {
      id: (pageData?.data?.id?.toString() ?? ''),
      country: (pageData?.data?.country ?? ''),
      leagueName: (pageData?.data?.league_name ?? ''),
      homeTeamName: (pageData?.data?.home_team_name ?? ''),
      awayTeamName: (pageData?.data?.away_team_name ?? ''),
      fixturesDay: (pageData?.data?.fixture_day?.replace('T00:00:00', '') ?? ''),
      venueName: (pageData?.data?.venue_name ?? ''),
      venueCity: (pageData?.data?.venue_city ?? '')
    }
  ;

  pageSeo.main_data = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.main_data)
          .replace(/{id}/g, dataMutated.id)
          .replace(/{lang}/g, _lang)
          .replace(/{sport}/g, _sport)
          .replace(/{country}/g, dataMutated.country)
          .replace(/{name}/g, dataMutated.leagueName)
          .replace(/{home_team_name}/g, dataMutated.homeTeamName)
          .replace(/{away_team_name}/g, dataMutated.awayTeamName)
          .replace(/{fixtures_day}/g, dataMutated.fixturesDay)
          .replace(/{data.venue.data.name}/g, dataMutated.venueName)
          .replace(/{data.venue.data.city}/g, dataMutated.venueCity)
      );
    }
  ) as Main_Data;

  pageSeo.twitter_card = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.twitter_card)
          .replace(/{id}/g, dataMutated.id)
          .replace(/{lang}/g, _lang)
          .replace(/{sport}/g, _sport)
          .replace(/{country}/g, dataMutated.country)
          .replace(/{name}/g, dataMutated.leagueName)
          .replace(/{home_team_name}/g, dataMutated.homeTeamName)
          .replace(/{away_team_name}/g, dataMutated.awayTeamName)
          .replace(/{fixtures_day}/g, dataMutated.fixturesDay)
          .replace(/{data.venue.data.name}/g, dataMutated.venueName)
          .replace(/{data.venue.data.city}/g, dataMutated.venueCity)
      );
    }
  ) as Twitter_Data;

  pageSeo.opengraph = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.opengraph)
          .replace(/{id}/g, dataMutated.id)
          .replace(/{lang}/g, _lang)
          .replace(/{sport}/g, _sport)
          .replace(/{country}/g, dataMutated.country)
          .replace(/{name}/g, dataMutated.leagueName)
          .replace(/{home_team_name}/g, dataMutated.homeTeamName)
          .replace(/{away_team_name}/g, dataMutated.awayTeamName)
          .replace(/{fixtures_day}/g, dataMutated.fixturesDay)
          .replace(/{data.venue.data.name}/g, dataMutated.venueName)
          .replace(/{data.venue.data.city}/g, dataMutated.venueCity)
      );
    }
  ) as Opengraph_Data;

  pageSeo.main_data.canonical = pageData?.alternate_data?.[_lang]!;

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS
