// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format // V.8.0                                                           │
// │ ➤ Status      // 🔒 LOCKED                                                       │
// │ ➤ Author(s)   // @migbash                                                        │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module) ││ (Fixture) Content Data Endpoint                             │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📌 NOTE                                                                          │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 1. no logs allowed, including those custom 'debug' logs.                         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

// #region ➤ 📦 Package Imports

import { json, type RequestEvent } from '@sveltejs/kit';
// import { dev } from '$app/environment';

import { entryFixtureContentData, entryFixtureContentTranslation } from '@betarena/scores-lib/dist/functions/v8/fixture.content.js';
import { tryCatchAsyncV2 } from '@betarena/scores-lib/dist/util/common.js';

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
 *  📝 (Fixture) Content Data Endpoint handler.
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
        queryParamHasura = request.url.searchParams.get('hasura'),
        queryParamFixtureId = request.url.searchParams.get('fixture_id'),
        queryParamLanguage = request.url.searchParams.get('lang')
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET fixture (tip/article) data.              │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamFixtureId && queryParamLanguage)
      {
        const
          /**
           * @description
           * 📝 Data Response.
           */
          methodResponse0
            = await entryFixtureContentData
            (
              [parseInt(queryParamFixtureId)]
            ),
          /**
           * @description
           * 📝 Target key being requested.
           */
          key = `${queryParamFixtureId}__${queryParamLanguage}`,
          /**
           * @description
           * 📝 Target data.
           */
          listFixtureContent = methodResponse0[0].get(key)
        ;

        // [🐞]
        // console.log('', listFixtureContent);

        if (listFixtureContent != undefined) return json(listFixtureContent);
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET fixture (tip/article) translation data.  │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (!queryParamFixtureId && queryParamLanguage)
      {
        const
          /**
           * @description
           * 📝 Data Response.
           */
          methodResponse0
            = await entryFixtureContentTranslation
            (
              [queryParamLanguage]
            ),
          /**
           * @description
           * 📝 Target data.
           */
          objTranslation = methodResponse0[0].get(queryParamLanguage)
        ;

        // [🐞]
        // eslint-disable-next-line no-console
        // if (dev) console.log(target);

        if (objTranslation != undefined) return json(objTranslation);
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (default) data.                                                │
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
      // [🐞]
      // eslint-disable-next-line no-console
      console.error(ex);

      return API_DATA_ERROR_RESPONSE();
    }
  );
}
