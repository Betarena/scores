/**
 * ========================
 * PRE-LOAD [THIS] PAGE DATA
 * RUN ON CLIENT-SIDE
 * ========================
 */

import type { REDIS_CACHE_SINGLE_profile_translation } from '$lib/models/profile/account-setting/types';
import { dlog, errlog } from '$lib/utils/debug';
import type { PageLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export async function load({
	params,
	fetch
}): Promise<PageLoad> {
	try {
		const urlLang: string =
			params.lang == undefined
				? 'en'
				: params.lang;
		const promise_urls = [
			`/api/hasura/profile?lang=${urlLang}` // profile-page translations
		];
		const promises = promise_urls.map((_url) =>
			fetch(_url).then((response) =>
				response.json()
			)
		);
		const preload_data = await Promise.all(
			promises
		);
		dlog(preload_data, true);
		const RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation =
			preload_data[0];
		// FIXME: sveltekit PageLoad types not working
		return {
			RESPONSE_PROFILE_DATA
		};
	} catch (error) {
		errlog(error);
		throw error(
			400,
			`Uh-oh! There has been an /{__layout} page preloading error`
		);
	}
}
