// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for Leagues Table Data Fetch + Handle      ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import { HLEGT_HP_ENTRY, HLEGT_HP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.home.leagues-table.js';
import { LEGT_C_D_A, LEGT_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import dotenv from 'dotenv';
import LZString from 'lz-string';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_LEGT_D, B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';

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
    // ### NOTE:
    // ### handle url-query data
    const lang: string = req?.url?.searchParams?.get('lang');
    const geoPos: string = req?.url?.searchParams?.get('geoPos');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    let data: unknown;
    let loadType: string = "⚡️ Redis (cache)";

    // ### NOTE:
    // ### gathers Leagues Table widget main data.
    // ### NOTE:
    // ### contains 🟦 Hasura (PostgreSQL) fallback.
    const if_M_0: boolean =
      geoPos != undefined
    ;
    if (if_M_0)
    {
      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          LEGT_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            LEGT_C_D_A,
            'en'
          );
        }
      }

      // ### CHECK | IMPORTANT
      // ### for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData
        (
          geoPos
        );
        loadType = '🟦 Hasura (SQL)';
      }

      // ### [🐞]
      // console.log(`🏹 loaded [FPROB] with: ${loadType}`);

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ### [🐞]
        // console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType
          }
        );
      }
    }

    // ### NOTE:
    // ### gathers Leagues Table widget main data.
    // ### NOTE:
    // ### contains 🟦 Hasura (PostgreSQL) fallback.
    const if_M_1: boolean =
      lang != undefined
    ;
    if (if_M_1)
    {
      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          LEGT_C_T_A,
          lang
        );
      }

      // ### CHECK | IMPORTANT
      // ### for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData_1
        (
          lang
        );
        loadType = '🟦 Hasura (SQL)';
      }

      // ### [🐞]
      // console.log(`📌 loaded [FPROB] with: ${loadType}`);

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ### [🐞]
        // console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType
          }
        );
      }
    }

    // ### IMPORTANT
    return json
    (
      null
    );
  }
  catch (ex)
  {
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

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// METHOD(s)                                    ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **League Table** Main Data.
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < B_LEGT_D > }
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_LEGT_D >
{
  const dataRes0: [ Map < string, B_LEGT_D >, string[] ] = await HLEGT_HP_ENTRY();

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(geoPos);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **League Table** Translation Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_LEGT_T > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_LEGT_T >
{
  const dataRes0: [ Map < string, B_LEGT_T > , string[] ] = await HLEGT_HP_ENTRY_1
  (
    [ lang ]
  );

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(lang);
}

// #endregion ➤ 🛠️ METHODS