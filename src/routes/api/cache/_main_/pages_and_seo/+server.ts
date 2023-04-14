import { SAP_C_D_A0, SAP_C_D_A1, SAP_C_D_A2, SAP_C_D_A3, SAP_C_D_A4, SAP_C_D_A5, SAP_C_D_A6, SAP_C_D_A7, SAP_C_D_A8 } from '@betarena/scores-lib/dist/redis/config';
import { json } from '@sveltejs/kit';

import {
  get_target_hset_cache_data,
  get_target_set_cache_data
} from '../../std_main';

/** @type {import('./$types').RequestHandler} */
export async function GET(req): Promise<unknown> {
	const url: string =
		req.url['searchParams'].get('url');
	const lang: string =
		req.url['searchParams'].get('lang');
	const page:
		| 'homepage'
		| 'tournaments'
		| 'fixtures'
    | 'fixtures2' =
		req.url['searchParams'].get('page');
	const fixture_id: string =
		req.url['searchParams'].get('fixture_id');
	const country_id: string =
		req.url['searchParams'].get('country_id');
	const sport: string =
		req.url['searchParams'].get('sport');
  const months: string =
		req.url['searchParams'].get('months');

	// [sitemap-check V2]
	if (url && !page && !lang) {
		const response_cache =
			await get_target_set_cache_data(
				SAP_C_D_A0,
				url
			);
		if (response_cache == 1) {
			return json(response_cache);
		}
		return json(null);
	}

	// [home-page-SEO-GET]
	if (lang && page === 'homepage') {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A1,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [tournament-page-INFO-GET]
	if (url && page === 'tournaments') {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A3,
				url
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [tournament-page-SEO-GET]
	if (lang && page === 'tournaments') {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A2,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [fixture-page-INFO-GET]
	if (fixture_id && page === 'fixtures') {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A5,
				fixture_id
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [fixture-page-SEO-GET]
	if (lang && page === 'fixtures') {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A4,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [general-translation-country-INFO-GET]
	if (country_id) {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A7,
				country_id
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [general-translation-sport-INFO-GET]
	if (sport) {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A6,
				sport
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

  // [general-translation-months-INFO-GET]
	if (months && lang) {
		const response_cache =
			await get_target_hset_cache_data(
				SAP_C_D_A8,
				lang
			);
		if (response_cache) {
			return json(response_cache);
		}
	}

	return json(null);
}
