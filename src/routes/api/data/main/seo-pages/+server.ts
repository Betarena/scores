// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Application Server Endpoint for Platform SEO / Valid Links             ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
import LZString from 'lz-string';

import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';
import { entryPageDataCompetition, entryPageDataFixture, entryPageDataPlayer } from '@betarena/scores-lib/dist/functions/v8/main.preload.scores.js';

import { checkNull } from '$lib/utils/miscellenous.js';

import type { B_SAP_CTP_D, B_SAP_FP_D, B_SAP_PP_D } from '@betarena/scores-lib/types/v8/preload.scores.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

type PAGE_TYPE =
  | 'homepage'
  | 'tournaments'
  | 'fixtures'
  | 'player'
  | 'competitions'
  | 'competition'
  | 'author_article'
  | `author_tag`
  ;

dotenv.config();

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ENDPOINT ENTRY                               ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET
  (
    req: any
  ): Promise<unknown>
{
  // ### IMPORTANT
  // ### required for target URL validity check.
  const langUrl: string = req?.url?.searchParams?.get('langUrl');
  const sportUrl: string = req?.url?.searchParams?.get('sportUrl');
  const countryUrl: string = req?.url?.searchParams?.get('countryUrl');
  const leagueUrl: string = req?.url?.searchParams?.get('leagueUrl');
  const fixtureUrl: string = req?.url?.searchParams?.get('fixtureUrl');
  const playerUrl: string = req?.url?.searchParams?.get('playerUrl');
  const competitionMainUrl: string = req?.url?.searchParams?.get('competitionMainUrl');
  const competitionUrl: string = req?.url?.searchParams?.get('competitionUrl');
  const authorArticleUrl: string = req?.url?.searchParams?.get('authorArticleUrl');
  const authorTagUrl: string = req?.url?.searchParams?.get('authorTagUrl');
  const authorUrl: string = req?.url?.searchParams?.get('authorUrl');

  // ### IMPORTANT
  // ### required for target SEO & Page data.
  const url: string = req?.url?.searchParams?.get('url');
  const lang: string = req?.url?.searchParams?.get('lang');
  const page: PAGE_TYPE = req?.url?.searchParams?.get('page') as PAGE_TYPE;
  const country_id: string = req?.url?.searchParams?.get('country_id');
  const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
  const player_id: string = req?.url?.searchParams?.get('player_id');
  const competition_id: string = req?.url?.searchParams?.get('competition_id');
  const term: string = req?.url?.searchParams?.get('term');
  const months: string = req?.url?.searchParams?.get('months');
  const countries: string = req?.url?.searchParams?.get('countries');
  const hasura: string = req?.url?.searchParams?.get('hasura');

  let data: unknown;
  let loadType: string = "⚡️ Redis (cache)";

  // ### TODO:
  // ### add (hasura/postgresql) fallback for all METHODS below;
  // ### TODO:
  // ### add player (page) sections into the mix of METHODS below;

  // ### CHECK
  // ### for target URL validity.
  // ### NOTE:
  // ### cache solution only.
  const if_M_0: boolean =
    !checkNull(langUrl)
    || !checkNull(sportUrl)
    || !checkNull(countryUrl)
    || !checkNull(leagueUrl)
    || !checkNull(fixtureUrl)
    || !checkNull(playerUrl)
    || !checkNull(competitionMainUrl)
    || !checkNull(competitionUrl)
    || !checkNull(authorArticleUrl)
    || !checkNull(authorTagUrl)
    || !checkNull(authorUrl)

    ;
  if (if_M_0)
  {
    return await validUrlCheck
      (
        langUrl,
        sportUrl,
        countryUrl,
        leagueUrl,
        fixtureUrl,
        playerUrl,
        competitionMainUrl,
        competitionUrl,
        authorArticleUrl,
        authorTagUrl,
        authorUrl
      );
  }

  // ### CHECK
  // ### for target data retrieve of page (home) MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_1: boolean =
    lang
    && page === 'homepage'
    ;
  if (if_M_1)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A1,
        lang
      );

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

  // ### CHECK
  // ### for target data retrieve of page (tournament) MAIN DATA.
  // ### NOTE:
  // ### cache solution only.
  const if_M_2: boolean =
    url
    && page === 'tournaments'
    ;
  if (if_M_2)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A3,
        url
      );

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

  // ### CHECK
  // ### for target data retrieve of page (tournament) MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_3: boolean =
    lang
    && page === 'tournaments'
    ;
  if (if_M_3)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A2,
        lang
      );

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

  // ### CHECK
  // ### for target data retrieve of page (fixture) MAIN DATA.
  // ### NOTE:
  // ### cache & hasura (fallback) solution.
  const if_M_4: boolean =
    fixture_id
    && page === 'fixtures'
    ;
  if (if_M_4)
  {
    const _fixture_id: number = parseInt(fixture_id)

    // ### CHECK | IMPORTANT
    // ### for existance in cache.
    if (!hasura)
    {
      data = await new _Redis().rHGET
        (
          RedisKeys.SAP_C_D_A5,
          fixture_id
        );
    }

    // ### CHECK | IMPORTANT
    // ### for default in Hasura.
    if (!data || hasura)
    {
      data = await fallbackMainData_2
        (
          _fixture_id
        );
      loadType = '🟦 Hasura (SQL)';
    }

    // ### [🐞]
    // console.log(`📌 loaded [PFIX] with: ${loadType}`);

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

  // ### CHECK
  // ### for target data retrieve of page (fixture) MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_5: boolean =
    lang
    && page === 'fixtures'
    ;
  if (if_M_5)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A4,
        lang
      );

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

  // ### CHECK
  // ### for target data retrieve of page (player) MAIN DATA.
  // ### NOTE:
  // ### cache & hasura (fallback) solution.
  const if_M_6: boolean =
    player_id
    && page === 'player'
    ;
  if (if_M_6)
  {
    const _player_id: number = parseInt(player_id)

    // ### CHECK | IMPORTANT
    // ### for existance in cache.
    if (!hasura)
    {
      data = await new _Redis().rHGET
        (
          RedisKeys.SAP_C_D_A16,
          player_id
        );
    }

    // ### CHECK | IMPORTANT
    // ### for default in Hasura.
    if (!data || hasura)
    {
      data = await fallbackMainData_0
        (
          _player_id
        );
      loadType = '🟦 Hasura (SQL)';
    }

    // ### [🐞]
    // console.log(`📌 loaded [PPLAY] with: ${loadType}`)

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

  // ### CHECK
  // ### for target data retrieve of page (player) MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_7: boolean =
    lang
    && page === 'player'
    ;
  if (if_M_7)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A15,
        lang
      );

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

  // ### CHECK
  // ### for target page retrieve of competitions (lobby) - MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_8: boolean =
    lang
    && page === 'competitions'
    ;
  if (if_M_8)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A18,
        lang
      );

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

  // ### CHECK
  // ### for target page retrieve of target competition (single) - MAIN DATA.
  // ### NOTE:
  // ### cache & hasura (fallback) solution.
  const if_M_9: boolean =
    competition_id
    && page === 'competition'
    ;
  if (if_M_9)
  {
    const _competition_id: number = parseInt(competition_id)

    // ### CHECK | IMPORTANT
    // ### for existance in cache.
    // if (!hasura)
    // {
    //   data = await new _Redis().rHGET
    //   (
    //     RedisKeys.SAP_C_D_A16,
    //     player_id
    //   );
    // }

    // ### CHECK | IMPORTANT
    // ### for default in Hasura.
    if (!data || hasura)
    {
      data = await fallbackMainData_3
        (
          _competition_id
        );
      loadType = '🟦 Hasura (SQL)';
    }

    // ### [🐞]
    // console.log(`📌 ${logTag} w/ ${loadType}`)

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

  // ### CHECK
  // ### for target page retrieve of target competitions (single) - MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_10: boolean =
    lang
    && page === 'competition'
    ;
  if (if_M_10)
  {
    const data: unknown = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A20,
        lang
      );

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

  // ### CHECK
  // ### for target data retrieve of page (country) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
  if (country_id)
  {
    const data: unknown = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A7,
        country_id
      );

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

  // ### CHECK
  // ### for target data retrieve of page (country) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
  if (countries)
  {
    const data: unknown = await new _Redis().rHGETALL
      (
        RedisKeys.SAP_C_D_A7
      );

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

  // ### CHECK
  // ### for target data retrieve of page (terms) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
  if (term)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A6,
        term
      );

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

  // ### CHECK
  // ### for target data retrieve of page (months) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
  if (months && lang)
  {
    data = await new _Redis().rHGET
      (
        RedisKeys.SAP_C_D_A8,
        lang
      );

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

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// METHOD(s)                                    ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Validates for target `URL` validity.
 * @param { stiring } langUrl
 *  Target `language` value.
 * @param { stiring } sportUrl
 *  Target `sport` value.
 * @param { stiring } countryUrl
 *  Target `country` value.
 * @param { stiring } leagueUrl
 *  Target `league` value.
 * @param { stiring } fixtureUrl
 *  Target `fixture` value.
 * @param { stiring } playerUrl
 *  Target `player` value.
 * @param { stiring } competitionMainUrl
 *  Target `competition (lobby)` value.
 * @param { stiring } competitionUrl
 *  Target `competition (target)` value.
 * @returns { Promise < Response > }
 */
async function validUrlCheck
  (
    langUrl: string,
    sportUrl: string,
    countryUrl: string,
    leagueUrl: string,
    fixtureUrl: string,
    playerUrl: string,
    competitionMainUrl: string,
    competitionUrl: string,
    authorArticleUrl: string,
    authorTagUrl: string,
    authorUrl: string

  ): Promise<Response>
{
  const validUrl: number[] = [];

  if (langUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A9, langUrl) as number);
  ;
  if (sportUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A10, `${langUrl}_${sportUrl}`) as number);
  ;
  if (countryUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A11, `${langUrl}_${countryUrl}`) as number);
  ;
  if (leagueUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A12, leagueUrl) as number);
  ;
  if (fixtureUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A13, fixtureUrl) as number);
  ;
  if (playerUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A14, playerUrl) as number);
  ;
  if (competitionMainUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A17, `${langUrl}_${competitionMainUrl}`) as number);
  ;
  if (competitionUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A19, `${competitionUrl}`) as number);
  ;
  if (authorArticleUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A22, `${authorArticleUrl}`) as number);
  ;
  if (authorTagUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A23, `${authorTagUrl}`) as number);
  if (authorUrl)
    validUrl.push(await new _Redis().rSISMEMBER(RedisKeys?.SAP_C_D_A23, `${authorUrl}`) as number);

  // ### [🐞]
  console.debug
    (
      `🔹 [var] ➤ validUrl ${validUrl}`
    );

  // ### CHECK
  // ### for an invalid `url` segment.
  const if_M_0: boolean =
    validUrl.includes(0)
    ;
  if (if_M_0) return json(false);

  return json(true);
}

