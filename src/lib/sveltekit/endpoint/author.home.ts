// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format // V.8.0                                                           │
// │ ➤ Status      // 🔒 LOCKED                                                       │
// │ ➤ Author(s)   // @migbash                                                        │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module) ││ (Author) Article Data Endpoint                              │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📌 NOTE                                                                          │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 1. no logs allowed, including those custom 'debug' logs.                         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { json, type RequestEvent } from '@sveltejs/kit';

import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';
import { entryTargetDataAuthorHome } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';

import type { AuthorsSEODetailsDataJSONSchema } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import type { IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';

// #endregion ➤ 📦 Package Imports

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ │ MAIN METHODS                                                │
// ╰──────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📝 (Author) Article Data Endpoint handler.
 * @param { RequestEvent } request
 *  💠 **[required]** Request Event.
 * @returns { Promise < Response > }
 *  📤 Response.
 */
export async function main
(
  request: RequestEvent
): Promise < Response >
{
  return await tryCatchAsync
  (
    async (
    ): Promise < Response > =>
    {
      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| extract url query data.                                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      const
        queryLanguage = request.url.searchParams.get('lang') ?? "",
        queryParamPage = request.url.searchParams.get('page') ?? 0,
        queryUserFollowingTagIds = request.url.searchParams.get('followingTags'),
        queryTypeQuery = request.url.searchParams.get('type')
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET article data.                            │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryLanguage)
      {
        const
          /**
           * @description
           * 📝 Data Response.
           */
          data
            = await entryTargetDataAuthorHome
            (
              {
                language: (queryLanguage === "all" ? undefined : queryLanguage),
                page: Number(queryParamPage),
                // @ts-expect-error
                strTypeQuery: queryTypeQuery ?? 'forecast',
                listIntTagIdsExluded: [1673, 1648, 1676, 1650, 1681, 1668, 1680, 1093, 7132, 12366],
                userFollowingTagIds: queryUserFollowingTagIds
                  ?.split(',')
                  ?.map
                  (
                    id =>
                    {
                      return parseInt(id);
                    }
                  )
                ,
              }
            )
        ;

        if (data.seoTamplate)
          data.seoTamplate =
          {
            ...covertSEOTemplate(data, request.url.origin)
          };
        ;

        if (data != undefined)
          return json(data);
        ;
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
      // [🐞]
      // eslint-disable-next-line no-console
      console.error(ex);

      return API_DATA_ERROR_RESPONSE();
    }
  );
}

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ │ MAIN HELPER METHODS                                         │
// ╰──────────────────────────────────────────────────────────────────╯

function covertSEOTemplate
(
  data: IPageAuthorTagDataFinal,
  url
): AuthorsSEODetailsDataJSONSchema
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
