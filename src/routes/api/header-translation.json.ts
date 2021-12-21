// ... import $app `modules`
import { amp, browser, dev, mode, prerendering } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import { GET_WEBSITE_ALL_LANG_TRANSLATIONS } from '$lib/graphql/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get(req, res): Promise<any> {
	// ... GRAQPH-QL response;
	const response = await initGrapQLClient().request(GET_WEBSITE_ALL_LANG_TRANSLATIONS);
	// ... DEBUGGING;
	if (dev) console.debug('-- response --', response);
	// ... return, RESPONSE;
	return {
		status: response.status,
		body: response
	};
}
