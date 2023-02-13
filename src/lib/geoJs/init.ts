/**
 * GEOJS FUNCTIONS
 * ------------------
 * & methods;
 */
import { get } from '$lib/api/utils';

import type { GeoJsResponse } from '$lib/models/geojs-types';

export async function getUserLocation(): Promise<GeoJsResponse> {
	const response = await get(
		`https://get.geojs.io/v1/ip/geo.json`
	);
	return response;
}

export async function getUserLocationFromIP(
	ip: string
): Promise<GeoJsResponse> {
	const response = await get(
		`https://get.geojs.io/v1/ip/geo/${ip}.json`
	);
	return response;
}
