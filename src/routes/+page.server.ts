import { get } from '$lib/api/utils';
import {
	ERROR_CODE_PRELOAD,
	LAYOUT_1_LANG_PAGE_ERROR_MSG
} from '$lib/utils/debug';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

/** @type {import('./$types').PageServerLoad} */
export async function load(event): Promise<PageServerLoad> {

  const {
    url,
    fetch,
    params,
    setHeaders
  } = event

  // ==================
  // NOTE: TEST
  // [ℹ] Attempt to Identify the USERS IP from "load()"
  // [ℹ] only works with deployment using '<node-server>.js'
  // ==================
  
  try {
    // [ℹ] V1 | ❌ does not appear to work - breaks platform
    // const response_IP = await fetch(`/getClientIP`, {
    // const response_IP_3 = await fetch(`https://betarena-scores-platform.herokuapp.com/getClientIP`, {
    // console.log("🔵🔵🔵 response_IP: ", response_IP);
    // [ℹ] V2 | ✅ works [?] but incorrect IP
    // console.log("🔵🔵🔵 event: ", event);
    console.log("🔵🔵🔵🔺 event.getClientAddress(): ", event?.getClientAddress());
    // [ℹ] V3 | ✅ works [?] only on when calling directly URL, not from .server.ts
    const response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
    console.log("🔵🔵🔵🔺 response_IP_2: ", response_IP_2);
    // [ℹ] V3 | ❓ works [?] but incorrect IP
    const response_IP_3 = await get(`/getClientIP`)
    console.log("🔵🔵🔵🔺 response_IP_3: ", response_IP_3);
  } catch (error) {
    console.log(`🔴 ${error}`)
  }

  return
}
