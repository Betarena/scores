// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for Featured Match Data Fetch + Handle     ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import dotenv from 'dotenv';
import LZString from 'lz-string';

import { get } from '$lib/api/utils.js';
import { checkNull } from '$lib/utils/miscellenous.js';

import type { ICoinMarketCapDataMain } from '@betarena/scores-lib/types/_WEB3_.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

dotenv.config();

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ENDPOINT ENTRY                               ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

export async function GET
(
  req: any
): Promise < unknown >
{
  try
  {
    // ▓ NOTE:
    // ▓ > extract request data.
    const tickers: string = req?.url?.searchParams?.get('tickers');

    // ▓ NOTE:
    // ▓ > obtain target ticker/symbol data.
    const if_M_0: boolean =
      !checkNull(tickers)
    ;
    if (if_M_0)
    {
      console.log('HERE');

      let data: unknown;
      let loadType: string = "endpoint";

      const cryptoPrices = await get
      (
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDT,USDC&CMC_PRO_API_KEY=e30a9340-0e5a-401f-8cc1-4f8c08da6466'
      ) as ICoinMarketCapDataMain;

      if (cryptoPrices != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(cryptoPrices));

        // ▓ [🐞]
        // console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType
          }
        );
      };
    }

    // ### IMPORTANT
    return json
    (
      null
    );
  }
  catch (ex)
  {
    // ▓ [🐞]
    console.error
    (
      '❌ Err: ',
      ex
    );
    return json
    (
      null,
      {
        status: 400,
        statusText: 'Uh-oh! There has been an error'
      }
    );
  }
}

// #endregion ➤ 🛠️ METHODS