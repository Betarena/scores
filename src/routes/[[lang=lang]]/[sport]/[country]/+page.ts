import { dlog, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { promiseValidUrlCheck } from '$lib/utils/platform-functions.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad, PageLoadEvent } from '../$types';

/** @type {import('./$types').PageLoad} */
export async function load
(
  {
    // url,
    params,
    fetch
  }: PageLoadEvent
): Promise < PageLoad > {

  const t0 = performance.now();

  //#region [0] IMPORTANT EXTRACT URL DATA

  const { 
    lang,
    sport,
    // @ts-expect-error unknown RouteParam, that exists
    country
  } = params

  const urlLang: string =
    params?.lang == undefined 
      ? 'en' 
      : params?.lang
  ;

  //#endregion [0] IMPORTANT EXTRACT URL DATA

  //#region IMPORTANT URL (validation)

    const validUrlCheck = await promiseValidUrlCheck
    (
      fetch,
      urlLang,
      sport,
      country
    )
  
    // [ℹ] exit;
    if (!validUrlCheck) {
      // [🐞]
      const t1 = performance.now();
      dlog(`⏳ [SPORT] preload ${((t1 - t0) / 1000).toFixed(2)} sec`, true)
      throw error(
        ERROR_CODE_INVALID,
        PAGE_INVALID_MSG
      );
    }
  
    //#endregion IMPORTANT URL (validation)

  const URL: string =
    lang == undefined 
      ? '/' 
      : `/${lang}`
  ;

	throw redirect(302, `${URL}`);
}