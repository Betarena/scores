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

import { ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_SAP_CP_T, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_COMP_HIGH_S, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { PageLoad } from '../$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export async function load
(
  event: ServerLoadEvent
): Promise < PageLoad >
{
  //  [🐞]
  const
    t0: number = performance.now(),
    {
      // url,
      fetch,
      params,
      request,
      // setHeaders,
      // route
    } = event,
    _langUrl: string
      = [undefined, 'en'].includes(params.lang)
        ? 'en'
        : params.lang,
    validUrlCheck: boolean = await promiseValidUrlCheck
    (
      fetch,
      {
        langUrl: _langUrl,
        competitionMainUrl: params.competitions
      }
    )
  ;

  if (!validUrlCheck)
    preloadExitLogic
    (
      t0,
      '[competitions=competitions]',
      500
    );
  ;

  const
    [
      B_SAP_CP_T,
      B_SAP_D3_CP_M,
      B_SAP_D3_SP_M,
      B_SAP_D3_TEAM_M,
      B_SAP_D3_COUNTRIES_M_MAP,
      B_COMP_HIGH_S,
      B_COMP_HIGH_T
    ] = await fetchData
    (
      fetch,
      _langUrl
    ),

    //  CHECK | IMPORTANT
    //  exit condition.
    if_M_0: boolean
    = B_SAP_CP_T == undefined
  ;
  if (if_M_0)

    preloadExitLogic
    (
      t0,
      '[LAYOUT]',
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );


  //  [🐞]
  const t1: number = performance.now();

  //  [🐞]
  dlog
  (
    `⏳ COMPETITION preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error <whatever>
    //  NOTE: FIXME:
    //  issues with setting correct <PageLoad> types.
    B_SAP_CP_T,
    B_SAP_D3_CP_M,
    B_SAP_D3_SP_M,
    B_SAP_D3_TEAM_M,
    B_SAP_D3_COUNTRIES_M_MAP,
    B_COMP_HIGH_S,
    B_COMP_HIGH_T
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
  B_SAP_CP_T | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D3 | undefined,
  B_COMP_HIGH_S | undefined,
  B_COMP_HIGH_T | undefined
];

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
 * @returns { Promise < PP_PROMISE_0 > }
 */
async function fetchData
(
  fetch: any,
  _lang: string,
): Promise < PP_PROMISE_0 >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ src/routes/[[lang=lang]]/[competitions] fecthData'
  );

  const
    urls_0: string[]
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=competitions&decompress`,
        '/api/data/main/seo-pages?term=competitions&decompress',
        '/api/data/main/seo-pages?term=football&decompress',
        '/api/data/main/seo-pages?term=team&decompress',
        '/api/data/main/seo-pages?countries=true&decompress',
        `/api/data/lobby/highlights?seo=true&lang=${_lang}`,
        `/api/data/lobby/highlights?lang=${_lang}`,
      ],
    data_0 = await promiseUrlsPreload
    (
      urls_0,
      fetch
    ) as PP_PROMISE_0
  ;

  return data_0;
}

// #endregion ➤ 🛠️ METHODS