// ### TODO:
// ### fallback for league/tournament page DATA (critical)

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **SEO Page**  Main Data.
 * @param { number } player_id
 *  Target `player id`.
 * @returns { Promise < B_SAP_PP_D > }
 */
async function fallbackMainData_0
  (
    player_id: number
  ): Promise<B_SAP_PP_D>
{

  const dataRes0: [Map<number, B_SAP_PP_D>, string[]] = await entryPageDataPlayer
    (
      [player_id]
    )

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

  return dataRes0?.[0]?.get(player_id);
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Fallback logic for **SEO Page** Main Data.
 * @param { number } fixtureId
 *  Target `fixture Id`.
 * @returns { Promise < B_SAP_FP_D > }
 */
async function fallbackMainData_2
  (
    fixtureId: number
  ): Promise<B_SAP_FP_D>
{
  const dataRes0: [Map<number, B_SAP_FP_D>, string[]] = await entryPageDataFixture
    (
      [fixtureId]
    )

  if (dataRes0?.[0]?.size == 0)
    return null;
  ;

  return dataRes0?.[0]?.get(fixtureId)
}

/**
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 Hasura fallback to target competition page critical (SEO/preload) data.
 * @param { number } competitionId
 *  Target competition Id.
 * @returns { Promise < B_SAP_CTP_D > }
 */
async function fallbackMainData_3
  (
    competitionId: number
  ): Promise<B_SAP_CTP_D>
{
  const dataRes0: [Map<number, B_SAP_CTP_D>, string[]] = await entryPageDataCompetition
    (
      [competitionId]
    );

  if (dataRes0?.[0]?.size == 0) return null;

  return dataRes0?.[0]?.get(competitionId)
}

// #endregion ➤ 🛠️ METHODS