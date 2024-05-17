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
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { json, type RequestEvent } from '@sveltejs/kit';

import { entryAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.articles.js';
import { entryTargetDataArticle } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js';
import { tryCatchAsyncV2 } from '@betarena/scores-lib/dist/util/common.js';

import { postv2 } from '$lib/api/utils.js';
import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';

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
  return await tryCatchAsyncV2
  (
    async (
    ): Promise < Response > =>
    {
      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| extract url query data.                                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      const
        queryParamPermalink = request.url.searchParams.get('permalink'),
        queryParamLanguage = request.url.searchParams.get('lang')
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET article data.                            │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamPermalink)
      {
        const
          /**
           * @description
           * 📝 Data Response.
           */
          data
            = await entryTargetDataArticle
            (
              {
                permalinkTarget: queryParamPermalink,
                cacheCheck: true
              }
            )
        ;

        // console.log('data-091', data);

        // ╭─────
        // │ NOTE: IMPORTANT
        // │ ➤ Trigger article 're-cache' and 'TTL' update
        // ╰─────
        await postv2
        (
          // 'https://webhook.site/a16a8324-c046-487a-a1ac-db6e1eaffed6',
          `
            http://65.109.14.126:8500/sitemap-and-preload
              ?
                ids[]=${data.article.id}
              &
                operation[]=preload-target
              &
                category[]=author_article
          `
          .replaceAll('\n', '')
          .replaceAll(' ', '')
          ,
          { }
        );

        if (data != undefined)
          return json(data);
        ;
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET translation data.                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamLanguage)
      {
        const
          /**
           * @description
           * 📝 Data Response.
           */
          data
            = await entryAuthorArticleTranslation
            (
              {
                language: queryParamLanguage,
                cacheCheck: true
              }
            ),
          /**
           * @description
           * 📝 Target data.
           */
          target
            = data.get(queryParamLanguage)
        ;

        // [🐞]
        console.log('data-091', target);

        if (data != undefined)
          return json(target);
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
      return API_DATA_ERROR_RESPONSE();
    }
  );
}