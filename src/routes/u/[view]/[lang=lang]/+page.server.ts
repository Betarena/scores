/**
 * ========================
 * PRE-LOAD [THIS] PAGE DATA
 * RUN ON CLIENT-SIDE
 * ========================
 */

import type { REDIS_CACHE_SINGLE_profile_translation } from '$lib/models/profile/account-setting/types';
import { dlog } from '$lib/utils/debug';
import { redirect } from '@sveltejs/kit';
import cookie from 'cookie';
import type { PageServerLoadEvent } from './$types';

/** @type {import('./$types').PageServerLoadEvent} */
export async function load(event: PageServerLoadEvent): Promise<PageServerLoadEvent> {

  const {
    params,
    fetch
  } = event

    // [🐞] console.log(event)

    const cookies = cookie.parse(
      event.request.headers.get('cookie') || ''
    );
    const loggedInCookie = cookies?.betarenaCookieLoggedIn
     // [🐞] console.log('👀', cookies?.betarenaCookieLoggedIn)

    // [ℹ] validation [1]
    if (loggedInCookie == undefined || loggedInCookie == null) {
      const { lang } = params;
      const url = lang == undefined || lang == 'en' ? '/' : `/${lang}`
      // [ℹ] return to HOMEPAGE (w/ correct lang)
      throw redirect(302, url);
    }

		const urlLang: string =
			params.lang == undefined 
      || params?.lang == 'en'
				? 'en'
				: params.lang;

     // [🐞] console.log(`🔵 ${urlLang}`)
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
}
