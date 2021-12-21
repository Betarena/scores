/**
 * GEOJS FUNCTIONS
 * ------------------
 * & methods;
 */
import { dev } from '$app/env';

import { get } from '$lib/api/utils';

import type { GeoJsResponse } from '$lib/model/geo-js-interface';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... checks for the users location
 * ... and stores it for future use;
 */
export async function getUserLocation(): Promise<GeoJsResponse> {
	// ... DEBUGGING;
	console.info('-- getUserLocation() checkpoint --');
	// ... push-request;
	const response = await get(`https://get.geojs.io/v1/ip/geo.json`);
	// ... DEBUGGING;
	console.info('GoeJS Response', response);
	// ... return;
	return response;
}
