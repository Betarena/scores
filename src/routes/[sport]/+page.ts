import {
  error,
  redirect
} from '@sveltejs/kit';
import {
  dev
} from '$app/env';
import type {
  PageLoad
} from './$types';

/** 
 * @type {import('./$types').PageLoad} 
 */
export async function load({
  url,
  params,
  fetch,
  setHeaders
}): PageLoad {

  /**
   * [ℹ] Ensure URL Check Existance; 
   */

  const response_valid_url = await fetch(`/api/cache/pages_and_seo?url=` + url.pathname, {
    method: 'GET'
  }).then((r) => r.json());

  if (!response_valid_url) {
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  throw redirect(302, `/`);
}