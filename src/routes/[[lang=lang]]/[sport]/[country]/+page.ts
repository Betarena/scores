import { dlog, ERROR_CODE_INVALID, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad, PageLoadEvent } from '../$types';

/** @type {import('./$types').PageLoad} */
export async function load({
	url,
	params,
	fetch
}: PageLoadEvent): Promise < PageLoad > {

  const t0 = performance.now();

  //#region IMPORTANT URL (validation)

  // [ℹ] validate [1]
	const VALID_URL = await fetch(
    `/api/cache/_main_/pages_and_seo?url=${url.pathname}`, 
    {
		  method: 'GET'
	  }
  ).then((r) => r.json());
  
  // [ℹ] exit (condition)
	if (!VALID_URL) {
    const t1 = performance.now();
    dlog(`fixture (load) (exit) complete in: ${(t1 - t0) / 1000} sec`, true)
		throw error(ERROR_CODE_INVALID, PAGE_INVALID_MSG);
	}

  //#endregion IMPORTANT URL (validation)

	const { 
    lang 
  } = params

  const URL: string =
    lang == undefined 
      ? '/' 
      : `/${lang}`
  ;

	throw redirect(302, `${URL}`);
}