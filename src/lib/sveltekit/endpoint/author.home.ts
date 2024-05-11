// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Content Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// import { checkNull } from '$lib/utils/miscellenous.js';
// import { getAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.articles.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { entryTargetDataAuthorHome, entryTargetDataAuthorTranslation, entryTargetDataTag } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
// import type { IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
import type { IPageAuthorTagDataFinal, IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';
import { TableAuthorTagsMutation0, type ITableAuthorTagsMutation0Out, type ITableAuthorTagsMutation0Var } from "@betarena/scores-lib/dist/graphql/v8/table.authors.tags.js"
import type { AuthorsSEODetailsDataJSONSchema } from '@betarena/scores-lib/types/v8/_HASURA-0.js';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯
function covertSEOTemplate(data: IPageAuthorTagDataFinal): AuthorsSEODetailsDataJSONSchema
{
  const { seoTamplate, tagId, mapTag } = data;
  const currentTag = mapTag.find(([id]) => id === tagId);
  if (!currentTag || !seoTamplate) return seoTamplate as AuthorsSEODetailsDataJSONSchema;
  const { main_data, opengraph, twitter_card } = seoTamplate as AuthorsSEODetailsDataJSONSchema;
  const tag = currentTag[1];
  const { name, permalink } = tag;
  const description = tag.description || name;
  const newSeo: AuthorsSEODetailsDataJSONSchema = {
    ...seoTamplate,
    main_data: {
      ...main_data,
      description,
      title: main_data.title.replaceAll("{name}", name),
      keywords: name,
      canonical: permalink,
    },
    opengraph: {
      ...opengraph,
      url: permalink,
      description,
      images: opengraph.images.map((img) => ({ ...img, alt: name })),
      title: opengraph.title.replaceAll("{name}", name),

    },
    twitter_card: {
      ...twitter_card,
      title: twitter_card.title.replaceAll("{name}", name),
      description,
      image_alt: name
    }
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
          page = request.url.searchParams.get('page') || 0

          // hasura = request.url.searchParams.get('hasura'),
          ;
        let followingTags: string | number[] | null = request.url.searchParams.get('followingTags');
        let lang: string | undefined = request.url.searchParams.get('lang') || "" as string;
        if (lang === "all") lang = undefined;
        if (followingTags) followingTags = followingTags.split(',').map(id => parseInt(id));
        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article data.                              │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯
        if (lang)
        {
          const data: IPageAuthorTagDataFinal = await fallbackDataGenerate0
            (
              page,
              followingTags as number [],
              lang
            ),
            loadType = 'HASURA'
            ;
          // ▓ [🐞]
          console.log(`📌 loaded [FSCR] with: ${loadType}`)
          if (data.seoTamplate)
          {
            data.seoTamplate = { ...covertSEOTemplate(data) };
          }
          if (data != undefined) return json(data);
        }

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
    userFollowingTagIds: number[] = [],
    language: string | undefined = undefined
  ): Promise<IPageAuthorTagDataFinal>
{
  const dataRes0: IPageAuthorTagDataFinal = await entryTargetDataAuthorHome({userFollowingTagIds, page: Number(page), language });
  return { ...dataRes0 };
}
