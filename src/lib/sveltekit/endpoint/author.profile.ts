// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Content Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// import { checkNull } from '$lib/utils/miscellenous.js';
// import { getAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.articles.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { entryPageAuthorDataAndSeo, entryTargetDataAuthorHome, entryTargetDataAuthorProfile } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
// import type { IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
import type { IPageAuthorProfileData, IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { AuthorsSEODetailsDataJSONSchema } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯
function covertSEOTemplate(data: IPageAuthorTagDataFinal, url): AuthorsSEODetailsDataJSONSchema
{
  const { seoTamplate } = data;
  if (!seoTamplate) return seoTamplate as any;
  const { main_data, opengraph } = seoTamplate as AuthorsSEODetailsDataJSONSchema;
  const newSeo: AuthorsSEODetailsDataJSONSchema = {
    ...seoTamplate,
    main_data: {
      ...main_data,
      canonical: main_data.canonical.replaceAll("{url}", url),
    },
    opengraph: {
      ...opengraph,
      url: opengraph.url.replaceAll("{url}", url),

    },
  };
  return newSeo;
}
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
          page = request.url.searchParams.get('page') || 1,
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
          ),
          loadType = 'HASURA'
          ;
        // ▓ [🐞]
        if (data?.seoTamplate)
        {
          data.seoTamplate = { ...covertSEOTemplate(data, request.url.origin) };
        }
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
    language: string | undefined = undefined
  ): Promise<IPageAuthorProfileData | undefined>
{
  try
  {
    const dataRes0: IPageAuthorProfileData = await entryTargetDataAuthorProfile({ uid, page: Number(page) });
    return { ...dataRes0 };
  } catch (e)
  {
    console.trace(e)
  }
}
