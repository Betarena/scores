// #region ➤ 📦 Package Imports

import { initGrapQLClient } from '$lib/graphql/init';
import { SEO_FS_ENTRY, SEO_PS_ENTRY } from '@betarena/scores-lib/dist/functions/func.main.seo-pages.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import { json } from '@sveltejs/kit';
import { get_target_hset_cache_data, get_target_set_cache_data } from '../../../../../lib/redis/std_main';

import type { B_SAP_FP_D, B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

type PAGE_TYPE =
  | 'homepage'
  | 'tournaments'
  | 'fixtures'
  | 'player'
  | 'competitions'
;

const graphQlInstance = initGrapQLClient()

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET
(
  req
): Promise < unknown >
{
  // ### IMPORTANT
  // ### required for target URL validity check.
	const langUrl: string =	req?.url?.searchParams?.get('langUrl');
	const sportUrl: string = req?.url?.searchParams?.get('sportUrl');
	const countryUrl: string = req?.url?.searchParams?.get('countryUrl');
	const leagueUrl: string =	req?.url?.searchParams?.get('leagueUrl');
	const fixtureUrl: string = req?.url?.searchParams?.get('fixtureUrl');
	const playerUrl: string =	req?.url?.searchParams?.get('playerUrl');
  const competitionMainUrl: string = req?.url?.searchParams?.get('competitionMainUrl');

  // ### IMPORTANT
  // ### required for target SEO & Page data.
	const url: string = req?.url?.searchParams?.get('url');
	const lang: string = req?.url?.searchParams?.get('lang');
	const page: PAGE_TYPE =	req?.url?.searchParams?.get('page') as PAGE_TYPE;
	const country_id: string = req?.url?.searchParams?.get('country_id');
	const fixture_id: string = req?.url?.searchParams?.get('fixture_id');
	const player_id: string = req?.url?.searchParams?.get('player_id');
	const term: string = req?.url?.searchParams?.get('term');
  const months: string = req?.url?.searchParams?.get('months');
  const hasura: string = req?.url?.searchParams?.get('hasura');

  // TODO: add (hasura/postgresql) fallback for all METHODS below;
  // TODO: add player (page) sections into the mix of METHODS below;

  // ### CHECK
  // ### for target URL validity.
  // ### NOTE:
  // ### cache solution only.
  const if_M_0: boolean =
    langUrl != undefined
    || sportUrl != undefined
    || countryUrl != undefined
    || leagueUrl != undefined
    || fixtureUrl != undefined
    || playerUrl != undefined
    || competitionMainUrl != undefined
  ;
	if (if_M_0)
  {
		return validUrlCheck
    (
      langUrl,
      sportUrl,
      countryUrl,
      leagueUrl,
      fixtureUrl,
      playerUrl,
      competitionMainUrl
    )
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
		const data: unknown = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A1,
      lang
    );
		if (data) return json(data);
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
		const data: unknown = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A3,
      url
    );
		if (data)	return json(data);
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
		const data: unknown = await get_target_hset_cache_data
    (
			RedisKeys.SAP_C_D_A2,
      lang
    );
		if (data) return json(data);
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
    let data;
    let loadType: string = "cache";

    // ### CHECK
    // ### for cache.
    if (!hasura)
    {
      data = await get_target_hset_cache_data
      (
        RedisKeys.SAP_C_D_A5,
        fixture_id
      );
    }

    // ### CHECK
    // ### for default hasura fallback.
		if (!data || hasura)
    {
      data = await fallbackMainData_2
      (
        _fixture_id
      );
      loadType = 'HASURA'
		}

    // ### [🐞]
    console.log(`📌 loaded [PFIX] with: ${loadType}`)

    return json(data);
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
		const data: unknown = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A4,
      lang
    );
		if (data)	return json(data);
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
    let data;
    let loadType: string = "cache";

    // NOTE: check in cache;
    if (!hasura)
    {
      data = await get_target_hset_cache_data
      (
        RedisKeys.SAP_C_D_A16,
        player_id
      );
    }

    // NOTE: (default) fallback;
		if (!data || hasura)
    {
      data = await fallbackMainData_0
      (
        _player_id
      );
      loadType = 'HASURA'
		}

    console.log(`📌 loaded [PPLAY] with: ${loadType}`)

    return json(data);
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
    const data: unknown = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A15,
      lang
    );
    return json(data);
  }

  // ### CHECK
  // ### for target data retrieve of page (competitions) MAIN SEO.
  // ### NOTE:
  // ### cache solution only.
  const if_M_8: boolean =
    lang
    && page === 'competitions'
  ;
  if (if_M_8)
  {
    const data: unknown = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A18,
      lang
    );
    return json(data);
  }

  // ### CHECK
  // ### for target data retrieve of page (country) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
	if (country_id)
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A7,
      country_id
    );
		if (data) return json(data);
	}

  // ### CHECK
  // ### for target data retrieve of page (terms) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
	if (term)
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A6,
      term
    );
		if (data) return json(data);
	}

  // ### CHECK
  // ### for target data retrieve of page (months) TRANSLATION(s).
  // ### NOTE:
  // ### cache only.
	if (months && lang)
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A8,
      lang
    );
		if (data) return json(data);
	}

	return json(null);
}

// ****************************************************
// 📌 HELPER METHODS                                  *
// ****************************************************

async function validUrlCheck
(
  langUrl: string,
  sportUrl: string,
  countryUrl: string,
  leagueUrl: string,
  fixtureUrl: string,
  playerUrl: string,
  competitionMainUrl: string
): Promise < Response >
{
  const validUrl: number[] = [];

  if (langUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A9, langUrl) as number);
  ;
  if (sportUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A10, `${langUrl}_${sportUrl}`) as number);
  ;
  if (countryUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A11, `${langUrl}_${countryUrl}`) as number);
  ;
  if (leagueUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A12, leagueUrl) as number);
  ;
  if (fixtureUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A13, fixtureUrl) as number);
  ;
  if (playerUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A14, playerUrl) as number);
  ;
  if (competitionMainUrl)
    validUrl.push(await get_target_set_cache_data(RedisKeys?.SAP_C_D_A17, `${langUrl}_${competitionMainUrl}`) as number);
  ;

  const if_M_0: boolean =
    validUrl.includes(0)
  ;
  if (if_M_0) return json(false);
  return json(true);
}

// ****************************************************
// 📌 MAIN METHOD                                     *
// ****************************************************

// TODO: fallback for league/tournament page DATA (critical)

async function fallbackMainData_0
(
  player_id: number
): Promise < B_SAP_PP_D >
{

  const dataRes0 = await SEO_PS_ENTRY
  (
    graphQlInstance,
    [player_id]
  )

  if (dataRes0?.[0].size == 0) {
    return null
  }

	return dataRes0?.[0].get(player_id);
}

async function fallbackMainData_2
(
  fixtureId: number
) : Promise < B_SAP_FP_D >
{
  const dataRes0 = await SEO_FS_ENTRY
  (
    graphQlInstance,
    [fixtureId]
  )

  if (dataRes0?.[0]?.size == 0)
  {
    return null;
  }

  return dataRes0?.[0].get(fixtureId)
}

// #endregion ➤ 🛠️ METHODS