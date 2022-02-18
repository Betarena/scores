// ... import $app `modules`;
import { dev } from '$app/env';

// ... import necessary LIBRARIES & MODULES;
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import redis from "$lib/redis/init"

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { Scores_Featured_Betting_Sites_Hasura } from '$lib/models/featured_betting_sites/firebase-real-db-interface';
import { GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES } from '$lib/graphql/featured_betting_sites/query';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

// ... ALWAYS POST - HASURA TRIGGER PAYLOAD;
export async function get(): Promise< any > {
	// ... get the USER-GEO-LOCATION;
	const response = await get_FeaturedBettingSiteTranslation();
	// ... DEBUGGING;
	if (dev) console.info('-- featured-match.json --', response);
	// ... cache-response;
	await cacheFeaturedBettingSiteSEOResponse(response)
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

async function cacheFeaturedBettingSiteSEOResponse(json_cache: Scores_Featured_Betting_Sites_Hasura) {
    // ... TRY;
    try {
        //... store (cache) featured_betting_sites response,
        await redis.hset('seo', 'featured_betting_sites', JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", 'seo - featured_betting_sites', e);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - get_FeaturedMatchTranslation()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_FeaturedBettingSiteTranslation(): Promise< Scores_Featured_Betting_Sites_Hasura > {
	// ... GRAQPH-QL response;
    const response: Scores_Featured_Betting_Sites_Hasura = await initGrapQLClient().request(GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES)
    // ... DEBUGGING;
    if (dev) console.info('-- get_FeaturedBettingSiteTranslation() --', response)
	// ... return, RESPONSE;
	return response;
}