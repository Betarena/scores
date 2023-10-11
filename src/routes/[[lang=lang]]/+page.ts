// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Server Endpoint for Home Page (Prefetch) Data Load                     ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

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
import type { PageLoad } from './$types';

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

  // ### [🐞]
  const t0: number = performance.now();

	const urlLang: string =
		params?.lang == undefined
      ? 'en'
      : params?.lang
  ;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  //  📌 VALIDATE URL                     ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const validUrlCheck: boolean = await promiseValidUrlCheck
  (
    fetch,
    {
      langUrl: urlLang
    }
  );

  // ### CHECK | IMPORTANT
  // ### for page exit.
	if (!validUrlCheck)
  {
		throw error
    (
			ERROR_CODE_INVALID,
			PAGE_INVALID_MSG
		);
	}

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  //  📌 PREFETCH DATA                    ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

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
    urlLang
  );

  // ### [🐞]
  const t1: number = performance.now();

  // ### [🐞]
  dlog
  (
    `⏳ HOME preload ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

	return {
	  // FIXME: types not working
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // NOTE: issues with setting correct <PageLoad> types,
    // NOTE: not being applied to return;
    // NOTE: not critical - can be silenced;
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
 *  📌 Target `types` for `_this_` page required at preload.
 */
type PP_PROMISE_0 =
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

  // ### [🐞]
  dlog
  (
    `🚏 checkpoint [PRL] ➤ src/routes/[[lang=lang]] fecthData(..)`,
    true
  );

  const urls_0: string[] =
  [
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
  ];

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    urls_0,
    fetch,
  ) as PP_PROMISE_0;

  return data_0;
}

// #endregion ➤ 🛠️ METHODS