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

// #region ➤ 📦 Package Imports

import { ServerLoadEvent } from '@sveltejs/kit';

import { dlog, dlogv2, ERROR_CODE_INVALID, FIXTURE_PAGE_ERROR_MSG } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';
import { tryCatch } from '$lib/utils/miscellenous.js';

import type { B_FO_D, B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_LEG_D } from '@betarena/scores-lib/types/league-info.js';
import type { B_SAP_TP_D, B_SAP_TP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_TP_D, B_TP_T } from '@betarena/scores-lib/types/top-players.js';

// #endregion ➤ 📦 Package Imports

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
  B_SAP_TP_D | undefined
]

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
  B_SAP_TP_T | undefined,
  B_LEG_D | undefined,
  B_STA_T | undefined,
  B_STA_D | undefined,
  B_TP_T | undefined,
  B_TP_D | undefined,
  B_FO_T | undefined,
  B_FO_D | undefined
]

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
 */
type IProfileData2 =
[
  B_SAP_TP_D | undefined,
  B_SAP_TP_T | undefined,
  B_LEG_D | undefined,
  B_STA_T | undefined,
  B_STA_D | undefined,
  B_TP_T | undefined,
  B_TP_D | undefined,
  B_FO_T | undefined,
  B_FO_D | undefined
];

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
  const
    // [🐞]
    t0: number = performance.now(),
    // ╭─────
    // │ NOTE:
    // │ > 📣 Destruct `object`.
    // ╰─────
    {
      // lang,
      sport,
      country,
      league_name
    } = event.params,
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    { isValid: isUrlValid }
      = await promiseValidUrlCheck
      (
        event.fetch,
        {
          langUrl: parentData.langParam,
          sportUrl: sport,
          countryUrl: country,
          leagueUrl: league_name
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
      '[league_name]',
      ERROR_CODE_INVALID,
      FIXTURE_PAGE_ERROR_MSG
    );
  ;

  [
    response.PAGE_DATA,
    response.PAGE_DATA_SEO,
    response.LEAGUE_INFO_DATA,
    response.STANDINGS_T,
    response.STANDINGS_DATA,
    response.B_TP_T,
    response.B_TP_D,
    response.FIXTURES_ODDS_T,
    response.FIXTURES_ODDS_DATA
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam,
    event.url.pathname
  );

  const
    /**
     * @description
     *  📣 Mutated `Page SEO` data.
     */
    PAGE_SEO_M
      = mutateSeoData
      (
        response.PAGE_DATA_SEO,
        response.PAGE_DATA,
        parentData.langParam,
        sport,
        country,
        league_name
      )
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/+page.server.ts',
    [
      `⏳ [LEAGUE] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
      // `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
    ],
    true
  );

  return {
    ...response,
    PAGE_DATA_SEO: PAGE_SEO_M,
    TOURNAMENT_DATA_TRANSLATED_COPIES: response.PAGE_DATA?.alternate_data,
    TOURNAMENT_DATA: response.PAGE_DATA?.data,
  };
}

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
 * @param { string } _pathname
 *  💠 **[required]** Target `pathname`.
 * @returns { Promise < IProfileData2 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  _pathname: string
): Promise < IProfileData2 >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint [PRL] ➤ src/routes/(scores)/[[lang=lang]]/[sport]/[country]/[league_name]/+page.server.ts fecthData(..)',
    true
  );

  const
    /**
     * @description
     */
    data0
      = await promiseUrlsPreload
      (
        [
          `/api/data/main/seo-pages?url=${_pathname}&page=tournaments&decompress`
        ],
        fetch
      ) as IPreloadData0,
    /**
     * @description
     */
    [
      PAGE_DATA
    ] = data0
  ;

  if (PAGE_DATA == null)
  {
    preloadExitLogic
    (
      performance.now(),
      'league',
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
    leagueId = PAGE_DATA.data?.tournament_id,
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=tournaments&decompress`,
        `/api/data/league/info?url=${_pathname}`,
        `/api/data/league/standings?lang=${_lang}`,
        `/api/data/league/standings?league_id=${leagueId}`,
        `/api/data/league/top-players?lang=${_lang}&hasura=true`,
        `/api/data/league/top-players?league_id=${leagueId}&hasura=true`,
        `/api/data/league/fix-odds?lang=${_lang}`,
        `/api/data/league/fix-odds?league_id=${leagueId}`
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data1
      = await promiseUrlsPreload
      (
        urls0,
        fetch
      ) as IPreloadData1
  ;

  return [
    ...data0,
    ...data1
  ];
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @param { B_SAP_TP_T | undefined } pageSeo
 *  💠 **[required]** Target `SEO` **critical** data.
 * @param { B_SAP_TP_D | undefined } pageData
 *  💠 **[required]** Target `page` **critical** data.
 * @param { string } lang
 *  💠 **[required]** Target `language`.
 * @param { string } sport
 *  💠 **[required]** Target `sport` translation.
 * @param { string } country
 *  💠 **[required]** Target `country` translation.
 * @param { string } leagueName
 *  💠 **[required]** Target `leagueName` translation.
 * @returns { B_SAP_CTP_T }
 *  📤 Mutated data `object`.
 */
function mutateSeoData
(
  pageSeo: B_SAP_TP_T | undefined,
  pageData: B_SAP_TP_D | undefined,
  lang: string,
  sport: string,
  country: string,
  leagueName: string
): B_SAP_TP_T
{
  if (!pageSeo) return { };

  pageSeo.main_data = tryCatch
  (
    () =>
    {
      return JSON.parse
      (
        JSON.stringify(pageSeo.main_data)
          .replace(/{lang}/g, lang)
          .replace(/{sport}/g, sport)
          .replace(/{country}/g, country)
          .replace(/{name}/g, leagueName)
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
          .replace(/{lang}/g, lang)
          .replace(/{sport}/g, sport)
          .replace(/{country}/g, country)
          .replace(/{name}/g, leagueName)
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
          .replace(/{lang}/g, lang)
          .replace(/{sport}/g, sport)
          .replace(/{country}/g, country)
          .replace(/{name}/g, leagueName)
      );
    }
  ) as Opengraph_Data;

  const
    enItemAlt = pageData?.alternate_data
      ?.find
      (
        (
          {
            lang
          }
        ) =>
        {
          return lang === lang
        }
      )
  ;

  pageSeo.main_data.canonical
    = lang == 'en'
      ? `https://scores.betarena.com/${enItemAlt?.sport?.toLowerCase()}/${enItemAlt?.country?.toLowerCase()}/${enItemAlt?.name
        .replace(/\s/g, '-')
        ?.toLowerCase()}`
      : `https://scores.betarena.com/${lang}/${enItemAlt?.sport?.toLowerCase()}/${enItemAlt?.country?.toLowerCase()}/${enItemAlt?.name
        .replace(/\s/g, '-')
        ?.toLowerCase()}`
  ;

  return pageSeo;
}
