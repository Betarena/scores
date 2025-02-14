// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Content Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { entryTargetDataAuthorProfile } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import type { IPageAuthorProfileData } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │

export async function main
  (
    request: RequestEvent
  )
{
  return await tryCatchAsync
    (
      async (
      ): Promise<Response> =>
      {
        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract url query data.                                   │
        // ╰──────────────────────────────────────────────────────────────────╯

        const
          page = request.url.searchParams.get('page') || 0,
          uid = request.url.searchParams.get('uid') || ""
          ;

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article data.                              │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯


        const data: IPageAuthorProfileData | undefined = await fallbackDataGenerate0
          (
            page,
            uid
        )
          ;
        // ▓ [🐞]

        if (data != undefined) return json(data);


        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article translation.                       │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯


        return json
          (
            null
          );
      },
      (
        ex: unknown
      ): Response =>
      {
        // ▓ [🐞]
        console.error(`💀 Unhandled :: ${ex}`);

        return json
          (
            null
            , {
              status: 400,
              statusText: 'Uh-oh! There has been an error'
            }
          );
      }
    );
}

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN HELPER METHODS                                           │
// ╰──────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } permalink
 *  💠 Target `article` link (permalink).
 * @returns { Promise < IArticleData > }
 *  📤 Target `article` data.
 */
async function fallbackDataGenerate0
  (
    page: string | number,
    uid: string,
  ): Promise<IPageAuthorProfileData | undefined>
{
  try
  {
    const dataRes0: IPageAuthorProfileData = await entryTargetDataAuthorProfile({ uid, page: Number(page), optsQuery: { sortPublishDate: "desc"} });
    const sorted = dataRes0.mapArticle.sort((a, b) => {
      const dateA = a?.[1]?.published_date ? new Date(a[1].published_date).getTime() : 0;
      const dateB = b?.[1]?.published_date ? new Date(b[1].published_date).getTime() : 0;
      return dateB - dateA;
    });
    return { ...dataRes0, mapArticle: sorted };
  } catch (e)
  {
    console.trace(e)
  }
}
