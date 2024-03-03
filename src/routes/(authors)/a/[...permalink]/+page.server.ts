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

import { promiseUrlsPreload } from '$lib/utils/platform-functions.js';

import type { IArticleData } from '@betarena/scores-lib/types/types.authors.articles.js';
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
      params
      , fetch
    } = event,
    [
      dataArticle
    ] = await fetchData
    (
      fetch
      , params.permalink
    )
  ;

  // console.log(dataArticle);

  return {
    // @ts-expect-error
    dataArticle
  };
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]

// #region ➤ 🛠️ METHODS

/**
 * @description
 * TODO: DOC:
 */
type PreloadPromise0 =
[
  IArticleData | undefined
];

/**
 * @description
 * TODO: DOC:
 */
async function fetchData
(
  fetch: any
  , _permalink: string
): Promise < PreloadPromise0 >
{
  const
    urls0: string[]
    = [
      `/api/data/author?permalink=${_permalink}`
    ],
    data0 = await promiseUrlsPreload
    (
      urls0
      , fetch
    ) as PreloadPromise0
  ;

  return data0;
}

// #endregion ➤ 🛠️ METHODS
