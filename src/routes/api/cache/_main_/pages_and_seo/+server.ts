import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';

import {
	cache_country_translations,
	cache_fixtures_info_key,
	cache_fixtures_seo_key,
	cache_homepage_seo_key,
	cache_sitemap_urls_key,
	cache_sport_translations,
	cache_tournaments_info_key,
	cache_tournaments_seo_key,
	get_target_hset_cache_data,
	get_target_set_cache_data
} from '../../std_main';

/** @type {import('./$types').RequestHandler} */
export async function GET(req, res): Promise<any> {
	const url: string = req.url['searchParams'].get('url');
	const lang: string = req.url['searchParams'].get('lang');
	const page: 'homepage' | 'tournaments' | 'fixtures' = req.url['searchParams'].get('page');
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
	const country_id: string = req.url['searchParams'].get('country_id');
	const sport: string = req.url['searchParams'].get('sport');

	// [sitemap-check V2]
	if (url && !page && !lang) {
		const response_cache = await get_target_set_cache_data(cache_sitemap_urls_key, url);
		if (response_cache == 1) {
			return json(response_cache);
		}
		return json(null);
	}

	// [home-page-SEO-GET]
	if (lang && page === 'homepage') {
		const response_cache = await get_target_hset_cache_data(cache_homepage_seo_key, lang);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [tournament-page-INFO-GET]
	if (url && page === 'tournaments') {
		const response_cache = await get_target_hset_cache_data(cache_tournaments_info_key, url);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [tournament-page-SEO-GET]
	if (lang && page === 'tournaments') {
		const response_cache = await get_target_hset_cache_data(cache_tournaments_seo_key, lang);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [fixture-page-INFO-GET]
	if (fixture_id && page === 'fixtures') {
		const response_cache = await get_target_hset_cache_data(cache_fixtures_info_key, fixture_id);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [fixture-page-SEO-GET]
	if (lang && page === 'fixtures') {
		const response_cache = await get_target_hset_cache_data(cache_fixtures_seo_key, lang);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [general-translation-country-INFO-GET]
	if (country_id) {
		const response_cache = await get_target_hset_cache_data(cache_country_translations, country_id);
		if (response_cache) {
			return json(response_cache);
		}
	}

	// [general-translation-sport-INFO-GET]
	if (sport) {
		const response_cache = await get_target_hset_cache_data(cache_sport_translations, sport);
		if (response_cache) {
			return json(response_cache);
		}
	}

	return json(null);
}
