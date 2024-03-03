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

import { dlog, ERROR_CODE_INVALID, FIXTURE_PAGE_ERROR_MSG } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck, tryCatch } from '$lib/utils/platform-functions.js';

import type { B_FO_D, B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';
import type { B_LEG_D } from '@betarena/scores-lib/types/league-info.js';
import type { B_SAP_TP_D, B_SAP_TP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings.js';
import type { B_TP_D, B_TP_T } from '@betarena/scores-lib/types/top-players.js';
import type { PageLoad } from '../../$types.js';

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
    // [🐞]
    t0 = performance.now(),
    /**
     * @description
     *  📣 Destruct `object`.
     */
    {
      // lang,
      sport,
      country,
      league_name
    } = params,
    /**
     * @description
     *  📣 Target `language`.
     */
    urlLang: string
      = params.lang == undefined
        ? 'en'
        : params.lang,
    /**
     * @description
     *  📣 Check for `valid` url.
     */
    validUrlCheck
      = await promiseValidUrlCheck
      (
        fetch,
        {
          langUrl: urlLang,
          sportUrl: sport,
          countryUrl: country,
          leagueUrl: league_name
        }
      )
  ;

  if (!validUrlCheck)
    preloadExitLogic
    (
      t0,
      '[league_name]',
      ERROR_CODE_INVALID,
      FIXTURE_PAGE_ERROR_MSG
    );
  ;

  const
    /**
     * @description
     *  📣 Fetch target `data`.
     */
    [
      PAGE_DATA,
      PAGE_DATA_SEO,
      LEAGUE_INFO_DATA,
      STANDINGS_T,
      STANDINGS_DATA,
      B_TP_T,
      B_TP_D,
      FIXTURES_ODDS_T,
      FIXTURES_ODDS_DATA
    ]
      = await fetchData
      (
        fetch,
        urlLang,
        url.pathname
      ),
    /**
     * @description
     *  📣 Mutated `Page SEO` data.
     */
    PAGE_SEO_M
      = mutateSeoData
      (
        PAGE_DATA_SEO,
        urlLang,
        sport,
        country,
        league_name
      ),
    // [🐞]
    t1 = performance.now()
  ;

  // [🐞]
  dlog
  (
    `⏳ [LEAGUE] preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error 'unknown'
    // ╭─────
    // │ NOTE: FIXME:
    // │ > issues with setting correct <PageLoad> types.
    // ╰─────
    PAGE_DATA_SEO: PAGE_SEO_M,
    TOURNAMENT_DATA_TRANSLATED_COPIES: PAGE_DATA?.alternate_data,
    TOURNAMENT_DATA: PAGE_DATA?.data,
    LEAGUE_INFO_DATA,
    STANDINGS_T,
    STANDINGS_DATA,
    B_TP_T,
    B_TP_D,
    FIXTURES_ODDS_T,
    FIXTURES_ODDS_DATA
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
    '🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]] fecthData(..)',
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
    urls0: string[]
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
 * @param { string } _lang
 *  💠 **[required]** Target `language`.
 * @param { string } _sport
 *  💠 **[required]** Target `sport` translation.
 * @returns { B_SAP_CTP_T }
 *  📤 Mutated data `object`.
 */
function mutateSeoData
(
  pageSeo: B_SAP_TP_T | undefined,
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

  const enItemAlt = PAGE_DATA?.alternate_data.find(({ lang }) => {return lang === urlLang});

  ageSeo.main_data.canonical
    = urlLang == 'en'
      ? `https://scores.betarena.com/${enItemAlt.sport.toLowerCase()}/${enItemAlt.country.toLowerCase()}/${enItemAlt.name
        .replace(/\s/g, '-')
        .toLowerCase()}`
      : `https://scores.betarena.com/${urlLang}/${enItemAlt.sport.toLowerCase()}/${enItemAlt.country.toLowerCase()}/${enItemAlt.name
        .replace(/\s/g, '-')
        .toLowerCase()}`
  ;

  return pageSeo;
}

// #endregion ➤ 🛠️ METHODS
