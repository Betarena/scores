// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-07-01                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ :│ Custom Endpoint API Typescript Declaration
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { B_H_PROF_Q, IProfileData, IProfileTrs } from "@betarena/scores-lib/types/types.profile.js";

// #endregion ➤ 📦 Package Imports

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ INDIVIDUAL INTERFACE                                                        │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 INTERFACE
 * @description
 *  📝 Scores Endpoint - Profile Request/Response.
 */
export interface IScoresEndpointProfileMain
{
  /**
   * @description
   * 📝 Endpoint - Request
   */
  request: IScoresEndpointStandardRequest <
    {
      /**
       * @description
       * 📝 Target `user` uid to be sent notification to.
       */
      lang?: string;
      /**
       * @description
       * 📝 Target `user` uid to be sent notification to.
       */
      uid?: string;
    },
    {}
  >;
  /**
   * @description
   * 📝 Endpoint - Response
   */
  response: IScoresEndpointStandardResponse <
    IProfileData
    | IProfileTrs
    | B_H_PROF_Q,
    {}
  >;
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ STANDARD / GENERAL INTERFACE                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 INTERFACE
 * @description
 *  📝 Scores Endpoint - Standard Request.
 */
export interface IScoresEndpointStandardRequest
<
  TQuery = Record <string, unknown>,
  TBody = Record <string, unknown>
>
{
  /**
   * @description
   * 📝 Request (1) of type 'Query'
   */
  query:
  {
    /**
     * @description
     * 📝 Admin Token Authentication.
     */
    adminToken?: string;
  } & TQuery;
  /**
   * @description
   * 📝 Request (2) of type 'Body'
   */
  body: TBody;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 INTERFACE
 * @description
 * 📝 Scores Endpoint - Standard Response.
 */
export interface IScoresEndpointStandardResponse
<
  TSuccessData = Record <string, unknown>,
  TErrorData = Record <string, unknown>
>
{
  /**
   * @description
   * 📝 Status
   */
  status: string;
  /**
   * @description
   * 📝 Response (1) of type 'Success'
   */
  success:
  {
    /**
     * @description
     * 📝 Data response.
     */
    data: TSuccessData;
  }
  /**
   * @description
   * 📝 Response (2) of type 'Error'
   */
  error?:
  {
    /**
     * @description
     * 📝 Custom error cause.
     */
    cause: TErrorData;
    /**
     * @description
     * 📝 List errors accumulated.
     */
    log: [string, string][];
  }
}
