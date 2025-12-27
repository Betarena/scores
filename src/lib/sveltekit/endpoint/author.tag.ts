// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Article Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// import { checkNull } from '$lib/utils/miscellenous.js';
// import { getAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.articles.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { entryTargetDataTag } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
// import type { IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
import { entryTargetDataAuthorTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.tags.js';
import { entryProfileTabAuthorSearchTag } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
import { TableAuthorTagsMutation0, type ITableAuthorTagsMutation0Out, type ITableAuthorTagsMutation0Var } from "@betarena/scores-lib/dist/graphql/v8/table.authors.tags.js";
import type { AuthorsSEODetailsDataJSONSchema } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';
import { json, type RequestEvent } from '@sveltejs/kit';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯
function covertSEOTemplate
(
  data: IPageAuthorTagDataFinal,
  domain: string | undefined
): AuthorsSEODetailsDataJSONSchema
{
  const { seoTamplate, tagId, mapTag } = data;
  const currentTag = mapTag.find(([id]) => id === tagId);
  if (!currentTag || !seoTamplate) return seoTamplate as AuthorsSEODetailsDataJSONSchema;
  const { main_data, opengraph, twitter_card } = seoTamplate as AuthorsSEODetailsDataJSONSchema;
  const tag = currentTag[1];
  const { name, permalink } = tag;
  const description = tag.description || name;
  const url = permalink?.startsWith('http') ? permalink : `https://${domain}/a/tag/${permalink}`;
  const newSeo: AuthorsSEODetailsDataJSONSchema = {
    ...seoTamplate,
    main_data: {
      ...main_data,
      description,
      title: main_data.title.replaceAll("{name}", name),
      keywords: name,
      canonical: url,
    },
    opengraph: {
      ...opengraph,
      url,
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
          {
            locals:
            {
              metadata
            },
          } = request,
          permalinkTag = request.url.searchParams.get('permalinkTag'),
          page = request.url.searchParams.get('page') || 0,
          translation = request.url.searchParams.get('translation'),
          search = request.url.searchParams.get('search')
          // hasura = request.url.searchParams.get('hasura'),
          ;
        let lang: string | undefined = request.url.searchParams.get('lang') || undefined;
        if (lang === "all") lang = undefined;
        const  langUser: string | undefined = request.locals.user?.lang;



        if (search !== null)
        {
          // ▓ [🐞]
          console.log(`🔍 search tags: ${search}`);
          const data = await searchTags(search);
          return json(data);
        }

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
              lang,
              langUser
            ),
            loadType = 'HASURA'
            ;
          // ▓ [🐞]
          console.log(`📌 loaded [FSCR] with: ${loadType}`)
          if (data.seoTamplate)
          {
            data.seoTamplate = { ...covertSEOTemplate(data, metadata?.domain) };
          }
          if (data != undefined) return json(data);
        }

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article translation.                       │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯

        if (translation)
        {
          const
            data = await fallbackDataGenerate1
              (
                translation
              ),
            loadType = 'HASURA'
            ;

          // ▓ [🐞]
          console.log(`📌 loaded [FSCR] with: ${loadType}`)

          if (data != undefined) return json(data);
        }

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
    language: string | undefined = undefined,
    languageUser: string | undefined = undefined
  ): Promise<IPageAuthorTagDataFinal & { translations: IPageAuthorTranslationDataFinal }>
{
  const dataRes0: IPageAuthorTagDataFinal = await entryTargetDataTag({ permalinkTarget, page: Number(page), languageUser, languageFilter: language });
  const dataRes1 = await entryTargetDataAuthorTranslation({ language: "en", cacheCheck: true })
  return { ...dataRes0, translations: dataRes1[0].get("en")! };
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } language
 *  💠 Target translation.
 * @returns { Promise < IPageAuthorTranslationDataFinal > }
 *  📤 Target `tags` data translations.
 */
async function fallbackDataGenerate1
  (
    language: string
  ): Promise<IPageAuthorTranslationDataFinal>
{
  const dataRes0 = await entryTargetDataAuthorTranslation({ language, cacheCheck: true });
  return dataRes0[0].get(language)!;
}


export async function updateFollowers(
  event: RequestEvent
)
{
  return await tryCatchAsync(async () =>
  {
    const
      {
        locals:
        {
          uid
        },
        request
      } = event
    ;

    if (!uid) return json(null);

    const { tagId, follow } = await request.json();

    const type = follow ? 'add' : 'delete';

    const data = await new _GraphQL().wrapQuery
      <
        ITableAuthorTagsMutation0Var
        , ITableAuthorTagsMutation0Out
      >
      (
        TableAuthorTagsMutation0(type)
        , {
          tagId,
          userUid: uid
        }
      );
    return json({ success: true, tag: data });
  })
}


export async function searchTags(text: string)
{
  const res = await entryProfileTabAuthorSearchTag({ tagName: text });
  return res;
}