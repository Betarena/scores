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

import { checkNull } from '$lib/utils/platform-functions.js';
import { getAuthorArticleByPermalink } from '@betarena/scores-lib/dist/functions/func.authors-articles.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';

import type { IArticleData } from '@betarena/scores-lib/types/types.authors.articles.js';

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
        permalink: string | null = request.url.searchParams.get('permalink')
        , hasura: string | null = request.url.searchParams.get('hasura')
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
          )
          , loadType = 'HASURA'
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
          status: 400
          , statusText: 'Uh-oh! There has been an error'
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

// #endregion ➤ 🛠️ Functions
