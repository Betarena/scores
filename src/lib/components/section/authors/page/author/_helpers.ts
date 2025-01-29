// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2025-01-19                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { browser } from '$app/environment';
import { get } from '$lib/api/utils.js';
import session from '$lib/store/session.js';

import type { Page } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @description
 *  📝 Data Response
 * @returns { void }
 */
export function startArticleViewIncrement
(
): void
{
  // [🐞]
  // console.log
  // (
  //   '🚏 checkpoint ➤ startArticleViewIncrement(..)'
  // );

  window.addEventListener
  (
    'scroll',
    checkArticleViewIncrement
  );

  return;
}

/**
 * @author
 *  @migbash
 * @description
 *  📝 Data Response
 * @return { Promise < void > }
 */
export async function checkArticleViewIncrement
(
): Promise < void >
{
  if (!browser) return;

  // [🐞]
  // console.log
  // (
  //   '🚏 checkpoint ➤ checkArticleView(..)'
  // );

  const
    /**
     * @description
     * 📣 `articleId` from `sessionStore`.
     */
    articleId = (session.extract<Page>('page'))?.data.dataArticle?.article?.id
  ;

  // [🐞]
  // console.log('articleId', articleId);

  if (!articleId) return;

  window.removeEventListener
  (
    'scroll',
    checkArticleViewIncrement
  );

  await get
  (
    `/api/data/author/article?articleId=${articleId}`
  );

  return;
}
