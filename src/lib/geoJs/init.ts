/**
 * GEOJS FUNCTIONS
 * ------------------
 * & methods;
 */
import { dev } from '$app/env';

import { get } from '$lib/api/utils';

import type { GeoJsResponse } from '$lib/models/geojs-types';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * [ℹ] checks for the users location
 * [ℹ] and stores it for future use;
 */
export async function getUserLocation(): Promise<GeoJsResponse> {
	// [ℹ] push-request;
	const response = await get(`https://get.geojs.io/v1/ip/geo.json`);
	// [🐛] debug;
	if (dev) console.info('GoeJS Response', response);
	// [ℹ] return;
	return response;
}
