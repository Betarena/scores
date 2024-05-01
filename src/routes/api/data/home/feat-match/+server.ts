// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for Featured Match Data Fetch + Handle     ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
import LZString from 'lz-string';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { HFEATM_HP_ENTRY, HFEATM_HP_ENTRY_1, HFEATM_HP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.home.feat-match.js';

import type { B_FEATM_D, B_FEATM_S, B_FEATM_T } from '@betarena/scores-lib/types/types.home.feat-match.js';

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

    // ### NOTE:
    // ### gathers Featured Match Widget Main data.
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
          RedisKeys.FEATM_C_D_A,
          geoPos
        );
        if (data == undefined)
        {
          data = await new _Redis().rHGET
          (
            RedisKeys.FEATM_C_D_A,
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
      // console.log(`📌 loaded [HFEATM] with: ${loadType}`);

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
    // ### gathers Featured Match Widget Translation data.
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
          RedisKeys.FEATM_C_T_A,
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
      // console.log(`📌 loaded [HFEATM] with: ${loadType}`)

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
    // ### gathers Featured Match Widget SEO data.
    // ### NOTE:
    // ### contains [HASURA] Fallback.
    const if_M_2: boolean =
      lang != null
      && seo != null
    ;
    if (if_M_2)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      if (!hasura)
      {
        data =
          await new _Redis().rHGET
          (
            RedisKeys.FEATM_C_D_S,
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
        loadType = 'HASURA'
      }

      // ### [🐞]
      // console.log(`📌 loaded [HFEATM] [S] with: ${loadType}`)

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
 *  📌 Fallback logic for **Featured Match** Main Data.
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < B_FEATM_D > }
 */
async function fallbackMainData
(
  geoPos: string
): Promise < B_FEATM_D >
{
  const dataRes0 = await HFEATM_HP_ENTRY();

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0].get(geoPos);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Featured Match** Translation Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_FEATM_T >
{
  const dataRes0: [ Map < string, B_FEATM_T >, string[] ] = await HFEATM_HP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0].get(lang);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Featured Match** SEO Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData_2
(
  lang: string
): Promise < B_FEATM_S >
{
  const dataRes0: [ Map < string, B_FEATM_S >, string[] ] = await HFEATM_HP_ENTRY_2
  (
    [lang],
    null,
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0].get(lang);
}

// #endregion ➤ 🛠️ METHODS