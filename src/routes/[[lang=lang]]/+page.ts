// #region ➤ 📦 Package Imports

import { dlog, ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, HOME_LANG_PAGE_ERROR_MSG, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { PRELOAD_invalid_data, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';
import { error } from '@sveltejs/kit';

import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
import type { B_FEATM_S, B_FEATM_T } from '@betarena/scores-lib/types/feat-match.js';
import type { B_LEGL_T } from '@betarena/scores-lib/types/league-list.js';
import type { B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';
import type { B_LS2_S, B_LS2_T } from '@betarena/scores-lib/types/livescores-v2.js';
import type { B_SEB_DT } from '@betarena/scores-lib/types/seo-block.js';
import type { B_SAP_HP_T } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';
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

  const t0: number = performance.now();

  //#region [0] IMPORTANT EXTRACT URL DATA

	const urlLang: string =
		params?.lang == undefined
      ? 'en'
      : params?.lang
  ;

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT VALID URL CHECK

  const validUrlCheck: boolean = await promiseValidUrlCheck
  (
    fetch,
    urlLang
  );

  // [ℹ] exit;
	if (!validUrlCheck)
  {
		throw error
    (
			ERROR_CODE_INVALID,
			PAGE_INVALID_MSG
		);
	}

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region [0] IMPORTANT (PRE) PRE-LOAD DATA DOC: REF: [2]

	const urls: string[] =
  [
		// [ℹ] home (page)
		`/api/data/main/seo-pages?lang=${urlLang}&page=homepage`,
		// [ℹ] home (widgets)
		`/api/data/home/feat-match?lang=${urlLang}`,
		`/api/data/home/feat-match?lang=${urlLang}&seo=true`,
		`/api/data/home/feat-betsite?lang=${urlLang}`,
		`/api/data/home/top-goalscorers?lang=${urlLang}`,
		`/api/data/home/top-goalscorers?lang=${urlLang}&seo=true`,
		`/api/data/home/league-list?lang=${urlLang}`,
		`/api/data/home/league-table?lang=${urlLang}`,
		`/api/data/home/seo-block?lang=${urlLang}`,
		`/api/data/home/livescores-v2?lang=${urlLang}`,
		`/api/data/home/livescores-v2?seo=true&lang=${urlLang}`,
	];

  type HP_PROMISE =
  [
    B_SAP_HP_T | undefined,
    B_FEATM_T | undefined,
    B_FEATM_S | undefined,
    B_FEATB_T | undefined,
    B_TGOL_T | undefined,
    B_TGOL_S | undefined,
    B_LEGL_T | undefined,
    B_LEGT_T | undefined,
    B_SEB_DT | undefined,
    B_LS2_T | undefined,
    B_LS2_S | undefined
  ];

  const data = await promiseUrlsPreload
  (
    urls,
    fetch
  ) as HP_PROMISE;

	const
  [
		PAGE_DATA_SEO,
		B_FEATM_T,
    B_FEATM_S,
		B_FEATB_T,
		B_TGOL_T,
		B_TGOL_S,
		LEAGUE_LIST_WIDGET_DATA_SEO,
		B_LEGT_T,
		SEO_BLOCK_DATA,
    LIVESCORES_V2_T_DATA,
    LIVESCORES_V2_SEO
	] = data;

  //#endregion [0] IMPORTANT (PRE) PRE-LOAD DATA DOC: REF: [2]

  //#region [3] IMPORTANT RETURN

	const INVALID_PAGE_DATA_POINTS: boolean = data.includes(undefined);

	// FIXME: currently based on checking for any NULL/UNDEFINED data points
	// FIXME: should still allow for page access if page is VALID but widget data or
	// FIXME: otherwise page component is simply missing
	// [ℹ] exit;
	if (INVALID_PAGE_DATA_POINTS)
  {
		throw error
    (
			ERROR_CODE_PRELOAD,
			HOME_LANG_PAGE_ERROR_MSG
		);
	}

  PRELOAD_invalid_data
  (
    data,
    urls
  );

  // [🐞]
  const t1 = performance.now();
  dlog(`⏳ [HOME] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)

	// FIXME: types not working
	return {
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
		LEAGUE_LIST_WIDGET_DATA_SEO,
		B_LEGT_T,
		SEO_BLOCK_DATA,
    LIVESCORES_V2_T_DATA,
    LIVESCORES_V2_SEO
	};

  //#endregion [3] IMPORTANT RETURN

}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
