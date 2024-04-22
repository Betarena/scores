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
import { HLV2_HP_ENTRY, HLV2_HP_ENTRY_2, HLV2_HP_ENTRY_3 } from '@betarena/scores-lib/dist/functions/func.home.livescores-v2.js';

import type { B_LS2_D, B_LS2_T, LS2_C_Fixture } from '@betarena/scores-lib/types/livescores-v2.js';

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

  // ### NOTE:
  // ### handle url-query data
	const lang: string = req?.url?.searchParams?.get('lang');
  const seo: string =	req?.url?.searchParams?.get('seo');
	const date: string = req?.url?.searchParams?.get('date');
	const fixtureIds: string = req?.url?.searchParams?.get('fixtureIds');
  const hasura: string = req?.url?.searchParams?.get('hasura');

  // ### NOTE:
  // ### gathers Livescores-V2 Widget Main data.
  // ### NOTE:
  // ### contains [HASURA] Fallback.
  const if_M_0: boolean =
    !lang
    && !seo
    && !fixtureIds
  ;
  if (if_M_0)
  {
    let data: unknown;
    let loadType = "cache";

    // ### CHECK | IMPORTANT
    // ### for existance in cache.
    if (!hasura)
    {
      data = await new _Redis().rGET
      (
        RedisKeys.LS2_C_D_A
      );
    }

    // ### CHECK | IMPORTANT
    // ### for default in Hasura.
		if (!data || hasura)
    {
      data = await fallbackMainData
      (
        date
      );
      loadType = 'HASURA';
		}

    // ### [🐞]
    console.log(`📌 loaded [HLSV2] [D] with: ${loadType}`)

    if (data != null)
    {
      const compressed: string = LZString.compress(JSON.stringify(data));

      // ### [🐞]
      // console.log(JSON.parse(LZString.decompress(compressed)));

      return json
      (
        {
          data: compressed,
          loadType: 'HASURA'
        }
      );
    };
  }

  // ### NOTE:
  // ### gathers Livescores-V2 Widget Translation data.
  // ### NOTE:
  // ### contains [HASURA] Fallback.
  const if_M_1 =
    !lang
    && !seo
    && fixtureIds
  ;
  if (if_M_1)
  {
    const data = await fallbackMainData_2
    (
      fixtureIds
    );

    // ### [🐞]
    // console.log(`📌 loaded [HLSV2] [DT] with: HASURA`)

    if (data != null)
    {
      const compressed: string = LZString.compress(JSON.stringify(data));

      // ### [🐞]
      // console.log(JSON.parse(LZString.decompress(compressed)));

      return json
      (
        {
          data: compressed,
          loadType: 'HASURA'
        }
      );
    };
  }

  // ### NOTE:
  // ### gathers Livescores-V2 Widget Translation data.
  // ### NOTE:
  // ### contains [HASURA] Fallback.
  const if_M_2: boolean =
    lang
    && !seo
  ;
  if (if_M_2)
  {
    let data: unknown;
    let loadType = "cache";

    // ### CHECK | IMPORTANT
    // ### for existance in cache.
    if (!hasura)
    {
      data = await new _Redis().rHGET
      (
        RedisKeys.LS2_C_T_A,
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
      loadType = 'HASURA';
		}

    // ### [🐞]
    // console.log(`📌 loaded [HLSV2] [T] with: ${loadType}`)

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
  // ### gathers Livescores-V2 Widget SEO data.
  // ### NOTE:
  // ### contains [HASURA] Fallback.
  const if_M_3: boolean =
    lang != null
    && seo != null
  ;
  if (if_M_3)
  {
    let data: unknown;
    let loadType = "cache";

    // ### CHECK | IMPORTANT
    // ### for existance in cache.
    if (!hasura)
    {
      data = await new _Redis().rHGET
      (
        RedisKeys.LS2_C_S_A,
        lang
      );
    }

    // ### CHECK | IMPORTANT
    // ### for default in Hasura.
		if (!data || hasura)
    {
      // data = await fallbackMainData
      // (
      //   _player_id
      // )
      loadType = 'HASURA';
		}

    // ### [🐞]
    // console.log(`📌 loaded [HLSV2] [S] with: ${loadType}`)

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

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// METHOD(s)                                    ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Livescores V2** Main Data.
 * @todo
 *  TODO: offset map-gen. to scores-lib.
 * @param { string } targetDateIso
 *  Target `Date` of `ISO` format.
 * @returns { Promise < B_PSTAT_D > }
 */
async function fallbackMainData
(
  targetDateIso: string
): Promise < B_LS2_D >
{

  const dataRes = await HLV2_HP_ENTRY
  (
    targetDateIso
  );

  delete dataRes?.[0]?.leagues_feat_list;
  delete dataRes?.[0]?.leagues_geo_list;

	return dataRes?.[0];
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Livescores V2** Translation Data.
 * @version 1.0 - past versions: []
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_LS2_T > }
 */
async function fallbackMainData_1
(
  lang: string
): Promise < B_LS2_T >
{

  const dataRes0 = await HLV2_HP_ENTRY_2
  (
    [lang]
  );

	return dataRes0?.[0]?.get(lang);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **Livescores V2** Complementary Data.
 * @version 1.0 - past versions: []
 * @param { string } fixtureIds
 * @returns Promise < B_PSTAT_T >
 */
async function fallbackMainData_2
(
  fixtureIds: string
): Promise < { [k: string]: LS2_C_Fixture } >
{

  const fixtureIdsList = fixtureIds
  ?.split
  (
    ','
  )
  ?.map
  (
    x =>
    parseInt
    (
      x
    )
  );

  // ### [🐞]
  // console.log('fixtureIdsList', fixtureIdsList)

  const dataRes0 = await HLV2_HP_ENTRY_3
  (
    fixtureIdsList
  );

	return Object.fromEntries(dataRes0?.[0]);
}

// #endregion ➤ 🛠️ METHODS