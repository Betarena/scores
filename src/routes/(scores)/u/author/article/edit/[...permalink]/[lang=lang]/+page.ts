import { ERROR_CODE_INVALID } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseValidUrlCheck } from '$lib/utils/navigation.js';
import type { IPageAuhtorArticleDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) =>
{

  const { permalink } = params;
  /**
    * @description
    *  📣 Validate **this** `url`.
    */
  const isUrlValid
    = await promiseValidUrlCheck
      (
        fetch,
        {
          authorArticleUrl: permalink
        }
    )
    ;

  if (!isUrlValid)
    preloadExitLogic
      (
        0,
        '(authors)',
        ERROR_CODE_INVALID
      );
  ;
  const res = await fetch(`/api/data/author/article?permalink=${permalink}&edit=true`);
  const article = await res.json() as IPageAuhtorArticleDataFinal;
  return { ...article };
}) satisfies PageLoad;