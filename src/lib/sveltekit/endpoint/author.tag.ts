// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Article Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

import { checkNull } from '$lib/utils/miscellenous.js';
import { getAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/v8/authors.articles.js';
import { entryAuthorGeneralData } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import type { IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';
import type { IPageAuthorDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯

export async function main
(
  request: RequestEvent
)
{
  return await tryCatchAsync
  (
    async (
    ): Promise < Response > =>
    {
      // ╭──────────────────────────────────────────────────────────────────╮
      // │ NOTE:                                                            │
      // │ 👇 :|: extract url query data.                                   │
      // ╰──────────────────────────────────────────────────────────────────╯

      const
        permalinkTag = request.url.searchParams.get('permalinkTag'),
        // hasura = request.url.searchParams.get('hasura'),
        lang = request.url.searchParams.get('lang')
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │ NOTE:                                                            │
      // │ 👇 :|: extract target article data.                              │
      // │ TODO:                                                            │
      // │ Add cache logic.                                                 │
      // ╰──────────────────────────────────────────────────────────────────╯
      if (permalinkTag)
        {
        const data: IPageAuthorDataFinal = await fallbackDataGenerate0
          (
            permalinkTag
          ),
          loadType = 'HASURA'
        ;
        // ▓ [🐞]
        console.log(`📌 loaded [FSCR] with: ${loadType}`)
       if (data != undefined) return json( data);
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
  permalinkTag: string
): Promise < IPageAuthorDataFinal >
{
  const dataRes0: IPageAuthorDataFinal = await entryAuthorGeneralData({ permalinkTag });

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
