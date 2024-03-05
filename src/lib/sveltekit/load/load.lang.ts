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

import { error, ServerLoadEvent } from '@sveltejs/kit';

import { dlog, dlogv2, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';
import type { B_LS2_S, B_LS2_T } from '@betarena/scores-lib/types/livescores-v2.js';
import type { B_SEB_DT } from '@betarena/scores-lib/types/seo-block.js';
import type { B_SAP_HP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';
import type { B_FEATM_S, B_FEATM_T } from '@betarena/scores-lib/types/types.home.feat-match.js';
import type { B_LEGL_S, B_LEGL_T } from '@betarena/scores-lib/types/types.home.league-list.js';

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
  B_SAP_HP_T | undefined,
  B_FEATM_T | undefined,
  B_FEATM_S | undefined,
  B_FEATB_T | undefined,
  B_TGOL_T | undefined,
  B_TGOL_S | undefined,
  B_LEGL_T | undefined,
  B_LEGL_S | undefined,
  B_LEGT_T | undefined,
  B_SEB_DT | undefined,
  B_LS2_T | undefined,
  B_LS2_S | undefined,
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
    /**
     * @description
     *  📣 Validate **this** `url`.
     */
    isUrlValid
      = await promiseValidUrlCheck
      (
        event.fetch,
        {
          langUrl: parentData.langParam
        }
      ),
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any = {}
  ;

  if (!isUrlValid)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error
    (
      ERROR_CODE_INVALID,
      // @ts-expect-error
      PAGE_INVALID_MSG
    );
  ;

  [
    response.PAGE_DATA_SEO,
    response.B_FEATM_T,
    response.B_FEATM_S,
    response.B_FEATB_T,
    response.B_TGOL_T,
    response.B_TGOL_S,
    response.B_LEGL_T,
    response.B_LEGL_S,
    response.B_LEGT_T,
    response.SEO_BLOCK_DATA,
    response.LIVESCORES_V2_T_DATA,
    response.LIVESCORES_V2_SEO
  ] = await fetchData
  (
    event.fetch,
    parentData.langParam
  );

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/+page.server.ts',
    [
      `🔹 [var] ➤ response :|: ${JSON.stringify(response.PAGE_DATA_SEO)}`,
    ],
    true
  );

  return response;
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
 * @return { Promise < IPreloadData0 > }
 *  📤 Target `data` fetched.
 */
async function fetchData
(
  fetch: any,
  _lang: string,
): Promise < IPreloadData0 >
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
     *  📣 Target `urls` to be `fetched`.
     */
    urls0
      = [
        `/api/data/main/seo-pages?lang=${_lang}&page=homepage&decompress`,
        `/api/data/home/feat-match?lang=${_lang}&decompress`,
        `/api/data/home/feat-match?lang=${_lang}&seo=true&decompress`,
        `/api/data/home/feat-betsite?lang=${_lang}&decompress`,
        `/api/data/home/top-goalscorers?lang=${_lang}&decompress`,
        `/api/data/home/top-goalscorers?lang=${_lang}&seo=true&decompress`,
        `/api/data/home/league-list?lang=${_lang}&decompress`,
        `/api/data/home/league-list?lang=${_lang}&seo=true&decompress`,
        `/api/data/home/league-table?lang=${_lang}&decompress`,
        `/api/data/home/seo-block?lang=${_lang}&decompress`,
        `/api/data/home/livescores-v2?lang=${_lang}&decompress`,
        `/api/data/home/livescores-v2?seo=true&lang=${_lang}&decompress`,
      ],
    /**
     * @description
     *  📣 Target `data` returned.
     */
    data0
      = await promiseUrlsPreload
      (
        urls0,
        fetch,
      ) as IPreloadData0
  ;

  return data0;
}
