// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Profile Data Endpoint                                        │
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
import { UPROF_UP_ENTRY_0, UPROF_UP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.profile.js';
import { PROFU_insertUserTx } from '@betarena/scores-lib/dist/graphql/query.profile.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';

import type { B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';
import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';
import type { RequestEvent, RequestHandler } from './$types';

// #endregion ➤ 📦 Package

// #region ➤ 📌 Variables

dotenv.config();

// #endregion ➤ 📌 Variables

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
  req: RequestEvent
): Promise < unknown >
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
      const lang: string = req?.url?.searchParams?.get('lang');
      const uid: string = req?.url?.searchParams?.get('uid');
      const hasura: string = req?.url?.searchParams?.get('hasura');

      // ╭──────────────────────────────────────────────────────────────────╮
      // │ NOTE:                                                            │
      // │ 👇 :|: extract target user UID profile critical data.            │
      // │ IMPORTANT                                                        │
      // │ Should not be cache and/or have cache store.                     │
      // ╰──────────────────────────────────────────────────────────────────╯
      const if_M_0: boolean =
        !checkNull(uid)
      ;
      if (if_M_0)
      {
        const data: B_PROF_D = await fallbackDataGenerate
        (
          uid
        );
        const loadType = 'HASURA';

        console.log(`📌 loaded [FSCR] with: ${loadType}`)

        if (data != undefined) return json(data);
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │ NOTE:                                                            │
      // │ 👇 :|: profile translaion data.                                  │
      // │        Uses Hasura Fallback.                                     │
      // │ TODO: Missing Cache Implementation                               │
      // ╰──────────────────────────────────────────────────────────────────╯
      const if_M_1: boolean =
        !checkNull(lang)
      ;
      if (if_M_1)
      {
        let data: unknown;
        let loadType = "cache";

        // IMPORTANT Default to Hasura;
        if (!data || hasura)
        {
          data = await fallbackDataGenerate1
          (
            lang
          );
          loadType = 'HASURA'
        }

        console.log(`📌 loaded [FPROB] with: ${loadType}`)

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
      // [🐞]
      console.error(`💀 Unhandled :: ${ex}`);

      return json
      (
        null,
        {
          status: 400,
          statusText: 'Uh-oh! There has been an error'
        }
      );
    }
  );
}

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
export const POST =
(
  async (
    {
      request
    }
  ) =>
  {
    try
    {
      // ◾️ NOTE:
      // ◾️ Handle url-query data;
      const uid: string = request?.url?.searchParams?.get('uid');
      const body: any = await request.json();
      const jsonBody: B_H_TH = JSON.parse(JSON.stringify(body));

      // [🐞]
      console.debug
      (
        `🔹 [var] uid ${uid}`,
        `🔹 [var] body ${JSON.stringify(body)}`,
      );

      const data: string[] = await PROFU_insertUserTx
      (
        jsonBody
      );

      return json(null);
    }
    catch (error)
    {
      //
    }

  }
) satisfies RequestHandler;

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN HELPER METHODS                                           │
// ╰──────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 fixture (lineup) widget main data (hasura) fallback;
 * @param { string } uid
 *  target user `UID`.
 * @returns { Promise < B_PROF_D > }
 *  profile section data.
 */
async function fallbackDataGenerate
(
  uid: string
): Promise < B_PROF_D >
{
  const dataRes0: [ B_PROF_D, string[] ] = await UPROF_UP_ENTRY_0
  (
    uid
  );

	return dataRes0?.[0];
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 featured betsites (widget) hasura TRANSLATION fetch;
 * @param { string } lang
 *  target language.
 * @returns { Promise < B_PROF_T > }
 *  profile section translation data.
 */
async function fallbackDataGenerate1
(
  lang: string
): Promise < B_PROF_T >
{
  const dataRes0: [ Map < string, B_PROF_T >, string[] ] = await UPROF_UP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0].size == 0)
    return null;

	return dataRes0?.[0].get(lang);
}

// #endregion ➤ 🛠️ Functions