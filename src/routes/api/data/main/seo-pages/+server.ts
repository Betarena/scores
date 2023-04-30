import * as RedisKeys from '@betarena/scores-lib/dist/redis/config.js';
import { json } from '@sveltejs/kit';

import {
  get_target_hset_cache_data,
  get_target_set_cache_data
} from '../../../cache/std_main';

type PAGE_TYPE = 'homepage' | 'tournaments' | 'fixtures' | 'fixtures2'

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
	const sport: string = req?.url?.searchParams?.get('sport');
  const months: string = req?.url?.searchParams?.get('months');

  // [1] valid url;
  const validation_0 =
    langUrl
    || sportUrl
    || countryUrl
    || leagueUrl
    || fixtureUrl
    || playerUrl
  ;
	if (validation_0) {
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
  const validation_1 =
    lang
    && page === 'homepage'
  ;
	if (validation_1) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A1,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [3] page (tournament) DATA
  const validation_2 =
    url 
    && page === 'tournaments'
  ;
	if (validation_2) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A3,
				url
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [4] page (tournament) SEO
  const validation_3 =
    lang 
    && page === 'tournaments'
  ;
	if (validation_3) {
		const response_cache =
			await get_target_hset_cache_data(
			RedisKeys.SAP_C_D_A2,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [5] page (fixture) DATA
  const validation_4 =
    fixture_id 
    && page === 'fixtures'
  ;
	if (validation_4) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A5,
				fixture_id
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [6] page (fixture) SEO
  const validation_5 =
    lang 
    && page === 'fixtures'
  ;
	if (validation_5) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A4,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [7] page (country) TRANSLATION(s)
	if (country_id) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A7,
				country_id
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [8] page (sport) TRANSLATION(s)
	if (sport) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A6,
				sport
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [9] page (months) TRANSLATION(s)
	if (months && lang) {
		const response_cache =
			await get_target_hset_cache_data(
				RedisKeys.SAP_C_D_A8,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
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