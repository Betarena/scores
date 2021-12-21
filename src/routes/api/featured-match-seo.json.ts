// ... import $app `modules`;
import { amp, browser, dev, mode, prerendering } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import { GET_FEATURED_MATCH_TRANSLATION } from '$lib/graphql/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Featured_Match_Translation_Response } from '$lib/model/response_models';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ...
export async function get({ req, res }): Promise<any> {
	// ... get the USER-GEO-LOCATION;
	const response = await get_FeaturedMatchTranslation();
	// ... DEBUGGING;
	if (dev) console.info('-- featured-match.json --', response);
	// ... return, RESPONSE;
	return {
		body: response
	};
}

// ...
async function get_FeaturedMatchTranslation(): Promise<Featured_Match_Translation_Response> {
	// ... GRAQPH-QL response;
	const response = await initGrapQLClient().request(GET_FEATURED_MATCH_TRANSLATION);
	// ... return, RESPONSE;
	return response;
}
