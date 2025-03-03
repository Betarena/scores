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

import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import { UPROF_UP_ENTRY_0, UPROF_UP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
import { IProfileMutation0Out, profileMutation0, type IProfileMutation0Var } from '@betarena/scores-lib/dist/graphql/query.profile.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';

import type { IScoresEndpointProfileMain } from '$lib/types/endpoint.js';

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
      // │:| extract request data.                                          │
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
          },
          url:
          {
            searchParams
          }
        } = request,
        // ╭─────
        // │ NOTE:
        // │ |: Extract query parameters.
        // │ |: following definition of :: IScoresEndpointProfileMain['request']
        // ╰─────
        queryParamLanguage = searchParams.get('lang'),
        queryParamUid = searchParams.get('uid')
      ;

      let
        /**
         * @description
         * 📝 Data Response.
         */
        // @ts-expect-error
        dataRes0: IScoresEndpointProfileMain['response'] = {}
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (GET) fetch TARGET user data.                                  │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamUid && method === 'GET')
        dataRes0 = await helperDataGenerate_0
        (
          queryParamUid
        );
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (GET) fetch TARGET translation data.                           │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamLanguage && method === 'GET')
        dataRes0 = await helperDataGenerate_1
        (
          queryParamLanguage
        );
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (POST) trigger user WITHDRAWAL action.                         │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamUid && method === 'POST')
        dataRes0 = await helperDataGenerate_2
        (
          request
        );
      ;

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (default)                                                      │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (dataRes0 != null && Object.keys(dataRes0).length === 0)
        return API_DATA_ERROR_RESPONSE(1);
      else
        return json(dataRes0);
      ;
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
 *  📝 Helper logic for retrieving profile page User data.
 * @param { string } uid
 *  ❗️ **REQUIRED** User profile uid.
 * @returns { Promise < Response > }
 *  📤 Final Data Response.
 */
async function helperDataGenerate_0
(
  uid: string
): Promise < IScoresEndpointProfileMain['response'] >
{
  const
    /**
     * @description
     * 📝 Data Response.
     */
    objResponse: IScoresEndpointProfileMain['response']
      = {
        status: 'success',
        success: { data: {} }
      },
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

  objResponse.success.data = dataRes0[0];

  if (dataRes0[0] == null)
  {
    objResponse.status = 'error';
    objResponse.error = { cause: 'No data found', log: [] };
  }

  return objResponse;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔷 HELPER
 * @description
 *  📝 Helper logic for retrieving profile page 'translations'.
 * @param { string } lang
 *  ❗️ **REQUIRED** Langauge.
 * @returns { Promise < IProfileTrs > }
 *  📤 Final Data Response.
 */
async function helperDataGenerate_1
(
  lang: string
): Promise < IScoresEndpointProfileMain['response'] >
{
  const
    /**
     * @description
     * 📝 Data Response.
     */
    objResponse: IScoresEndpointProfileMain['response']
      = {
        status: 'success',
        success: { data: {} }
      },
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

  objResponse.success.data = dataRes0[0].get(lang)!;

  if (dataRes0[0] == null || dataRes0[0].get(lang) == null)
  {
    objResponse.status = 'error';
    objResponse.error = { cause: 'No data found', log: [] };
  }

  return objResponse;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📝 Helper logic for user requesting a Withdrawal action.
 * @param { RequestEvent } request
 *  ❗️ **REQUIRED** Request Event.
 * @returns { Promise < Response > }
 *  📤 Final Data Response.
 */
async function helperDataGenerate_2
(
  request: RequestEvent
): Promise < IScoresEndpointProfileMain['response'] >
{
  const
    /**
     * @description
     * 📝 Data Response.
     */
    objResponse: IScoresEndpointProfileMain['response']
      = {
        status: 'success',
        success: { data: {} }
      },
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

  if ((dataRes0.success.data[0]?.main_balance ?? 0) >= (objRequestBody.quantity ?? 0))
  {
    const
      /**
       * @description
       * 📝 Data Response.
       */
      dataRes1
        = await new _GraphQL().wrapQuery
        <
          IProfileMutation0Var,
          IProfileMutation0Out
        >
        (
          profileMutation0,
          {
            objects: objRequestBody
          }
        )
    ;

    objResponse.success.data = dataRes1[0];
  }
  else
  {
    objResponse.status = 'error';
    objResponse.error = { cause: 'Invalid accounts fund amount', log: [] };
  }

  return objResponse;
}

// #endregion ➤ 🛠️ METHODS
