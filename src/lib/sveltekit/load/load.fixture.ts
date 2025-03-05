// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 05-03-2024                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Page Preload Logic for Fixture Page
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { ServerLoadEvent } from '@sveltejs/kit';

import { ERROR_CODE_INVALID, dlog, dlogv2 } from '$lib/utils/debug';
import { tryCatch } from '$lib/utils/miscellenous.js';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';

import type { Main_Data, Opengraph_Data, Twitter_Data } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';
import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_H2H_D, B_H2H_T } from '@betarena/scores-lib/types/head-2-head.js';
import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';
import type { B_LIN_D, B_LIN_T } from '@betarena/scores-lib/types/lineups.js';
import type { B_PR_D, B_PR_T } from '@betarena/scores-lib/types/probabilities.js';
import type { B_FS_D, B_FS_T } from '@betarena/scores-lib/types/scoreboard.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_ST_D, B_ST_T } from '@betarena/scores-lib/types/statistics.js';
import type { B_FIX_COMP_S, B_FIX_COMP_T } from '@betarena/scores-lib/types/types.fixture.competition.js';
import type { IFixtureContentDataFinal, IFixtureContentTranslationFinal } from '@betarena/scores-lib/types/v8/fixture.content.js';
import type { B_SAP_D1, B_SAP_D3, B_SAP_FP_D, B_SAP_FP_T } from '@betarena/scores-lib/types/v8/preload.scores.js';
import type { B_VOT_D, B_VOT_T } from '@betarena/scores-lib/types/votes.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Debuging string module name.
   */
  strDebugModuleName = 'src/routes/[[lang=lang]]/[sport]/[fixture=fixture]'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ ⛩️ TYPES

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
  IFixtureContentDataFinal | undefined,
  IFixtureContentTranslationFinal | undefined,
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
];

// #endregion ➤ ⛩️ TYPES

// #region ➤ 🛠️ METHODS

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟥 │ LOGIC - MAIN                                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Logic for `[[lang=lang]]` route data preload.
 * @return { Promise < {} > }
 *  📤 Respective `data` for _this_ route.
 */
export async function main
(
  event: ServerLoadEvent,
  parentData:
  {
    langParam: string
  }
): Promise < {} >
{
  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} main(..) // START`,
    true
  );

  const
    // [🐞]
    t0: number = performance.now(),
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
    {
      // lang,
      sport,
      fixture
    } = event.params,
    /**
     * @description
     *  📣 Target `fixture id`.
     */
    fixture_id = event.url.pathname.match(/\d+$/),
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
    {
      isValid: isUrlValid
    }
      = await promiseValidUrlCheck
      (
        event.fetch,
        {
          langUrl: parentData.langParam,
          sportUrl: sport,
          fixtureUrl: fixture
        }
      ),
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any = {}
  ;

  if (!isUrlValid)
    preloadExitLogic
    (
      t0,
      '[fixture=fixture]',
      ERROR_CODE_INVALID
    );
  ;

  // ╭─────
  // │ NOTE:
  // │ |: 📣 Destruct `object`.
  // ╰─────
  [
    response.FIXTURE_INFO,
    response.PAGE_SEO,
    response.FIXTURE_SCOREBOARD,
    response.FIXTURE_SCOREBOARD_TRANSLATION,
    response.FIXTURE_LINEUPS,
    response.FIXTURE_LINEUPS_TRANSLATION,
    response.FIXTURE_INCIDENTS,
    response.FXITURE_INCIDENTS_TRANSLATION,
    response.B_FEATB_T,
    response.FIXTURE_STATISTICS,
    response.FIXTURE_STATISTICS_TRANSLATION,
    response.FIXTURE_CONTENT,
    response.FIXTURE_CONTENT_TRANSLATION,
    response.FIXTURE_ABOUT,
    response.FIXTURE_ABOUT_TRANSLATION,
    response.B_VOT_D,
    response.B_VOT_T,
    response.FIXTURE_PROB_DATA,
    response.FIXTURE_PROBS_TRANSLATION,
    response.FIXTURES_ODDS_T,
    response.FIXTURE_H2H,
    response.FIXTURE_H2H_TRANSLATION,
    response.STANDINGS_T,
    response.STANDINGS_DATA,
    response.B_FIX_COMP_T,
    response.B_FIX_COMP_S,
    response.B_SAP_D3_CP_M,
    response.B_SAP_D3_TEAM_M
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam,
    fixture_id as unknown as string,
  );

  const
    /**
     * @description
     *  📣 Mutated `Page SEO` data.
     */
    PAGE_SEO_M
      = mutateSeoData
      (
        response.FIXTURE_INFO,
        response.PAGE_SEO,
        parentData.langParam,
        sport!,
      )
  ;

  // [🐞]
  dlogv2
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} main(..) // END`,
    [
      // `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
      `⏳ [FIXTURE] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
    ],
    true
  );

  return {
    ...response,
    PAGE_DATA_SEO: PAGE_SEO_M
  };
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟦 │ LOGIC - HELPER                                                              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📝 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  ❗️ **REQUIRED** Instance of `fetch` object.
 * @param { string } _lang
 *  ❗️ **REQUIRED** `language`.
 * @param { string } _fixtureId
 *  ❗️ **REQUIRED** `player id`.
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
    `🚏 [checkpoint] ➤ ${strDebugModuleName} fecthData(..) // START`,
    true
  );

  const
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
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
      404
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
     *  📣 Target `team ids`.
     */
    teamIds = FIXTURE_INFO.data.team_ids,
    // ╭─────
    // │ NOTE:
    // │ |: 📣 Destruct `object`.
    // ╰─────
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
    listUrls
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
        listUrls,
        fetch
      ) as IPreloadData2
  ;

  FIXTURE_INFO.data.fixture_time = data2[1]?.fixture_time;

  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} fecthData(..) // END`,
    true
  );

  return [
    FIXTURE_INFO,
    ...data2
  ];
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @param { B_SAP_PP_D | undefined } pageData
 *  ❗️ **REQUIRED** Target `SEO` **critical** data.
 * @param { B_SAP_PP_T | undefined } pageSeo
 *  ❗️ **REQUIRED** Target `SEO` **critical** data.
 * @param { string } _lang
 *  ❗️ **REQUIRED** Target `language`.
 * @param { string } _sport
 *  ❗️ **REQUIRED** Target `sport` translation.
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
  // [🐞]
  dlogv2
  (
    // [🐞]
    `🚏 [checkpoint] ➤ ${strDebugModuleName} mutateSeoData(..) // START`,
    [
    ],
    true
  );

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

  // [🐞]
  dlog
  (
    `🚏 [checkpoint] ➤ ${strDebugModuleName} mutateSeoData(..) // END`,
    true
  );

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS
