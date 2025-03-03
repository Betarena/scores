// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 03-03-2024                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)                                                                │
// │ |: Fetch Helper Logic
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import LZString from 'lz-string';

import { dlogv2 } from '$lib/utils/debug.js';
import { tryCatch } from '$lib/utils/miscellenous.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📝 PROXY Fetch type GET
 * @param { string } endpoint
 *  ❗️ **REQUIRED** Endpoint to fetch data from.
 * @param { object } objParameters
 * ❔ **OPTIONAL** URL query parameters.
 * @param { any } instanceFetch
 *  ❔ **OPTIONAL** Fetch instance.
 * @param { boolean } isDecompress
 *  ❔ **OPTIONAL** Decompress data.
 * @returns { Promise < unknown > }
 *  📤 Data response.
 */
export async function get_v1
<
  TRequest,
  TResponse
>
(
  {
    endpoint,
    objParameters,
    instanceFetch = null,
    isDecompress = false,
  }: {
    endpoint: string,
    objParameters?: TRequest,
    instanceFetch?: any,
    isDecompress?: boolean,
  }
): Promise < TResponse >
{
  (instanceFetch ??= fetch)

  // ╭─────
  // │ NOTE:
  // │ |: Remove (1) all spaces and (2) newlines from endpoint url string.
  // ╰─────
  endpoint = tryCatch(() => { return endpoint.replaceAll(' ', '') }) as string;
  endpoint = tryCatch(() => { return endpoint.replaceAll('\n', '') }) as string;

  if (objParameters)
    endpoint += `?${injectRequestParams(objParameters)}`;
  ;

  return await tryCatchAsync
  (
    async (
    ): Promise < TResponse > =>
    {
      const
        // [🐞]
        t0 = performance.now(),
        /**
         * @description
         * 📝 Fetch data from endpoint.
         */
        objResponse: Response
          = await instanceFetch
          (
            endpoint,
            {
              method: 'GET'
            }
          )
      ;

      if (!objResponse.ok)
        throw new Error
        (
          'Network response was not ok'
        );
      ;

      let
        /**
         * @description
         * 📝 Fetch data from endpoint.
         */
        dataRes0 = await objResponse.json() as TResponse
      ;

      // ╭─────
      // │ NOTE:
      // │ |: Continued legacy support for 'success' data.
      // ╰─────
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (dataRes0?.success)
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        dataRes0 = dataRes0?.success.data;
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: Decompress data if 'isDecompress' is set to 'true'.
      // ╰─────
      if (isDecompress)
        dataRes0 = tryCatch(() => {return JSON.parse(LZString.decompress(dataRes0 as string))}) as TResponse;
      ;

      if (true)
        // [🐞]
        dlogv2
        (
          `🏹 FETCH (GET) ${endpoint}`,
          [
            JSON.stringify(dataRes0),
            `⏱️ ${ ((performance.now() - t0) / 1000).toFixed(2) } sec`,
          ],
          true
        );
      ;

      return dataRes0;
    },
    (
      ex: unknown
    ): TResponse =>
    {
      // [🐞]
      // eslint-disable-next-line no-console
      console.error(`💀 Unhandled :: ${ex}`);

      // @ts-expect-error
      return null;
    }
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Generate URL query parameters
 * @example
   * [1]─────────────────────────────────────────────────────────────────────────────
   * injectRequestParams
   * (
   *  {
   *   uid: 'xas1213dasd2321',
   *   filter: 'all'
   *  }
   * );
   * ↳ DESCRIPTION / OUTPUT :: `Returns` URL query parameters. In this case, `uid=xas1213dasd2321&filter=all`
   * [X] ─────────────────────────────────────────────────────────────────────────────
 * @param { object } objParameters
 *  URL query parameters.
 * @returns { string }
 *  📤 URL query parameters.
 */
function injectRequestParams
(
  objParameters: object
): string
{
  const
    /**
     * @description
     * 📝 URL query parameters.
     */
    listParamter: string[] = []
  ;

  // ╭─────
  // │ NOTE:
  // │ |: Loop through all object parameters.
  // ╰─────
  for (const p in objParameters)
    if (Object.prototype.hasOwnProperty.call(objParameters, p))
      listParamter.push(`${encodeURIComponent(p)}=${encodeURIComponent(objParameters[p])}`);
  ;

  return listParamter.join('&');
}
