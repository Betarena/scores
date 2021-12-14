/**
 * GEOJS FUNCTIONS
 * ------------------
 * & methods; 
*/
import { amp, browser, dev, mode, prerendering } from '$app/env'

import { get } from '$lib/api/utils'

import type { GeoJsResponse } from "$lib/model/geo-js-interface"

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... checks for the users location
 * ... and stores it for future use;
*/
export async function getUserLocation(): Promise < GeoJsResponse > {
    // ... push-request;
    const response = await get(`https://get.geojs.io/v1/ip/geo.json`)
    // ... DEBUGGING;
    if (dev) console.info('GoeJS Response', response)
    // ... return;
    return response
}