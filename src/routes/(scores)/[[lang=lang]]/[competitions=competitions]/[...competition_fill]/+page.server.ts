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

import { ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_SAP_CTP_D, B_SAP_CTP_T, B_SAP_D1, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_COMP_MAIN_S, B_COMP_MAIN_T } from '@betarena/scores-lib/types/types.competition.main.js';
import type { B_COMP_RULES_T } from '@betarena/scores-lib/types/types.competition.rules.js';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { PageLoad } from '../$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export async function load
(
  event: ServerLoadEvent
): Promise < PageLoad >
{
  const
    // [🐞]
    t0: number = performance.now(),

    {
      url,
      fetch,
      params,
      request,
    // setHeaders,
    // route
    } = event,

    // [🐞]
    // ### example: "/br/competicoes/predictor/lag-persita-kommer-att-vinna/31"
    // console.log(url?.pathname);
    // [🐞]
    // ### example: "predictor/lag-persita-kommer-att-vinna/31"
    // console.log(params?.competition_fill);

    _langUrl: string
      = [undefined, 'en'].includes(params.lang)
        ? 'en'
        : params.lang,
    competitionId = params.competition_fill?.match(/\d+$/),
    COMPETITION_ID = parseInt(competitionId as unknown as string),
    validUrlCheck: boolean = await promiseValidUrlCheck
    (
      fetch,
      {
        langUrl: _langUrl,
        competitionMainUrl: params.competitions,
        competitionUrl: params.competition_fill
      }
    );

  if (!validUrlCheck)
    preloadExitLogic
    (
      t0,
      '[competitions=competitions]',
      ERROR_CODE_INVALID
    );
  ;

  let
    [
      B_SAP_CTP_T,
      B_SAP_CTP_D,
      B_SAP_D3_CP_M,
      B_SAP_D3_SP_M,
      B_SAP_D3_TEAM_M,
      B_COMP_MAIN_T,
      B_COMP_MAIN_S,
      B_COMP_RULES_T,
      B_SAP_D1
    ] = await fetchData
    (
      fetch,
      _langUrl,
    competitionId as unknown as string
    )
  ;

  if (B_SAP_CTP_D == undefined)
    preloadExitLogic
    (
      t0,
      '[LAYOUT]',
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );
  ;

  B_SAP_CTP_T = mutateSeoData
  (
    B_SAP_CTP_T,
    B_SAP_CTP_D,
    url.pathname
  );

  const
    // [🐞]
    t1: number = performance.now()
  ;

  // [🐞]
  dlog
  (
    `⏳ COMPETITION preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error <whatever>
    // ### NOTE: FIXME:
    // ### issues with setting correct <PageLoad> types.
    COMPETITION_ID,
    B_SAP_CTP_T,
    B_SAP_CTP_D,
    B_SAP_D3_CP_M,
    B_SAP_D3_SP_M,
    B_SAP_D3_TEAM_M,
    B_COMP_MAIN_T,
    B_COMP_MAIN_S,
    B_COMP_RULES_T,
    B_SAP_D1
  };
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]

// #region ➤ 🛠️ METHODS

/**
 * @description
 * TODO: DOC:
 */
type PP_PROMISE_0 =
[
  B_SAP_CTP_T | undefined,
  B_SAP_CTP_D | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_COMP_MAIN_T | undefined,
  B_COMP_MAIN_S | undefined,
  B_COMP_RULES_T | undefined
];

/**
 * @description
 * TODO: DOC:
 */
type PP_PROMISE_1 =
[
  B_SAP_D1 | undefined
];

/**
 * @description
 * TODO: DOC:
 */
type PP_PROMISE_F =
[
  B_SAP_CTP_T | undefined,
  B_SAP_CTP_D | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_COMP_MAIN_T | undefined,
  B_COMP_MAIN_S | undefined,
  B_COMP_RULES_T | undefined,
  B_SAP_D1 | undefined
]

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * TODO: DOC:
 */
async function fetchData
(
  fetch: any,
  _lang: string,
  _competitionId: string
): Promise < PP_PROMISE_F >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ src/routes/[[lang=lang]]/[competitions=competitions]/[...competition_fill] fecthData'
  );

  const
    urls_0
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=competition&decompress`,
        `/api/data/main/seo-pages?competition_id=${_competitionId}&page=competition&decompress`,
        '/api/data/main/seo-pages?term=competitions&decompress',
        '/api/data/main/seo-pages?term=football&decompress',
        '/api/data/main/seo-pages?term=team&decompress',
        `/api/data/competition/main?lang=${_lang}`,
        `/api/data/competition/main?seo=true&lang=${_lang}&competition_id=${_competitionId}`,
        `/api/data/competition/rules?lang=${_lang}`,
      ],
    data_0 = await promiseUrlsPreload
    (
      urls_0,
      fetch
    ) as PP_PROMISE_0,
    urls_1: string[]
    = [
      `/api/data/main/seo-pages?country_id=${data_0[6]?.data?.country_id}&decompress`
    ],
    data_1: PP_PROMISE_1 = await promiseUrlsPreload
    (
      urls_1,
      fetch
    ) as PP_PROMISE_1,
    finalData: PP_PROMISE_F
    = [
      ...data_0,
      ...data_1
    ]
  ;

  return finalData;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @param { B_SAP_CTP_T } data
 *  competition (page) target - `seo` / `translations` data.
 * @param { B_SAP_CTP_D } data2
 *  competition (page) target - critical data.
 * @param { string } pathname
 *  competition (page) target current pathname.
 * @returns { B_SAP_CTP_T }
 * a mutated data `object`.
 */
function mutateSeoData
(
  data: B_SAP_CTP_T,
  data2: B_SAP_CTP_D,
  pathname: string
): B_SAP_CTP_T
{
  let pageTitle: string = data.general?.data?.title
    ?.replace(/{ID}/g, data2.data?.team_name)
    ?.replace(':', ' ')
  ;
  if (data2.data?.target_competition_prediction == 'win')
    pageTitle += data.general?.data?.prediction?.['1'];
  else if (data2.data?.target_competition_prediction == 'lose')
    pageTitle += data.general?.data?.prediction?.['2'];
  else
    pageTitle += data.general?.data?.prediction?.x;
  ;

  data.main_data = JSON.parse
  (
    JSON.stringify(data.main_data)
      .replace('/{type}/{type_name}/{sport}/{title}-{prediction}/{id}', pathname)
      .replace(/{title}/g, pageTitle)
      .replace(/{prediction}/g, '')
      .replace(/{creator}/g, '')
  );

  data.twitter_card = JSON.parse
  (
    JSON.stringify(data.twitter_card)
      .replace('/{type}/{type_name}/{sport}/{title}-{prediction}/{id}', pathname)
      .replace(/{title}/g, pageTitle)
      .replace(/{prediction}/g, '')
      .replace(/{creator}/g, '')
  );

  data.opengraph = JSON.parse
  (
    JSON.stringify(data.opengraph)
      .replace('/{type}/{type_name}/{sport}/{title}-{prediction}/{id}', pathname)
      .replace(/{title}/g, pageTitle)
      .replace(/{prediction}/g, '')
      .replace(/{creator}/g, '')
  );

  return data;
}

// #endregion ➤ 🛠️ METHODS
