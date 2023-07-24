// #region ➤ 📦 Package Imports

import { getCookie } from '$lib/store/cookie.js';
import { PRELOAD_invalid_data, PRELOAD_redirectPage, promiseUrlsPreload } from '$lib/utils/platform-functions.js';

import type { B_PROF_T } from '@betarena/scores-lib/types/profile.js';
import type { PageServerLoadEvent } from './$types';
import type { B_SAP_D2 } from '@betarena/scores-lib/types/seo-pages.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

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
  // [🐞]
  // console.debug(event)

  const _langUrl: string =
    [undefined, 'en'].includes(params?.lang)
      ? 'en'
      : params.lang
  ;

  // ### NOTE: CHECK
  // ### Check for required 'cookies',
  // ### on absent, exit (redirect) page.
  // ### NOTE: CHECK

  const cookies: Record < string, string > = getCookie
  (
    event.request.headers.get('cookie') ?? ''
  );
  const loggedInCookie: string = cookies?.betarenaCookieLoggedIn;
  // [🐞]
  // console.log('🍪', cookies?.betarenaCookieLoggedIn)

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
    RESPONSE_PROFILE_DATA
  ] = await fetchData
  (
    fetch,
    _langUrl
  );

  return {
    // @ts-expect-error <-error-desc->
    B_SAP_D2,
    RESPONSE_PROFILE_DATA
  };
}

/**
 * @description
 * TODO: DOC:
 */
type PP_PROMISE_0 =
[
  B_PROF_T | undefined,
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
    `/api/data/profile?lang=${_lang}`
  ];

  const data_0: PP_PROMISE_0 = await promiseUrlsPreload
  (
    urls_0,
    fetch
  ) as PP_PROMISE_0;

  // [🐞]
  PRELOAD_invalid_data
  (
    data_0,
    urls_0
  );

  return data_0;
}

// #endregion ➤ 🛠️ METHODS