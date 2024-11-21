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

import type { ServerLoadEvent } from '@sveltejs/kit';

import { ERROR_CODE_INVALID, dlog, dlogv2 } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/navigation.js';

import type { B_SAP_CTP_D, B_SAP_CTP_T, B_SAP_D1, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_COMP_MAIN_S, B_COMP_MAIN_T } from '@betarena/scores-lib/types/types.competition.main.js';
import type { B_COMP_RULES_T } from '@betarena/scores-lib/types/types.competition.rules.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
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
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Target `types` for `_this_` page required at preload.
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
 *  📣 Target `types` for `_this_` page required at preload.
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
      competitions,
      competition_fill
    } = event.params,
    competitionId = competition_fill?.match(/\d+$/),
    COMPETITION_ID = parseInt(competitionId as unknown as string),
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
          competitionMainUrl: competitions,
          competitionUrl: competition_fill
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
      '[competitions=competitions]',
      ERROR_CODE_INVALID
    );
  ;

  [
    response.B_SAP_CTP_T,
    response.B_SAP_CTP_D,
    response.B_SAP_D3_CP_M,
    response.B_SAP_D3_SP_M,
    response.B_SAP_D3_TEAM_M,
    response.B_COMP_MAIN_T,
    response.B_COMP_MAIN_S,
    response.B_COMP_RULES_T,
    response.B_SAP_D1
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam,
    competitionId as unknown as string
  );

  const
    /**
     * @description
     *  📣 Mutated `Page SEO` data.
     */
    PAGE_SEO_M
      = mutateSeoData
      (
        response.B_SAP_CTP_T,
        response.B_SAP_CTP_D,
        event.url.pathname
      )
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/[competitions=competitions]/[...competition_fill]/+page.server.ts',
    [
      `⏳ [COMPETITION] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
      // `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
    ],
    true
  );

  return {
    ...response,
    COMPETITION_ID,
    B_SAP_CTP_T: PAGE_SEO_M,
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
 * @param { string } _competitionId
 *  💠 **[required]** Target `competition id`.
 * @returns { Promise < PP_PROMISE_F > }
 *  📤 `Data` fetched.
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
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
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
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data0
      = await promiseUrlsPreload
      (
        urls0,
        fetch
      ) as PP_PROMISE_0,
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls1: string[]
      = [
        `/api/data/main/seo-pages?country_id=${data0[6]?.data?.country_id}&decompress`
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data1: PP_PROMISE_1
      = await promiseUrlsPreload
      (
        urls1,
        fetch
      ) as PP_PROMISE_1
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
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @param { B_SAP_CTP_T } data
 *  💠 **[required]** Target competition (page) target - `seo` / `translations` data.
 * @param { B_SAP_CTP_D } data2
 *  💠 **[required]** Target competition (page) target - critical data.
 * @param { string } pathname
 *  💠 **[required]** Target competition (page) target current pathname.
 * @returns { B_SAP_CTP_T }
 *  📤 Mutated data `object`.
 */
function mutateSeoData
(
  data: B_SAP_CTP_T,
  data2: B_SAP_CTP_D,
  pathname: string
): B_SAP_CTP_T
{
  let
    pageTitle: string = data.general?.data?.title
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
