// #region ➤ 📦 Package Imports

import LZString from 'lz-string';

import { dlogv2 } from '$lib/utils/debug.js';
import { tryCatch } from '$lib/utils/platform-functions.js';
import { tryCatchAsync, tryCatchAsyncV2 } from '@betarena/scores-lib/dist/util/util.common.js';

// #endregion ➤ 📦 Package Imports

interface IResponseError
{
  error: boolean;
  errorLogs: unknown;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📣 PROXY Fetch type GET
 * @param { string } endpoint
 *  Target `endpoint/url` to fetch data from.
 * @returns { Promise < unknown > }
 */
export async function get
<
  T1
>
(
  endpoint: string,
  _fetch: any = null,
  showTime: boolean = false,
  decompress: boolean = false,
): Promise < T1 | null | undefined | unknown >
{
  // ### NOTE:
  // ### curcanavigate CORS issues
  // endpoint = 'https://cors-anywhere.herokuapp.com/' + endpoint

  (_fetch ??= fetch)

  console.log('endpoint',endpoint)
  endpoint = tryCatch(() => {return endpoint.replaceAll(' ', '')}) as string;
  endpoint = tryCatch(() => {return endpoint.replaceAll('\n', '')}) as string;

  return await tryCatchAsync
  (
    async (
    ): Promise < unknown > =>
    {
      const
        t0: number = performance.now(),
        res: Response
          = await _fetch
          (
            endpoint,
            {
              method: 'GET'
            }
          )
      ;

      let resJson: any = await res.json();

      if (!res.ok)
      
        throw new Error
        (
          'Network response was not ok'
        );
      

      // ### NOTE: | IMPORTANT
      // ### step necessary to 'decompress' lz-string encoded payload.
      if (decompress)
        resJson = tryCatch(() => {return JSON.parse(LZString.decompress(resJson?.data))});

      // ### [🐞]
      const t1: number = performance.now();
      if (showTime)
      
        dlogv2
        (
          `🏹 FETCH (GET) ${endpoint}`,
          [
            `⏱️ ${((t1 - t0) / 1000).toFixed(2)} sec`,
            `📝 Loaded via :: ${resJson?.loadType}`,
            resJson
          ],
          true
        )
      

      return resJson;
    }
    , (
      ex: unknown
    ): void =>
    {
      // ▓ [🐞]
      // if (ex?.toString()?.includes('TypeError: null is not an object (evaluating /'signerOrProvider.call/')'))
      //   console.info('❗️', '');
      // else
      //   console.error('💀 Unhandled :: ex');

      // ▓ [🐞]
      console.error(`💀 Unhandled :: ${ex}`);

      return null;
    }
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📣 PROXY Fetch type POST
 * @param { string } path
 *  💠 Target `endpoint/url` to fetch data from.
 * @param { any } data
 *  💠 Target data to pass as `body`.
 * @returns { Promise < T1 | null | undefined | unknown > }
 *  📤 Returns an `unkown`.
 */
export async function post
<
  T1
>
(
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  , data: any
): Promise < T1 | null | undefined | unknown >
{
  return await tryCatchAsync
  (
    async (
    ): Promise < unknown > =>
    {
      const
        res: Response
          = await fetch
          (
            path
            , {
              method: 'POST',
              credentials: 'include',
              body: JSON.stringify(data),
              mode: 'cors',
              headers:
                {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                }
            }
          ),
        /**
         * @description
         *  📣
         */
        resJson: unknown = await res.json()
      ;

      if (!res.ok)
      
        throw new Error
        (
          'Network response was not ok'
        );
      

      return resJson;
    }
    , (
      ex: unknown
    ): null =>
    {
      // ▓ [🐞]
      // if (ex?.toString()?.includes('TypeError: null is not an object (evaluating /'signerOrProvider.call/')'))
      //   console.info('❗️', '');
      // else
      //   console.error('💀 Unhandled :: ex');

      // ▓ [🐞]
      console.error(`💀 Unhandled :: ${ex}`);

      return null;
    }
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📣 PROXY Fetch type POST
 * @param { string } path
 *  💠 Target `endpoint/url` to fetch data from.
 * @param { any } data
 *  💠 Target data to pass as `body`.
 * @returns { Promise < T1 | null | undefined | unknown > }
 *  📤 Returns an `unkown`.
 */
export async function postv2
<
  T1
>
(
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  , data: any
): Promise < T1 | null | undefined | unknown | IResponseError >
{
  return await tryCatchAsyncV2
  <
   T1
  >
  (
    async (
    ): Promise < T1 > =>
    {
      const
        /**
         * @description
         *  📣 Target endpoint response.
         */
        res: Response
          = await fetch
          (
            path
            , {
              method: 'POST',
              credentials: 'include',
              body: JSON.stringify(data),
              mode: 'cors',
              headers:
                {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                }
            }
          ),
        /**
         * @description
         *  📣 Target `json` resonse from `endpoint`.
         */
        resJson = await res.json()
      ;

      if (!res.ok)
      
        throw new Error
        (
          JSON.stringify(resJson) ?? 'network response was not ok'
        );
      

      return resJson;
    }
    , (
      ex: unknown
    ): IResponseError =>
    {
      // ▓ [🐞]
      console.error(`💀 Unhandled :: ${ex}`);

      return {
        error: true,
        errorLogs: ex
      };
    }
  );
}
