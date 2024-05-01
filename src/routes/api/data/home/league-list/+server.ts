// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for League List Data Fetch + Handle        ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
import LZString from 'lz-string';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { HLL_HP_ENTRY, HLL_HP_ENTRY_1, HLL_HP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.home.league-list.js';

import type { B_LEGL_D, B_LEGL_S, B_LEGL_T } from '@betarena/scores-lib/types/types.home.league-list.js';

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
    const seo: string = req?.url?.searchParams?.get('seo');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ### NOTE:
    // ### gathers League List Widget Main data.
    // ### NOTE:
    // ### contains [HASURA] Fallback.
    const if_M_0: boolean =
      geoPos != null
    ;
    if (if_M_0)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await new _Redis().rHGET
        (
          RedisKeys.LEGL_C_D_A_V3,
          geoPos
        );
        if (data == undefined)
        {
          data = await new _Redis().rHGET
          (
            RedisKeys.LEGL_C_D_A_V3,
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
        loadType = 'HASURA'
      }

      // ### [🐞]
      // console.log(`📌 loaded [LL] with: ${loadType}`)

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
      };
    }

    // ### NOTE:
    // ### gathers League List Widget Translation data.
    // ### NOTE:
    // ### contains [HASURA] Fallback.
    const if_M_1: boolean =
      lang != null
      && seo == null
    ;
    if (if_M_1)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await new _Redis().rHGET
        (
          RedisKeys.LEGL_C_T_A_V3,
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
        loadType = 'HASURA'
      }

      // ### [🐞]
      // console.log(`📌 loaded [LL] with: ${loadType}`)

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
      };
    }

    // ### NOTE:
    // ### gathers League List Widget SEO data.
    // ### NOTE:
    // ### contains [HASURA] Fallback.
    const if_M_2: boolean =
      seo != null
      && lang != null
    ;
    if (if_M_2)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await new _Redis().rHGET
        (
          RedisKeys.LEGL_C_S_A_V3,
          lang
        );
      }

      // ### CHECK | IMPORTANT
      // ### for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData_3
        (
          lang
        );
        loadType = 'HASURA'
      }

      // ### [🐞]
      // console.log(`📌 loaded [LL] with: ${loadType}`)

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
 *  📌 Fallback logic for **League List** Main Data.
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_LEGL_D >
{
  const dataRes0: [ Map < string, B_LEGL_D >, string[] ] = await HLL_HP_ENTRY();

  if (dataRes0?.[0]?.size == 0)
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
 *  📌 Fallback logic for **League List** Translation Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_LEGL_T >
{
  const dataRes0: [ Map < string, B_LEGL_T >, string[] ] = await HLL_HP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(lang);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **League List** SEO Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData_3
(
  lang: string
): Promise < B_LEGL_S >
{
  const dataRes0: [ Map < string, B_LEGL_S >, string[] ] = await HLL_HP_ENTRY_2
  (
    [lang],
    null
  );

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(lang);
}

// #endregion ➤ 🛠️ METHODS