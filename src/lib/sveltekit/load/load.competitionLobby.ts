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

import { dlog, dlogv2 } from '$lib/utils/debug';
import { preloadExitLogic, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_SAP_CP_T, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_COMP_HIGH_S, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

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
    } = event.params,
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    isUrlValid
      = await promiseValidUrlCheck
      (
        event.fetch,
        {
          langUrl: parentData.langParam,
          competitionMainUrl: competitions
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
      500
    );
  ;

  [
    response.B_SAP_CP_T,
    response.B_SAP_D3_CP_M,
    response.B_SAP_D3_SP_M,
    response.B_SAP_D3_TEAM_M,
    response.B_SAP_D3_COUNTRIES_M_MAP,
    response.B_COMP_HIGH_S,
    response.B_COMP_HIGH_T
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam
  );

  if (response.B_SAP_CP_T == undefined)
    preloadExitLogic
    (
      t0,
      '[competitions=competitions]',
      500
    );
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/[competitions=competitions]/+page.server.ts',
    [
      `⏳ [COMPETITION] preload ${((performance.now() - t0) / 1000).toFixed(2)} sec`,
      // `🔹 [var] ➤ response :|: ${JSON.stringify(response)}`,
    ],
    true
  );

  return {
    ...response
  };
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Fetches target data for `_this_` page.
 * @param { any } fetch
 *  💠 **[required]** Target instance of `fetch` object.
 * @param { string } _lang
 *  💠 **[required]** Target `language`.
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
    /**
     * @description
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=competitions&decompress`,
        '/api/data/main/seo-pages?term=competitions&decompress',
        '/api/data/main/seo-pages?term=football&decompress',
        '/api/data/main/seo-pages?term=team&decompress',
        '/api/data/main/seo-pages?countries=true&decompress',
        `/api/data/lobby/highlights?seo=true&lang=${_lang}`,
        `/api/data/lobby/highlights?lang=${_lang}`,
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
      ) as PP_PROMISE_0
  ;

  return data0;
}
