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
	const response = await get(`https://get.geojs.io/v1/ip/geo.json`);
	return response;
}

export async function getUserLocationFromIP(ip:string): Promise< GeoJsResponse > {
	const response = await get(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
	return response;
}
