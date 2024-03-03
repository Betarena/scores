// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader ('Server-Side')                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { dlog, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';
import { error } from '@sveltejs/kit';

import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';
import type { B_LS2_S, B_LS2_T } from '@betarena/scores-lib/types/livescores-v2.js';
import type { B_SEB_DT } from '@betarena/scores-lib/types/seo-block.js';
import type { B_SAP_HP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';
import type { B_FEATM_S, B_FEATM_T } from '@betarena/scores-lib/types/types.home.feat-match.js';
import type { B_LEGL_S, B_LEGL_T } from '@betarena/scores-lib/types/types.home.league-list.js';
import type { PageLoad } from './[sport]/$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').PageLoad}
 */
export async function load
(
  {
    // url,
    params,
    fetch
  }
): Promise < PageLoad >
{
  const
    t0: number = performance.now(),
    urlParam: string
      = params?.lang == undefined
        ? 'en'
        : params?.lang,
    validUrlCheck: boolean = await promiseValidUrlCheck
    (
      fetch,
      {
        langUrl: urlParam
      }
    )
  ;

  if (!validUrlCheck)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error
    (
      ERROR_CODE_INVALID,
      // @ts-expect-error
      PAGE_INVALID_MSG
    );
  ;

  const
    [
      PAGE_DATA_SEO,
      B_FEATM_T,
      B_FEATM_S,
      B_FEATB_T,
      B_TGOL_T,
      B_TGOL_S,
      B_LEGL_T,
      B_LEGL_S,
      B_LEGT_T,
      SEO_BLOCK_DATA,
      LIVESCORES_V2_T_DATA,
      LIVESCORES_V2_SEO
    ] = await fetchData
    (
      fetch,
      urlParam
    ),
    // [🐞]
    t1: number = performance.now()
  ;

  // [🐞]
  dlog
  (
    `⏳ HOME preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error 'unknown'
    // ╭─────
    // │ NOTE: FIXME:
    // │ > issues with setting correct <PageLoad> types.
    // ╰─────
    PAGE_DATA_SEO,
    B_FEATM_T,
    B_FEATM_S,
    B_FEATB_T,
    B_TGOL_T,
    B_TGOL_S,
    B_LEGL_T,
    B_LEGL_S,
    B_LEGT_T,
    SEO_BLOCK_DATA,
    LIVESCORES_V2_T_DATA,
    LIVESCORES_V2_SEO
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
        `/api/data/home/top-goalscorers?lang=${_lang}&seo=true`,
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

// #endregion ➤ 🛠️ METHODS
