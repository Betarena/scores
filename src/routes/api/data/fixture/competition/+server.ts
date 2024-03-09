// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ 📝 DESCRIPTION                                                        ▓▓
// ▓▓ Application Server Endpoint for Competiton Data Fetch + Handle        ▓▓
// ▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';

import { checkNull } from '$lib/utils/miscellenous.js';
import { FIXCOMP_HP_ENTRY, FIXCOMP_HP_ENTRY_1, FIXCOMP_HP_ENTRY_2 } from '@betarena/scores-lib/dist/functions/func.fixture.competition.js';
import dotenv from 'dotenv';
import LZString from 'lz-string';

import type { B_FIX_COMP_D, B_FIX_COMP_S, B_FIX_COMP_T } from '@betarena/scores-lib/types/types.fixture.competition.js';

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
    const seo: string = req?.url?.searchParams?.get('seo');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    let data: unknown;
    let loadType: string = "cache";

    // ▓▓ NOTE:
    // ▓▓ gathers Featured Match Widget Main data.
    // ▓▓ NOTE:
    // ▓▓ contains [HASURA] Fallback.
    const if_M_0: boolean =
      checkNull(lang)
      && checkNull(seo)
      && !checkNull(fixtureId)
    ;
    if (if_M_0)
    {
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
      !checkNull(lang)
      && checkNull(seo)
    ;
    if (if_M_1)
    {
      // ▓▓ CHECK | IMPORTANT
      // ▓▓ for existance in cache.
      // if (!hasura)
      // {
      //   data = await get_target_hset_cache_data
      //   (
      //     FEATM_C_T_A,
      //     lang
      //   );
      // }

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

    // ▓▓ CHECK
    // ▓▓ for target data competition - highlights (widget) SEO DATA.
    // ▓▓ NOTE:
    // ▓▓ cache & hasura (fallback) solution.
    const if_M_3: boolean =
      !checkNull(lang)
      && !checkNull(seo)
      && !checkNull(fixtureId)
    ;
    if (if_M_3)
    {
      const _fixtureId = parseInt(fixtureId)

      const data: B_FIX_COMP_S =	await fallbackMainData_2
      (
        lang
        , _fixtureId
      );

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
 * @returns { Promise < B_FIX_COMP_T > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_FIX_COMP_T >
{
  const dataRes0: [ Map < string, B_FIX_COMP_T >, string[] ] = await FIXCOMP_HP_ENTRY_1
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
 *  📌 Fallback logic for **Competition** SEO Data.
 * @param { string } lang
 *  Target SEO language to retrieve data for.
 * @returns { Promise < B_FIX_COMP_S > }
 */
async function fallbackMainData_2
(
  lang: string
  , fixtureId: number
): Promise < B_FIX_COMP_S >
{
  const dataRes0: [ Map < string, B_FIX_COMP_S >, string[] ] = await FIXCOMP_HP_ENTRY_2
  (
    [lang]
    , null
    , fixtureId
  );

  if (dataRes0?.[0]?.size == 0) return null;

  const key = `${lang}_${fixtureId}`;

	return dataRes0?.[0]?.get(key);
}

// #endregion ➤ 🛠️ METHODS