import { json } from '@sveltejs/kit';

import {
	get_target_hset_cache_data,
	live_scores,
	get_target_string_cache_data,
	live_scores_leagues,
	live_scores_football_translations,
	live_scores_football_tournaments
} from '../../std_main';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(
	req: {
		url: {
			[x: string]: {
				get: (arg0: string) => string;
			};
		};
	},
	res: any
): Promise<unknown> {
	const lang = req.url['searchParams'].get('lang');
	const type: 'translations' | 'geo' | 'tournaments' = req.url['searchParams'].get('type');

	if (lang) {
		const response_seo = await get_target_hset_cache_data(live_scores, lang);
		if (response_seo) {
			return json(response_seo);
		}
	}

	if (type == 'geo') {
		const response_usergeo = await get_target_string_cache_data(live_scores_leagues);
		if (response_usergeo) {
			return json(response_usergeo);
		}
	}

	if (type == 'translations') {
		const response_translations = await get_target_string_cache_data(
			live_scores_football_translations
		);
		if (response_translations) {
			return json(response_translations);
		}
	}

	if (type == 'tournaments') {
		const response_tournaments = await get_target_string_cache_data(
			live_scores_football_tournaments
		);
		if (response_tournaments) {
			return json(response_tournaments);
		}
	}

	return json(null);
}