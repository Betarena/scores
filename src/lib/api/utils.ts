// #region ➤ 📦 Package Imports

import { dlogv2 } from '$lib/utils/debug.js';
import LZString from 'lz-string';

// #endregion ➤ 📦 Package Imports

/**
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 PROXY Fetch type GET
 * @param { string } endpoint
 *  Target endpoint / url to fetch data from.
 * @returns { Promise < unknown > }
 */
export async function get
(
	endpoint: string,
  _fetch: any = null,
  showTime: boolean = false,
  decompress: boolean = false,
): Promise < unknown >
{
	// ### NOTE:
  // ### curcanavigate CORS issues
	// endpoint = 'https://cors-anywhere.herokuapp.com/' + endpoint

  (_fetch ??= fetch)

  try
  {
    // ### [🐞]
    const t0: number = performance.now();

    const res: Response = await _fetch
    (
      endpoint,
      {
        method: 'GET'
      }
    );

    const resJson: any = await res.json();

    if (!res?.ok)
      throw new Error
      (
        'Network response was not ok'
      );
    ;

    // ### [🐞]
    const t1: number = performance.now();
    if (showTime)
    {
      dlogv2
      (
        `🏹 FETCH (GET) ${endpoint}`,
        [
          `⏱️ ${((t1 - t0) / 1000).toFixed(2)} sec`,
          `📝 Loaded via :: ${resJson?.loadType}`
        ],
        true
      )
    };

    // ### NOTE: | IMPORTANT
    // ### step necessary to 'decompress' lz-string encoded payload.
    if (decompress)
      return JSON.parse(LZString.decompress(resJson?.data));
    ;

		return resJson;
  }
  catch (e)
  {
    console.error(e)
    return null;
  }
}

/**
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 PROXY Fetch type POST
 * @param { string } path
 *  Target endpoint / url to fetch data from.
 * @param { any } data
 *  Target data to pass as `body`.
 * @returns { Promise < unknown > }
 */
export async function post
(
	path: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
): Promise < unknown >
{
  try
  {
    const res: Response = await fetch
    (
      path,
      {
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
    );

    const resJson: unknown = await res.json();

    if (!res?.ok)
      throw new Error
      (
        'Network response was not ok'
      );
    ;

		return resJson;
  }
  catch (e)
  {
    console.error(e)
    return null;
  }
}
