// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Article Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// import { checkNull } from '$lib/utils/miscellenous.js';
// import { getAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.articles.js';
import { entryTargetDataTag } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
// import type { IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯
function covertSEOTemplate(data: IPageAuthorTagDataFinal)
{
  const { seoTamplate, tagId, mapTag } = data;
  const currentTag = mapTag.find(([id]) => id === tagId);
  if (!currentTag) return seoTamplate;
  const { main_data, opengraph, twitter_card } = seoTamplate;
  const tag = currentTag[1];
  const { name, permalink } = tag;
  const description = tag.description || name;
  const newSeo = {
    ...seoTamplate,
    main_data: {
      description,
      title: main_data.title.replace(/{name}/g, name),
      keywords: name,
      canonical: permalink,
    },
    opengraph: {
      ...opengraph,
      // url: permalink,
      description,
      // images: opengraph.images.map((img) => ({...img, alt: name })),
      title: opengraph.title.replace(/{name}/g, name),

    },
    twitter_card: {
      ...twitter_card,
      title: twitter_card.title.replace(/{name}/g, name),
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
          permalinkTag = request.url.searchParams.get('permalinkTag'),
          page = request.url.searchParams.get('page') || 0
          // hasura = request.url.searchParams.get('hasura'),
          ;
        let lang: string | undefined = request.url.searchParams.get('lang') as string;
        if (lang === "all") lang = undefined;

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article data.                              │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯
        if (permalinkTag)
        {
          const data: IPageAuthorTagDataFinal = await fallbackDataGenerate0
            (
              permalinkTag,
              page,
              lang
            ),
            loadType = 'HASURA'
            ;
          // ▓ [🐞]
          console.log(`📌 loaded [FSCR] with: ${loadType}`)
          if (data.seoTamplate)
          {
            // data.seoTamplate = {...covertSEOTemplate(data)};
          }
          if (data != undefined) return json(data);
        }

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article translation.                       │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯

        // if (!checkNull(lang))
        // {
        //   const
        //     data: IArticleTranslation = await fallbackDataGenerate1
        //     (
        //       lang
        //     ),
        //     loadType = 'HASURA'
        //   ;

        //   // ▓ [🐞]
        //   console.log(`📌 loaded [FSCR] with: ${loadType}`)

        //   if (data != undefined) return json(data);
        // }

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
    permalinkTarget: string,
    page: string | number,
    language: string | undefined = undefined
  ): Promise<IPageAuthorTagDataFinal>
{
  const dataRes0: IPageAuthorTagDataFinal = await entryTargetDataTag({ permalinkTarget, page: Number(page), language });
  return dataRes0;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } lang
 *  💠 Target translation.
 * @returns { Promise < IArticleData > }
 *  📤 Target `article` data.
 */
// async function fallbackDataGenerate1
// (
//   lang: string
// ): Promise < IArticleTranslation | null | undefined >
// {
//   const dataRes0 = await getAuthorArticleTranslation
//   (
//     [lang]
//   );

//   if (dataRes0[0].size == 0)
//     return null;
//   ;

//   return dataRes0[0].get(lang);
// }
