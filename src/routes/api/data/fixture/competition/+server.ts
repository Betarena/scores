// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ 📝 DESCRIPTION                                                        ▓▓
// ▓▓ Application Server Endpoint for Competiton Data Fetch + Handle        ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import { FIXCOMP_HP_ENTRY, FIXCOMP_HP_ENTRY_1 } from '@betarena/scores-lib/dist/functions/func.fixture.competition.js';
import { FEATM_C_T_A } from '@betarena/scores-lib/dist/redis/config.js';
import dotenv from 'dotenv';
import LZString from 'lz-string';
import { get_target_hset_cache_data } from '../../../../../lib/redis/std_main';

import type { B_FIX_COMP_D, B_FIX_COMP_TS } from '@betarena/scores-lib/types/types.fixture.competition.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

dotenv.config();

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ ENDPOINT ENTRY                              ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

export async function GET
(
  req: any
): Promise < unknown >
{
  try
  {
    // ▓▓ NOTE:
    // ▓▓ handle url-query data
    const lang: string = req?.url?.searchParams?.get('lang');
    const fixtureId: string = req?.url?.searchParams?.get('fixtureId');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ▓▓ NOTE:
    // ▓▓ gathers Featured Match Widget Main data.
    // ▓▓ NOTE:
    // ▓▓ contains [HASURA] Fallback.
    const if_M_0: boolean =
      fixtureId != null
    ;
    if (if_M_0)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ▓▓ CHECK | IMPORTANT
      // ▓▓ for existance in cache.
      // if (!hasura)
      // {
      //   data = await get_target_hset_cache_data
      //   (
      //     FEATM_C_D_A,
      //     geoPos
      //   );
      // }

      // ▓▓ CHECK | IMPORTANT
      // ▓▓ for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData
        (
          fixtureId
        );
        loadType = 'HASURA'
      }

      // ▓▓ [🐞]
      // console.log(`📌 loaded [HFEATM] with: ${loadType}`);

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ▓▓ [🐞]
        console.log(JSON.parse(LZString.decompress(compressed)));

        return json
        (
          {
            data: compressed,
            loadType
          }
        );
      };
    }

    // ▓▓ NOTE:
    // ▓▓ gathers Featured Match Widget Translation data.
    // ▓▓ [+] contains [HASURA] Fallback.
    const if_M_1: boolean =
      lang != null
    ;
    if (if_M_1)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ▓▓ CHECK | IMPORTANT
      // ▓▓ for existance in cache.
      if (!hasura)
      {
        data = await get_target_hset_cache_data
        (
          FEATM_C_T_A,
          lang
        );
      }

      // ▓▓ CHECK | IMPORTANT
      // ▓▓ for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData_1
        (
          lang
        );
        loadType = 'HASURA'
      }

      // ▓▓ [🐞]
      // console.log(`📌 loaded [HFEATM] with: ${loadType}`)

      if (data != null)
      {
        const compressed: string = LZString.compress(JSON.stringify(data));

        // ▓▓ [🐞]
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

    // ▓▓ IMPORTANT
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

// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ METHOD(s)                                   ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Competition** Main Data.
 * @param { string } fixtureId
 *  Target `fixtureId`.
 * @returns { Promise < B_FIX_COMP_D > }
 */
async function fallbackMainData
(
  fixtureId: string
): Promise < B_FIX_COMP_D >
{
  const dataRes0: [ Map < number, B_FIX_COMP_D >, string[] ] = await FIXCOMP_HP_ENTRY
  (
    parseInt(fixtureId)
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0].get(parseInt(fixtureId));
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Competition** Translation Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FIX_COMP_TS > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_FIX_COMP_TS >
{
  const dataRes0: [ Map < string, B_FIX_COMP_TS >, string[] ] = await FIXCOMP_HP_ENTRY_1
  (
    [lang]
  );

  if (dataRes0?.[0].size == 0)
    return null;
  ;

	return dataRes0?.[0].get(lang);
}

// #endregion ➤ 🛠️ METHODS