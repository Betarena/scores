// #region ➤ 📦 Package Imports

import { getCookie } from '$lib/store/cookie.js';
import { PRELOAD_redirectPage, promiseUrlsPreload } from '$lib/utils/platform-functions.js';

import type { B_PROF_T } from '@betarena/scores-lib/types/profile.js';
import type { B_SAP_D2, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { PageServerLoadEvent } from './$types';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').PageServerLoadEvent}
 */
export async function load
(
  event: PageServerLoadEvent
): Promise < PageServerLoadEvent >
{

  const
  {
    params,
    fetch
  } = event;

  const _langUrl: string =
    [undefined, 'en'].includes(params?.lang)
      ? 'en'
      : params.lang
  ;

  // ### CHECK
  // ### for required 'cookies',
  // ### on absence, exit (via redirect) page.
  // ### CHECK

  const cookies: Record < string, string > = getCookie
  (
    event.request.headers.get('cookie') ?? ''
  );
  const loggedInCookie: string = cookies?.betarenaCookieLoggedIn;

  const if_M_0: boolean =
    loggedInCookie == undefined
  ;
  if (if_M_0)
  {
    const url: string =
      _langUrl == 'en'
        ? '/'
        : `/${_langUrl}`
    ;
    PRELOAD_redirectPage
    (
      url
    );
  }

  const
  [
    B_SAP_D2,
    B_SAP_D3_SP_M,
    RESPONSE_PROFILE_DATA
  ] = await fetchData
  (
    fetch,
    _langUrl
  );

  return {
    // @ts-expect-error <-error-desc->
    B_SAP_D2,
    B_SAP_D3_SP_M,
    RESPONSE_PROFILE_DATA
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
  B_PROF_T | undefined,
  B_SAP_D3 | undefined,
  B_SAP_D2 | undefined,
];

/**
 * @description
 * TODO: DOC:
 */
async function fetchData
(
  fetch: any,
  _lang: string
): Promise < PP_PROMISE_0 >
{

  const urls_0: string[] =
  [
    `/api/data/main/seo-pages?months=true&lang=${_lang}`,
    `/api/data/main/seo-pages?term=football`,
    `/api/data/profile?lang=${_lang}`
  ];

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    urls_0,
    fetch
  ) as PP_PROMISE_0;

  return data_0;
}

// #endregion ➤ 🛠️ METHODS