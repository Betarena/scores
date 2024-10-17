import { ERROR_CODE_INVALID } from '$lib/utils/debug.js';
import { preloadExitLogic, promiseValidUrlCheck } from '$lib/utils/navigation.js';
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
      ),
    /**
     * @description
     *  📣 `Data` object for target `route`.
     */
    response: any = {}
    ;

  if (!isUrlValid)
    preloadExitLogic
      (
        0,
        '(authors)',
        ERROR_CODE_INVALID
      );
  ;
  const res = await fetch(`/api/data/author/article?permalink=${permalink}`);
  const article = await res.json();
  return { ...article };
}) satisfies PageLoad;