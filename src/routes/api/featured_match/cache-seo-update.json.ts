// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import { GET_FEATURED_MATCH_TRANSLATION } from '$lib/graphql/query';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Featured_Match_Translation_Response, TranslationsResponse } from '$lib/model/response_models';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ... ALWAYS POST - HASURA TRIGGER PAYLOAD;
export async function get(): Promise< any > {
	// ... get the USER-GEO-LOCATION;
	const response = await get_FeaturedMatchTranslation();
	// ... DEBUGGING;
	if (dev) console.info('-- featured-match.json --', response);
	// ... cache-response;
	await cacheFeaturedMatchSEOResponse(response)
	// ... return, RESPONSE;
	return {
        status: 200,
        body: 'Success! Featured Match SEO has been updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheFeaturedMatchResponse(geoPos, json_cache)
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheFeaturedMatchSEOResponse(json_cache: Featured_Match_Translation_Response) {
    // ... TRY;
    try {
        //... store (cache) featured_match response,
        await redis.hset('seo', 'featured_match', JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", 'seo - featured_match', e);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - get_FeaturedMatchTranslation()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_FeaturedMatchTranslation(): Promise<Featured_Match_Translation_Response> {
	// ... GRAQPH-QL response;
	const response = await initGrapQLClient().request(GET_FEATURED_MATCH_TRANSLATION);
	// ... return, RESPONSE;
	return response;
}