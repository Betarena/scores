// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)                                                                │
// │ |: Profile Main Endpoint Handler
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📌 NOTE                                                                          │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 1. no logs allowed, including those custom 'debug' logs.                         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable new-cap */
/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { json, type RequestEvent } from '@sveltejs/kit';
// import { dev } from '$app/environment';

import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import { UPROF_UP_ENTRY_0, UPROF_UP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
import { IProfileMutation0Out, profileMutation0, type IProfileMutation0Var } from '@betarena/scores-lib/dist/graphql/query.profile.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';

import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';

import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟥 │ LOGIC - MAIN                                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📝 (Author) Article Data Endpoint handler.
 * @param { RequestEvent } request
 *  ❗️ **REQUIRED** Request Event.
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
        // ╭─────
        // │ NOTE:
        // │ |: Destruct request object.
        // ╰─────
        {
          request:
          {
            method
          }
        } = request,
        queryParamLanguage = request.url.searchParams.get('lang'),
        queryParamUid = request.url.searchParams.get('uid')
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET article data.                            │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamUid && method === 'GET')
      {
        const
          /**
           * @description
           */
          dataRes0
            = await helperDataGenerate_0
            (
              queryParamUid
            )
        ;

        if (dataRes0 != undefined)
          return json(dataRes0);
        ;
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET translation data.                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamLanguage && method === 'GET')
      {
        const
          /**
           * @description
           * 📝 Data Response.
           */
          data
            = await helperDataGenerate_1
            (
              queryParamLanguage
            )
        ;

        if (data != undefined)
          return json(data);
        ;
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET translation data.                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamUid && method === 'POST')
        await helperDataGenerate_2(request);
      ;

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

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟦 │ LOGIC - HELPER                                                              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🔷 HELPER
 * @description
 *  📝 fixture (lineup) widget main data (hasura) fallback;
 * @param { string } uid
 *  💠 Target `profile` uid.
 * @returns { Promise < IProfileData > }
 */
async function helperDataGenerate_0
(
  uid: string
): Promise < IProfileData >
{
  const
    /**
     * @description
     * 📝 Data Response.
     */
    dataRes0
      = await UPROF_UP_ENTRY_0
      (
        uid
      )
  ;

  return dataRes0[0];
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔷 HELPER
 * @description
 *  📝 featured betsites (widget) hasura TRANSLATION fetch;
 * @param { string } lang
 *  💠 Target `profile` language.
 * @returns { Promise < IProfileTrs > }
 */
async function helperDataGenerate_1
(
  lang: string
): Promise < IProfileTrs | null >
{
  const
    /**
     * @description
     * 📝 Data Response.
     */
    dataRes0
      = await UPROF_UP_ENTRY_1
      (
        [lang]
      )
  ;

  if (dataRes0[0].size == 0 || !dataRes0[0].has(lang))
    return null;
  ;

  return dataRes0[0].get(lang)!;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📝 Fallback data generation.
 * @param { RequestEvent } request
 *  ❗️ **REQUIRED** Request Event.
 * @returns { Promise < void > }
 */
async function helperDataGenerate_2
(
  request: RequestEvent
): Promise < void >
{
  console.log('HERE-TESTING!');

  const
    /**
     * @description
     * 📝 Data Response.
     */
    objRequestBody: IProfileMutation0Var['objects'] = await request.request.json(),
    /**
     * @description
     * 📝 Data Response.
     */
    dataRes0
      = await new Betarena_User_Class().obtainPublicInformationTargetUsers
      (
        {
          query:
          {
            isDataPrivateMask: false
          },
          body:
          {
            user_uids: [objRequestBody.uid],
            isSearchByUsername: false
          }
        }
      )
  ;

  if ((dataRes0.success.data[0]?.main_balance ?? 0) > 0)
    await new _GraphQL().wrapQuery
    <
      IProfileMutation0Var,
      IProfileMutation0Out
    >
    (
      profileMutation0,
      {
        objects: objRequestBody
      }
    );
  ;

  return;
}

// #endregion ➤ 🛠️ METHODS
