// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for Top Goalscorers Data Fetch + Handle    ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import { HTGOL_HP_ENTRY, HTGOL_HP_ENTRY_1, HTGOL_HP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.home.top-goalscorers.js';
import { TGOL_C_D_A, TGOL_C_D_S, TGOL_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import dotenv from 'dotenv';
import LZString from 'lz-string';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_TGOL_D, B_TGOL_S, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';

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
    const seo: string =	req?.url?.searchParams?.get('seo');
    const geoPos: string = req?.url?.searchParams?.get('geoPos');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    let data: unknown;
    let loadType: string = "⚡️ Redis (cache)";

    // ### NOTE:
    // ### gathers Top Goalscorers widget main data.
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
          TGOL_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await get_target_hset_cache_data
          (
            TGOL_C_D_A,
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
      // console.log(`📌 loaded [HTOPG] with: ${loadType}`);

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ### [🐞]
        // console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType: loadType
          }
        );
      }
    }

    // ### NOTE:
    // ### gathers Top Goalscorers widget main data.
    // ### NOTE:
    // ### contains 🟦 Hasura (PostgreSQL) fallback.
    const if_M_1: boolean =
      lang != undefined
      && seo == undefined
    ;
    if (if_M_1)
    {
      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          TGOL_C_T_A,
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
      // console.log(`📌 loaded [HTOPG] with: ${loadType}`);

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ### [🐞]
        // console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType: loadType
          }
        );
      }
    }

    // ### NOTE:
    // ### gathers Top Goalscorers Widget SEO data.
    // ### NOTE:
    // ### contains 🟦 Hasura (PostgreSQL) fallback.
    const if_M_2: boolean =
      lang != undefined
      && seo != undefined
    ;
    if (if_M_2)
    {
      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data =
          await get_target_hset_cache_data
          (
            TGOL_C_D_S,
            lang
          )
        ;
      }

      // ### CHECK | IMPORTANT
      // ### for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData_2
        (
          lang
        )
        loadType = '🟦 Hasura (SQL)';
      }

      // ### [🐞]
      // console.log(`📌 loaded [HTOPG] [S] with: ${loadType}`);

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ### [🐞]
        // console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType: loadType
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
 *  📌 Fallback logic for **Top Goalscorers** Main Data.
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < B_TGOL_D > }
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_TGOL_D >
{
  const dataRes0: [ Map < string, B_TGOL_D >, string[] ] = await HTGOL_HP_ENTRY
  (
    null
  );

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
 *  📌 Fallback logic for **Top Goalscorers** Translation Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_TGOL_T > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_TGOL_T >
{
  const dataRes0: [ Map < string, B_TGOL_T >, string[] ] = await HTGOL_HP_ENTRY_1
  (
    null,
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
 *  📌 Fallback logic for **Top Goalscorers** SEO Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData_2
(
  lang: string
): Promise < B_TGOL_S >
{
  const dataRes0: [ Map < string, B_TGOL_S >, string[] ] = await HTGOL_HP_ENTRY_2
  (
    null,
    [lang],
    null
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0]?.get(lang);
}

// #endregion ➤ 🛠️ METHODS