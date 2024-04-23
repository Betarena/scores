// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for UserGuide Data Fetch + Handle          ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

import { USRG_M_ENTRY } from '@betarena/scores-lib/dist/functions/func.misc.userguide.js';

import type { B_USRG_D } from '@betarena/scores-lib/types/types.misc.userguide.js';

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
    const userguideId: string = req?.url?.searchParams?.get('userguideId');
    const lang: string = req?.url?.searchParams?.get('lang');
    const hasura: string = req?.url?.searchParams?.get('hasura');

    // ### NOTE:
    // ### gathers League List Widget SEO data.
    // ### NOTE:
    // ### contains [HASURA] Fallback.
    const if_M_0: boolean =
      userguideId != null
      && lang != null
    ;
    if (if_M_0)
    {
      let data: unknown;
      let loadType: string = "cache";

      // ### CHECK | IMPORTANT
      // ### for existance in cache.
      // if (!hasura)
      // {
      //   data = await get_target_hset_cache_data
      //   (
      //     LEGL_C_T_A_V3,
      //     lang
      //   );
      // }

      // ### CHECK | IMPORTANT
      // ### for default in Hasura.
      if (!data || hasura)
      {
        data = await fallbackMainData_0
        (
          parseInt(userguideId),
          lang
        );
        loadType = 'HASURA'
      }

      // ### [🐞]
      console.log(`📌 loaded [FPROB] with: ${loadType}`)

      if (data != null)
        return json(data);
      ;
    }

    // ### IMPORTANT
    return json
    (
      {}
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
 *  📌 Fallback logic for **User-Guide** Data.
 * @param { string } lang
 *  Target `language`.
 * @returns { Promise < B_FEATM_T > }
 */
async function fallbackMainData_0
(
  userguideId: number,
  lang: string,
): Promise < B_USRG_D >
{
  const dataRes0: [ Map < string, B_USRG_D >, string[] ] = await USRG_M_ENTRY();

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

  const key = `${userguideId}_${lang}`;

	return dataRes0?.[0]?.get(key);
}

// #endregion ➤ 🛠️ METHODS