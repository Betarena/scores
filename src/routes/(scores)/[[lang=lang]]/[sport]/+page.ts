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

import { error, redirect } from '@sveltejs/kit';

import { ERROR_CODE_INVALID, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { promiseValidUrlCheck } from '$lib/utils/platform-functions.js';

import type { PageLoad, PageLoadEvent } from './$types.js';

// #endregion ➤ 📦 Package Imports

/**
 * @type {import('./$types').PageLoad}
 */
export async function load
(
  {
    // url,
    params,
    fetch
  }: PageLoadEvent
): Promise < PageLoad >
{
  const
    /**
     * @description
     *  📣 Destruct `object`.
     */
    {
      lang,
      sport
    } = params,
    /**
     * @description
     *  📣 Target `language`.
     */
    urlLang: string
      = params.lang == undefined
        ? 'en'
        : params.lang,
    /**
     * @description
     *  📣 Check for `valid` url.
     */
    validUrlCheck
      = await promiseValidUrlCheck
      (
        fetch,
        {
          langUrl: urlLang,
          sportUrl: sport
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
    URL: string
      = lang == undefined
        ? '/'
        : `/${lang}`
  ;

  throw redirect(302, `${URL}`);
}
