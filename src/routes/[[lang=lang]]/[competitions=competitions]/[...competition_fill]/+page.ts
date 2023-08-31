// #region ➤ 📦 Package Imports

import { ERROR_CODE_INVALID, ERROR_CODE_PRELOAD, LAYOUT_1_LANG_PAGE_ERROR_MSG, dlog } from '$lib/utils/debug';
import { PRELOAD_exitPage, promiseUrlsPreload, promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { B_SAP_CTP_D, B_SAP_CTP_T, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_COMP_MAIN_T } from '@betarena/scores-lib/types/types.competition.main.js';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { PageLoad } from '../$types.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export async function load
(
  event: ServerLoadEvent
): Promise < PageLoad >
{

  // ### [🐞]
  const t0: number = performance.now();

  const
  {
    url,
    fetch,
    params,
    request,
    // setHeaders,
    // route
  } = event;

  // ### [🐞]
  // ### example: "/br/competicoes/predictor/lag-persita-kommer-att-vinna/31"
  // console.log(url?.pathname);
  // ### [🐞]
  // ### example: "predictor/lag-persita-kommer-att-vinna/31"
  // console.log(params?.competition_fill);

  const _langUrl: string =
    [undefined, 'en'].includes(params?.lang)
      ? 'en'
      : params.lang
  ;

  // ### [🐞]
  // ### example: "es"
  // console.log(_langUrl);

  const competitionId = params?.competition_fill?.match(/\d+$/);
  const COMPETITION_ID = parseInt(competitionId as unknown as string);

  // ### [🐞]
  // ### example: "31"
  // console.log(competitionId);

  // **************************************
  // 📌 VALIDATE URL                      *
  // **************************************

  const validUrlCheck: boolean = await promiseValidUrlCheck
  (
    fetch,
    {
      langUrl: _langUrl,
      competitionMainUrl: params?.competitions,
      competitionUrl: params?.competition_fill
    }
  );

  console.log('🟩', validUrlCheck);

  // ### CHECK
  // ### for exit.
  if (!validUrlCheck)
  {
    PRELOAD_exitPage
    (
      t0,
      '[competitions=competitions]',
      ERROR_CODE_INVALID
    );
  }

  console.log('🟥');

  let
  [
    B_SAP_CTP_T,
    B_SAP_CTP_D,
    B_SAP_D3_CP_M,
    B_COMP_MAIN_T
  ] = await fetchData
  (
    fetch,
    _langUrl,
    competitionId as unknown as string
  );

  // ### IMPORTANT
  // ### exit condition.
  const if_M_0: boolean =
    B_SAP_CTP_D == undefined
  ;
	if (if_M_0)
  {
    PRELOAD_exitPage
    (
      t0,
      `[LAYOUT]`,
      ERROR_CODE_PRELOAD,
      LAYOUT_1_LANG_PAGE_ERROR_MSG
    );
	}

  B_SAP_CTP_T = mutateSeoData
  (
    B_SAP_CTP_T,
    B_SAP_CTP_D,
    url?.pathname
  );

  // ### [🐞]
  const t1: number = performance.now();

  // ### [🐞]
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
    B_COMP_MAIN_T
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
  B_COMP_MAIN_T | undefined,
  // B_COMP_MAIN_S | undefined
];

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
): Promise < PP_PROMISE_0 >
{

  // ### [🐞]
  dlog
  (
    `🚏 checkpoint ➤ src/routes/[[lang=lang]]/[competitions=competitions]/[...competition_fill] fecthData`
  );

  const urls_0: string[] =
  [
    `/api/data/main/seo-pages?lang=${_lang}&page=competition`,
    `/api/data/main/seo-pages?competition_id=${_competitionId}&page=competition`,
    `/api/data/main/seo-pages?term=competitions`,
    `/api/data/competition/main?lang=${_lang}`,
    // `/api/data/competition?seo=true&lang=${_lang}`,
  ];

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    urls_0,
    fetch
  ) as PP_PROMISE_0;

  return data_0;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @param
 * { B_SAP_CTP_T } data - competition (page) target - `seo` / `translations` data.
 *
 * @param
 * { B_SAP_CTP_D } data2 - competition (page) target - critical data.
 *
 * @param
 * { string } pathname - competition (page) target current pathname.
 *
 * @returns
 * a mutated data `object`.
 */
function mutateSeoData
(
  data: B_SAP_CTP_T,
  data2: B_SAP_CTP_D,
  pathname: string
): B_SAP_CTP_T
{
  console.log('data', data)
  console.log('data2', data2)
  console.log('pathname', pathname)

  let pageTitle: string = data?.general?.data?.title
    .replace(/{ID}/g, data2?.data?.team_name)
  ;
  pageTitle += data2?.data?.target_competition_prediction;

  data.main_data = JSON.parse
  (
		JSON.stringify(data?.main_data)
      .replace('/{type}/{type_name}/{sport}/{title}-{prediction}/{id}', pathname)
			.replace(/{title}/g, pageTitle)
      .replace(/{prediction}/g, '')
      .replace(/{creator}/g, '')
	);

	data.twitter_card = JSON.parse
  (
		JSON.stringify(data?.twitter_card)
    .replace('/{type}/{type_name}/{sport}/{title}-{prediction}/{id}', pathname)
    .replace(/{title}/g, pageTitle)
    .replace(/{prediction}/g, '')
    .replace(/{creator}/g, '')
	);

	data.opengraph = JSON.parse
  (
		JSON.stringify(data?.opengraph)
    .replace('/{type}/{type_name}/{sport}/{title}-{prediction}/{id}', pathname)
    .replace(/{title}/g, pageTitle)
    .replace(/{prediction}/g, '')
    .replace(/{creator}/g, '')
	);

  return data;
}

// #endregion ➤ 🛠️ METHODS