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

/* eslint-disable new-cap */

// #region ➤ 📦 Package Imports

import { json, type RequestEvent } from '@sveltejs/kit';

import { entryTranslation } from '@betarena/scores-lib/dist/functions/v8/translation.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';

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
 *  📝 (Author) Home General Data Endpoint handler.
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
        queryParamLanguage = request.url.searchParams.get('lang')
      ;

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
          dataRes0
            = await entryTranslation
            (
              {
                language: queryParamLanguage,
                cacheCheck: false
              }
            ),
          /**
           * @description
           * 📝 Target dataRes0.
           */
          target
            = dataRes0[0].get(queryParamLanguage)
        ;

        // [🐞]
        // eslint-disable-next-line no-console
        // if (dev) console.log(target);

        if (dataRes0 != undefined)
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
      // [🐞]
      // eslint-disable-next-line no-console
      console.error(ex);

      return API_DATA_ERROR_RESPONSE();
    }
  );
}
