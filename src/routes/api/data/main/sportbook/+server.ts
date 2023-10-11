// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for Sportbook Data Fetch + Handle          ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import { LSPT_L_ENTRY } from '@betarena/scores-lib/dist/functions/func.main.sportbook.js';
import { SPD_C_D_A, SPD_C_D_A1 } from '@betarena/scores-lib/dist/redis/config.js';
import dotenv from 'dotenv';
import LZString from 'lz-string';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

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
    const geoPos: string = req?.url?.searchParams?.get('geoPos');
    const all: string =	req?.url?.searchParams?.get('all');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    let data: unknown;
    let loadType: string = "⚡️ Redis (cache)";

    // ### NOTE:
    // ### gathers Sportbook (Main) widget main data.
    // ### NOTE:
    // ### contains 🟦 Hasura (PostgreSQL) fallback.
    const if_M_0: boolean =
      all != null
      && geoPos != null
    ;
    if (if_M_0)
    {
      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          SPD_C_D_A1,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            SPD_C_D_A1,
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

    // ### NOTE:
    // ### gathers Sportbook (All) widget main data.
    // ### NOTE:
    // ### contains 🟦 Hasura (PostgreSQL) fallback.
    const if_M_1: boolean =
      all == null
      && geoPos != null
    ;
    if (if_M_1)
    {
      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          SPD_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            SPD_C_D_A,
            'en'
          );
        }
      }

      // ### CHECK | IMPORTANT
      // ### for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData_1
        (
          geoPos
        );
        loadType = '🟦 Hasura (SQL)';
      }

      // ### [🐞]
      // console.log(`📌 loaded [FPROB] with: ${loadType}`)

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
 *  📌 Fallback logic for **Sportbook** Main Data.
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < B_FEATB_T > }
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_SPT_D[] >
{
  const dataRes0: [ Map < string, B_SPT_D >, Map < string, B_SPT_D[] >, string[] ] = await LSPT_L_ENTRY
  (
    null
  );

  if (dataRes0?.[1]?.size == 0)
    return null;
  ;

	return dataRes0?.[1]?.get(geoPos);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Sportbook** Main (all) Data.
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < B_FEATB_T > }
 */
async function fallbackMainData_1
(
  geoPos: string
): Promise < B_SPT_D >
{
  const dataRes0: [ Map < string, B_SPT_D >, Map < string, B_SPT_D[] >, string[] ] = await LSPT_L_ENTRY
  (
    null
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(geoPos);
}

// #endregion ➤ 🛠️ METHODS