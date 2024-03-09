// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Article Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

// ╭──────────────────────────────────────────────────────────────────╮
// │ NOTE:                                                            │
// │ Please add inside 'this' region the 'imports' that are required  │
// │ by 'this' .svelte file is ran.                                   │
// │ IMPORTANT                                                        │
// │ Please, structure the imports as follows:                        │
// │ 1. svelte/sveltekit, external imports                            │
// │ 2. project-internal files and logic                              │
// │ 5. type(s) imports(s)                                            │
// ╰──────────────────────────────────────────────────────────────────╯

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

import { checkNull } from '$lib/utils/miscellenous.js';
import { getAuthorArticleByPermalink, getAuthorArticleTranslation } from '@betarena/scores-lib/dist/functions/func.authors-articles.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';

import type { IArticleData, IArticleTranslation } from '@betarena/scores-lib/types/types.authors.articles.js';

// #endregion ➤ 📦 Package

// ▓ IMPORTANT
dotenv.config();

// #region ➤ 🛠️ Functions

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 fixture (lineup) widget main data (hasura) fallback;
 * @param { RequestEvent } req
 * @returns { Promise < unknown > }
 */
export async function GET
(
  request
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
        permalink = request.url.searchParams.get('permalink'),
        hasura = request.url.searchParams.get('hasura'),
        lang = request?.url?.searchParams?.get('lang')
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │ NOTE:                                                            │
      // │ 👇 :|: extract target article data.                              │
      // │ TODO:                                                            │
      // │ Add cache logic.                                                 │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (!checkNull(permalink))
      {
        const
          data: IArticleData = await fallbackDataGenerate0
          (
            permalink!
          ),
          loadType = 'HASURA'
        ;

        // ▓ [🐞]
        console.log(`📌 loaded [FSCR] with: ${loadType}`)

        if (data != undefined) return json(data);
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │ NOTE:                                                            │
      // │ 👇 :|: extract target article translation.                       │
      // │ TODO:                                                            │
      // │ Add cache logic.                                                 │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (!checkNull(lang))
      {
        const
          data: IArticleTranslation = await fallbackDataGenerate1
          (
            lang
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
    }
    , (
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
  permalink: string
): Promise < IArticleData >
{
  const dataRes0: [ IArticleData, string[] ] = await getAuthorArticleByPermalink
  (
    permalink
  );

  return dataRes0[0];
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
async function fallbackDataGenerate1
(
  lang: string
): Promise < IArticleTranslation | null | undefined >
{
  const dataRes0 = await getAuthorArticleTranslation
  (
    [lang]
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

  return dataRes0?.[0].get(lang);
}

// #endregion ➤ 🛠️ Functions
