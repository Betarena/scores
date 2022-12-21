import {
  error,
  redirect
} from '@sveltejs/kit';

/** 
 * @type {import('./$types').PageLoad} 
 */
export async function load({
  url,
  fetch
}) {

  /**
   * [ℹ] Ensure URL Check Existance; 
   */

  const response_valid_url = await fetch(`/api/cache/_main_/pages_and_seo?url=${url.pathname}`, {
    method: 'GET'
  }).then((r) => r.json());

  if (!response_valid_url) {
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  throw redirect(302, `/`);
}