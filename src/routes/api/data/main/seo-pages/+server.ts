  //#region ➤ Package Imports

import { initGrapQLClient } from '$lib/graphql/init';
import { SEO_FS_ENTRY, SEO_PS_ENTRY } from '@betarena/scores-lib/dist/functions/func.seo-pages.js';
import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import { json } from '@sveltejs/kit';
import { get_target_hset_cache_data, get_target_set_cache_data } from '../../../cache/std_main';

import type { B_SAP_FP_D, B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages';

  //#endregion ➤ Package Imports

  //#region ➤ [VARIABLES] Imports

type PAGE_TYPE = 'homepage' | 'tournaments' | 'fixtures' | 'player';

const graphQlInstance = initGrapQLClient()

  //#endregion ➤ [VARIABLES] Imports

  //#region ➤ [METHODS]

/** @type {import('./$types').RequestHandler} */
export async function GET
(
  req
): Promise < unknown > 
{
  // IMPORTANT
  // valid url check;
	const langUrl: string =	req?.url?.searchParams?.get('langUrl');
	const sportUrl: string = req?.url?.searchParams?.get('sportUrl');
	const countryUrl: string = req?.url?.searchParams?.get('countryUrl');
	const leagueUrl: string =	req?.url?.searchParams?.get('leagueUrl');
	const fixtureUrl: string = req?.url?.searchParams?.get('fixtureUrl');
	const playerUrl: string =	req?.url?.searchParams?.get('playerUrl');

  // SEO & page data;
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

  // [1] valid url;
  const if_M_0 =
    langUrl
    || sportUrl
    || countryUrl
    || leagueUrl
    || fixtureUrl
    || playerUrl
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
      playerUrl
    )
	}

  // [2] page (home) SEO
  const if_M_1 =
    lang
    && page === 'homepage'
  ;
	if (if_M_1) 
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A1,
      lang
    );
		if (data) return json(data);
	}

  // [3] page (tournament) DATA
  const if_M_2 =
    url 
    && page === 'tournaments'
  ;
	if (if_M_2) 
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A3,
      url
    );
		if (data)	return json(data);
	}

  // [4] page (tournament) SEO
  const if_M_3 =
    lang 
    && page === 'tournaments'
  ;
	if (if_M_3) 
  {
		const data = await get_target_hset_cache_data
    (
			RedisKeys.SAP_C_D_A2,
      lang
    );
		if (data) return json(data);
	}

  // [5] page (fixture) DATA 
  // NOTE: (w/fallback)
  const if_M_4 =
    fixture_id 
    && page === 'fixtures'
  ;
	if (if_M_4) 
  {
    
    const _fixture_id: number = parseInt(fixture_id)
    let data;
    let loadType = "cache";

    // NOTE: check in cache;
    if (!hasura) 
    {
      data = await get_target_hset_cache_data
      (
        RedisKeys.SAP_C_D_A5,
        fixture_id
      );
    }

    // NOTE: (default) fallback;
		if (!data || hasura) 
    {
      data = await fallbackMainData_2
      (
        _fixture_id
      );
      loadType = 'HASURA'
		}

    console.log(`📌 loaded [PFIX] with: ${loadType}`)

    return json(data);

	}

  // [6] page (fixture) SEO
  const if_M_5 =
    lang 
    && page === 'fixtures'
  ;
	if (if_M_5) 
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A4,
      lang
    );
		if (data)	return json(data);
	}

  // [7] page (player) DATA 
  // NOTE: (w/fallback)
  const if_M_6 =
    player_id 
    && page === 'player'
  ;
  if (if_M_6) 
  {

    const _player_id: number = parseInt(player_id)
    let data;
    let loadType = "cache";

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

  // [8] page (player) SEO
  const if_M_7 =
    lang 
    && page === 'player'
  ;
  if (if_M_7) 
  {
    const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A15,
      lang
    );
    return json(data);
  }

  // [9] page (country) TRANSLATION(s)
	if (country_id) 
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A7,
      country_id
    );
		if (data) return json(data);
	}

  // [10] page (term) TRANSLATION(s)
	if (term) 
  {
		const data = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A6,
      term
    );
		if (data) return json(data);
	}

  // [11] page (months) TRANSLATION(s)
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

// ============
// HELPER METHODS
// ============

async function validUrlCheck
(
  langUrl: string,
  sportUrl: string,
  countryUrl: string,
  leagueUrl: string,
  fixtureUrl: string,
  playerUrl: string
): Promise < Response >
{
  const validUrl: number[] = []
  if (langUrl) validUrl.push(await get_target_set_cache_data(RedisKeys.SAP_C_D_A9, langUrl) as number)
  if (sportUrl) validUrl.push(await get_target_set_cache_data(RedisKeys.SAP_C_D_A10, `${langUrl}_${sportUrl}`) as number)
  if (countryUrl) validUrl.push(await get_target_set_cache_data(RedisKeys.SAP_C_D_A11, `${langUrl}_${countryUrl}`) as number)
  if (leagueUrl) validUrl.push(await get_target_set_cache_data(RedisKeys.SAP_C_D_A12, leagueUrl) as number)
  if (fixtureUrl) validUrl.push(await get_target_set_cache_data(RedisKeys.SAP_C_D_A13, fixtureUrl) as number)
  if (playerUrl) validUrl.push(await get_target_set_cache_data(RedisKeys.SAP_C_D_A14, playerUrl) as number)
  const validation_0 =
    validUrl.includes(0)
  ;
  if (validation_0) return json(false);
  return json(true);
}

// ============
//  [MAIN] METHOD
// ============

// TODO: fallback for league/tournament page DATA (critical)

async function fallbackMainData_0 
(
  player_id: number
): Promise < B_SAP_PP_D > 
{

  const map = await SEO_PS_ENTRY
  (
    graphQlInstance,
    [player_id]
  )

  if (map.size == 0) {
    return null
  }
  
	return map.get(player_id);
}

async function fallbackMainData_2
(
  fixtureId: number
) : Promise < B_SAP_FP_D >
{
  const map = await SEO_FS_ENTRY 
  (
    graphQlInstance,
    [fixtureId]
  )

  if (map.size == 0) 
  {
    return null;
  }

  return map.get(fixtureId)
}

  //#endregion ➤ [METHODS]